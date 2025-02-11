package com.ssafy.foodthink.myOwnRecipe.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.foodthink.elasticsearch.service.ElasticSearchService;
import com.ssafy.foodthink.global.S3Service;
import com.ssafy.foodthink.myOwnRecipe.dto.*;
import com.ssafy.foodthink.myOwnRecipe.repository.MyOwnRecipeListRepository;
import com.ssafy.foodthink.recipeBookmark.repository.RecipeBookmarkRepository;
import com.ssafy.foodthink.recipes.dto.IngredientDto;
import com.ssafy.foodthink.recipes.dto.ProcessDto;
import com.ssafy.foodthink.recipes.dto.ProcessImageDto;
import com.ssafy.foodthink.recipes.entity.IngredientEntity;
import com.ssafy.foodthink.recipes.entity.ProcessEntity;
import com.ssafy.foodthink.recipes.entity.ProcessImageEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.recipes.repository.IngredientRepository;
import com.ssafy.foodthink.recipes.repository.ProcessImageRepository;
import com.ssafy.foodthink.recipes.repository.ProcessRepository;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import com.ssafy.foodthink.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MyOwnRecipeService {

    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;
    private final ProcessRepository processRepository;
    private final ProcessImageRepository processImageRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;
    private final JWTUtil jwtUtil;

    private final MyOwnRecipeListRepository myOwnRecipeListRepository;
    private final RecipeBookmarkRepository recipeBookmarkRepository;
    private final ElasticSearchService elasticSearchService;

    //레시피 등록
    @Transactional
    public Long createRecipe(MyRecipeWriteRequestDto dto, MultipartFile imageFile) {

        log.info(dto.toString()); // 레시피 저장 요청

        // 사용자 인증 : JWT
        UserEntity user = userRepository.findByUserId(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다."));

        // 대표 이미지 업로드
        String recipeImageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            recipeImageUrl = s3Service.uploadFile(imageFile);
        }

        try {
            // 레시피 엔티티 생성 및 저장
            RecipeEntity recipeEntity = new RecipeEntity();
            recipeEntity.setUserEntity(user);
            recipeEntity.setRecipeTitle(dto.getRecipeTitle());
            recipeEntity.setCateType(dto.getCateType());
            recipeEntity.setCateMainIngre(dto.getCateMainIngre());
            recipeEntity.setServing(dto.getServing());
            recipeEntity.setLevel(dto.getLevel());
            recipeEntity.setRequiredTime(dto.getRequiredTime());
            recipeEntity.setIsPublic(dto.isPublic());
            recipeEntity.setImage(recipeImageUrl);

            recipeRepository.save(recipeEntity);

            // 재료 저장
            List<IngredientEntity> ingredientEntities = dto.getIngredients().stream()
                    .map(ingreDto -> {
                        IngredientEntity ingredient = new IngredientEntity();
                        ingredient.setIngreName(ingreDto.getIngreName());
                        ingredient.setAmount(ingreDto.getAmount());
                        ingredient.setRecipeEntity(recipeEntity);
                        return ingredient;
                    }).collect(Collectors.toList());

            ingredientRepository.saveAll(ingredientEntities);

            // 과정 저장
            List<ProcessEntity> processEntities = dto.getProcesses().stream()
                    .map(processDto -> {
                        ProcessEntity process = new ProcessEntity();
                        process.setProcessOrder(processDto.getProcessOrder());
                        process.setProcessExplain(processDto.getProcessExplain());
                        process.setRecipeEntity(recipeEntity);
                        return process;
                    }).collect(Collectors.toList());
            processRepository.saveAll(processEntities);

            // 강제 flush() 호출 (process_id 확보)
            processRepository.flush();

            // 과정 이미지 저장 (과정 ID 매칭)
            for (ProcessRequestDto processDto : dto.getProcesses()) {
                ProcessEntity processEntity = processEntities.stream()
                        .filter(p -> p.getProcessOrder().equals(processDto.getProcessOrder()))
                        .findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("과정 매칭 실패"));

                if (processDto.getImages() != null) {
                    for (ProcessImageRequestDto imageRequestDto : processDto.getImages()) {
                        if (imageRequestDto.getProcessImage() != null && !imageRequestDto.getProcessImage().isEmpty()) {
                            String uploadedImageUrl = s3Service.uploadFile(imageRequestDto.getProcessImage());
                            ProcessImageEntity processImage = new ProcessImageEntity();
                            processImage.setImageUrl(uploadedImageUrl);
                            processImage.setProcessEntity(processEntity);
                            processImageRepository.save(processImage);
                        }
                    }
                }
            }

            log.info("레시피 저장 완료, recipeId: {}", recipeEntity.getRecipeId());

            //사용자 레시피는 엘라스틱 서버에 즉시 반영
            elasticSearchService.indexRecipeWithIngredients(recipeEntity);

            //생성된 레시피 아이디 반환
            return recipeEntity.getRecipeId();
        } catch (Exception e) {
            if (recipeImageUrl != null) {
                s3Service.deleteFileFromS3(recipeImageUrl);     // 실패 시, S3에 업로드된 이미지 삭제
            }
            throw new RuntimeException("레시피 저장 중 오류 발생", e);
        }
    }


    //수정할 레시피 내용 조회 (미리보기)
    public MyRecipeModifyReadResponseDto getRecipeForModification(Long recipeId, Long userId) {
        //레시피가 존재하는지 확인
        RecipeEntity recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("레시피를 찾을 수 없습니다."));

        //요청한 사용자가 작성한 레시피인지 확인
        if(!recipe.getUserEntity().getUserId().equals(userId)) {
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }

        //레시피 정보 DTO 변환
        MyRecipeModifyReadResponseDto responseDto = new MyRecipeModifyReadResponseDto();
        responseDto.setRecipeId(recipe.getRecipeId());
        responseDto.setRecipeTitle(recipe.getRecipeTitle());
        responseDto.setImage(recipe.getImage());
        responseDto.setCateType(recipe.getCateType());
        responseDto.setCateMainIngre(recipe.getCateMainIngre());
        responseDto.setServing(recipe.getServing());
        responseDto.setLevel(recipe.getLevel());
        responseDto.setRequiredTime(recipe.getRequiredTime());
        responseDto.setPublic(recipe.getIsPublic());

        // 재료 정보 조회
        List<IngredientDto> ingredients = ingredientRepository.findByRecipeEntity_RecipeId(recipeId).stream()
                .map(ingredient -> new IngredientDto(ingredient.getIngreName(), ingredient.getAmount()))
                .collect(Collectors.toList());
        responseDto.setIngredients(ingredients);

        // 과정 정보 조회
        List<ProcessDto> processes = processRepository.findByRecipeEntity_RecipeId(recipeId).stream()
                .map(process -> {
                    List<ProcessImageDto> processImages = process.getProcessImages().stream()
                            .map(image -> new ProcessImageDto(image.getImageUrl()))
                            .collect(Collectors.toList());
                    return new ProcessDto(process.getProcessOrder(), process.getProcessExplain(), processImages);
                })
                .collect(Collectors.toList());
        responseDto.setProcesses(processes);

        return responseDto;
    }

    @Transactional
    public Long modifyRecipe(Long userId, Long recipeId, String recipeJson, MultipartFile imageFile,
                             List<MultipartFile> processImages, List<Integer> processOrders) {

        log.info("레시피 수정 요청, userId: {}, recipeId: {}", userId, recipeId);

        // 레시피 조회
        RecipeEntity recipeEntity = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 레시피가 존재하지 않습니다."));

        // 사용자 인증 : JWT (레시피의 소유자가 맞는지 확인)
        if (!recipeEntity.getUserEntity().getUserId().equals(userId)) {
            throw new IllegalArgumentException("해당 레시피는 이 사용자가 수정할 수 없습니다.");
        }

        // recipeJson을 DTO로 변환 (예: Jackson을 이용한 파싱)
        ObjectMapper objectMapper = new ObjectMapper();
        MyRecipeModifyRequestDto dto;
        try {
            dto = objectMapper.readValue(recipeJson, MyRecipeModifyRequestDto.class);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("레시피 JSON 파싱 실패", e);
        }

        // 대표 이미지 처리
        if (imageFile != null && !imageFile.isEmpty()) {
            // 기존 이미지 삭제
            if (recipeEntity.getImage() != null) {
                s3Service.deleteFileFromS3(recipeEntity.getImage());
                log.info("기존 대표 이미지 삭제 완료");
            }

            // 새로운 이미지 업로드
            String newImageUrl = s3Service.uploadFile(imageFile);
            log.info("새로운 대표 이미지 업로드 완료, URL: {}", newImageUrl);
            recipeEntity.setImage(newImageUrl);
        }

        // 레시피 필드 수정
        recipeEntity.setRecipeTitle(dto.getRecipeTitle());
        recipeEntity.setCateType(dto.getCateType());
        recipeEntity.setCateMainIngre(dto.getCateMainIngre());
        recipeEntity.setServing(dto.getServing());
        recipeEntity.setLevel(dto.getLevel());
        recipeEntity.setRequiredTime(dto.getRequiredTime());
        recipeEntity.setIsPublic(dto.getIsPublic());

        // 기존 재료는 삭제하지 않고, 새 재료를 추가하는 방식으로 변경
        List<IngredientEntity> ingredientEntities = dto.getIngredients().stream()
                .map(ingreDto -> {
                    IngredientEntity ingredient = new IngredientEntity();
                    ingredient.setIngreName(ingreDto.getIngreName());
                    ingredient.setAmount(ingreDto.getAmount());
                    ingredient.setRecipeEntity(recipeEntity);
                    return ingredient;
                }).collect(Collectors.toList());

        // 새 재료 저장
        ingredientRepository.saveAll(ingredientEntities);

        // 기존 프로세스 및 프로세스 이미지 삭제
        processRepository.deleteAll(recipeEntity.getProcesses());

        // 새 과정 저장
        List<ProcessEntity> processEntities = dto.getProcesses().stream()
                .map(processDto -> {
                    ProcessEntity process = new ProcessEntity();
                    process.setProcessOrder(processDto.getProcessOrder());
                    process.setProcessExplain(processDto.getProcessExplain());
                    process.setRecipeEntity(recipeEntity);
                    return process;
                }).collect(Collectors.toList());
        processRepository.saveAll(processEntities);

        // 강제 flush() 호출 (process_id 확보)
        processRepository.flush();

        // 과정 이미지 저장
        for (int i = 0; i < processOrders.size(); i++) {
            Integer processOrder = processOrders.get(i);
            ProcessEntity processEntity = processEntities.stream()
                    .filter(p -> p.getProcessOrder().equals(processOrder))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("과정 매칭 실패"));

            // 해당 과정의 이미지가 있는 경우만 처리
            if (i < processImages.size() && processImages.get(i) != null && !processImages.get(i).isEmpty()) {
                MultipartFile processImageFile = processImages.get(i);
                String uploadedImageUrl = s3Service.uploadFile(processImageFile);
                ProcessImageEntity processImage = new ProcessImageEntity();
                processImage.setImageUrl(uploadedImageUrl);
                processImage.setProcessEntity(processEntity);
                processImageRepository.save(processImage);
                log.info("과정 이미지 업로드 완료, URL: {}", uploadedImageUrl);
            }
        }

        log.info("레시피 수정 완료, recipeId: {}", recipeEntity.getRecipeId());

        // 사용자 레시피는 엘라스틱 서버에 즉시 반영
//        elasticSearchService.indexRecipeWithIngredients(recipeEntity);

        // 수정된 레시피 아이디 반환
        return recipeEntity.getRecipeId();
    }



//    @Transactional
//    public void modifyRecipe(Long userId, Long recipeId, String recipeJson, MultipartFile imageFile,
//                             List<MultipartFile> processImages, List<Integer> processOrders) throws JsonProcessingException {
//
//        //JSON을 DTO로 변환
//        ObjectMapper objectMapper = new ObjectMapper();
//        MyRecipeModifyRequestDto dto = objectMapper.readValue(recipeJson, MyRecipeModifyRequestDto.class);
//        log.info("레시피 수정 requestdto :{}",dto);
//
//        //URL로 받은 recipeId와 JSON의 recipeId 비교
//        if (dto.getRecipeId() == null) {
//            dto.setRecipeId(recipeId);  // JSON에 없으면 PathVariable에서 받은 값 사용
//        } else if (!dto.getRecipeId().equals(recipeId)) {
//            throw new IllegalArgumentException("URL의 recipeId와 JSON의 recipeId가 일치하지 않습니다.");
//        }
//
//        //System.out.println("Parsed DTO: " + dto);
//        //System.out.println("Extracted Recipe ID: " + dto.getRecipeId());
//
//        if (dto.getRecipeId() == null) {
//            throw new IllegalArgumentException("레시피 ID가 누락되었습니다.");
//        }
//
//        // 레시피 조회 (본인 것만 수정 가능하도록 검증)
//        RecipeEntity recipeEntity = recipeRepository.findByRecipeIdAndUserEntity_UserId(dto.getRecipeId(), userId)
//                .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없거나 수정 권한이 없습니다."));
//
//        //지연 로딩 컬렉션 미리 초기화
////        Hibernate.initialize(recipeEntity.getProcesses());
//
//        //대표 이미지 처리
//        if(imageFile != null && !imageFile.isEmpty()) {
//            //기존 대표 이미지 삭제
//            if(recipeEntity.getImage() != null) {
//                s3Service.deleteFileFromS3(recipeEntity.getImage());
//                log.info("기존 대표 이미지 삭제 완료");
//            }
//
//            //새로운 대표 이미지 업로드
//            try {
//                String newImageUrl = s3Service.uploadFile(imageFile);
//                log.info("레시피 수정 new image url:{}",newImageUrl);
//                recipeEntity.setImage(newImageUrl);
//
//            } catch (Exception e) {
//                throw new RuntimeException("대표 이미지 업로드 중 오류 발생: " + e.getMessage());
//            }
//
//        }
//
//        //과정별 이미지 처리
//        if (processImages != null && !processImages.isEmpty()) {
//            if(processOrders == null || processOrders.size() != processImages.size()) {
//                throw new RuntimeException("과정 이미지와 순서 개수가 일치하지 않습니다.");
//            }
//
//            // 기존 과정별 이미지 삭제 후 새로운 이미지 추가
//            for (int i = 0; i < processImages.size(); i++) {
//                Integer processOrder = processOrders.get(i);
//                ProcessEntity processEntity = recipeEntity.getProcesses().stream()
//                        .filter(p -> p.getProcessOrder().equals(processOrder))
//                        .findFirst()
//                        .orElseThrow(() -> new RuntimeException("해당 과정이 존재하지 않습니다."));
//
//                // 기존 이미지 삭제
//                for (ProcessImageEntity existingImage : processEntity.getProcessImages()) {
//                    s3Service.deleteFileFromS3(existingImage.getImageUrl());
//                    processImageRepository.deleteAll(processEntity.getProcessImages());
//                    log.info("과정별 이미지, 기존 이미지 삭제");
//                }
//
//                // 새로운 이미지 업로드
//                String processImageUrl = s3Service.uploadFile(processImages.get(i));
//                ProcessImageEntity newProcessImage = new ProcessImageEntity(processImageUrl, processEntity);
//                processEntity.getProcessImages().clear();
//                processEntity.getProcessImages().add(newProcessImage);
//                log.info("새로운 이미지 업로드");
//            }
//        }
//
//        recipeEntity.setRecipeTitle(dto.getRecipeTitle());
//        recipeEntity.setCateType(dto.getCateType());
//        recipeEntity.setCateMainIngre(dto.getCateMainIngre());
//        recipeEntity.setServing(dto.getServing());
//        recipeEntity.setLevel(dto.getLevel());
//        recipeEntity.setRequiredTime(dto.getRequiredTime());
//        recipeEntity.setIsPublic(dto.getIsPublic());
//        log.info("최종 수정된 레시피:{}",recipeEntity);
//        recipeRepository.save(recipeEntity);
//    }

    //레시피 수정
//    @Transactional
//    public void modifyRecipe(MyRecipeModifyRequestDto dto, MultipartFile imageFile) throws Exception {
//
//        Optional<RecipeEntity> recipeEntityOpt = recipeRepository.findById(dto.getRecipeId());
//
//        //레시피 존재 확인
//        if (!recipeEntityOpt.isPresent()) {
//            throw new IllegalArgumentException("레시피를 찾을 수 없습니다.");
//        }
//        RecipeEntity recipe = recipeEntityOpt.get();
//
//        //이미지 수정이 필요하다면 처리
//        if (imageFile != null && !imageFile.isEmpty()) {
//            String uploadedImageUrl = s3Service.uploadFile(imageFile);
//            recipe.setImage(uploadedImageUrl);
//        }
//
//        //레시피 기본 정보 수정
//        recipe.setRecipeTitle(dto.getRecipeTitle());
//        recipe.setCateType(dto.getCateType());
//        recipe.setCateMainIngre(dto.getCateMainIngre());
//        recipe.setServing(dto.getServing());
//        recipe.setLevel(dto.getLevel());
//        recipe.setRequiredTime(dto.getRequiredTime());
//        recipe.setIsPublic(dto.getIsPublic());
//
//        //재료 수정
//        ingredientRepository.deleteByRecipeEntity_RecipeId(recipe.getRecipeId());    //기존 재료 삭제
//        List<IngredientEntity> ingredients = dto.getIngredients().stream()
//                .map(ingreDto -> new IngredientEntity(ingreDto.getIngreName(), ingreDto.getAmount(), recipe))
//                .collect(Collectors.toList());
//        ingredientRepository.saveAll(ingredients);
//
//        //과정 수정
//        processRepository.deleteByRecipeEntity_RecipeId(recipe.getRecipeId());   //기존 과정 삭제
//        List<ProcessEntity> processes = dto.getProcesses().stream()
//                .map(processDto -> new ProcessEntity(processDto.getProcessOrder(), processDto.getProcessExplain(), recipe))
//                .collect(Collectors.toList());
//        processRepository.saveAll(processes);
//
//        //과정 이미지 처리
//        processRepository.flush();  // 과정 ID 확보
//        for (ProcessRequestDto processDto : dto.getProcesses()) {
//            ProcessEntity processEntity = processes.stream()
//                    .filter(p -> p.getProcessOrder().equals(processDto.getProcessOrder()))
//                    .findFirst()
//                    .orElseThrow(() -> new IllegalArgumentException("과정 매칭 실패"));
//
//            if (processDto.getImages() != null) {
//                // 기존 이미지 삭제 (모든 이미지를 삭제)
//                processImageRepository.deleteByProcessEntity_ProcessOrder(processDto.getProcessOrder());
//
//                // 새로 추가된 이미지들만 업로드
//                for (ProcessImageRequestDto imageRequestDto : processDto.getImages()) {
//                    // 이미지가 null 이거나 비어 있지 않으면 새로 업로드
//                    if (imageRequestDto.getProcessImage() != null && !imageRequestDto.getProcessImage().isEmpty()) {
//                        // S3에 이미지 업로드
//                        String uploadedImageUrl = s3Service.uploadFile(imageRequestDto.getProcessImage());
//                        // 새로운 ProcessImageEntity 생성
//                        ProcessImageEntity processImage = new ProcessImageEntity(uploadedImageUrl, processEntity);
//                        // 새 이미지를 DB에 저장
//                        processImageRepository.save(processImage);
//                    }
//                }
//            }
//        }
//    }



    //내가 작성한 레시피 목록 조회 (북마크 순)
    public List<MyOwnRecipeListResponseDto> getMyOwnRecipeList(UserEntity userEntity) {
        //내가 작성한 레시피 목록 조회
        List<RecipeEntity> recipes = myOwnRecipeListRepository.findByUserEntity(userEntity);

        //각 레시피에 대한 북마크 수 세기
        //북마크순 + 조회순
        return recipes.stream()
                .map(recipeEntity -> {
                    long bookmarkCount = recipeBookmarkRepository.countByRecipeEntity(recipeEntity);
                    return new MyOwnRecipeListResponseDto(
                            recipeEntity.getRecipeId(),
                            recipeEntity.getRecipeTitle(),
                            recipeEntity.getImage(),
                            recipeEntity.getHits(),
                            (int) bookmarkCount
                    );
                })
                .sorted((r1, r2) -> {
                    // 북마크 순으로 먼저 정렬
                    int bookmarkCompare = Integer.compare(r2.getBookmarkCount(), r1.getBookmarkCount());
                    if (bookmarkCompare != 0) {
                        return bookmarkCompare;
                    }
                    // 북마크 수가 같으면 조회수(hits) 순으로 정렬
                    return Integer.compare(r2.getHits(), r1.getHits());
                })
                .collect(Collectors.toList());
    }


    //레시피 삭제
    @Transactional
    public void deleteRecipe(Long recipeId) {
        // 레시피 조회
        RecipeEntity recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없습니다."));
        // 1. 관련된 ProcessImageEntity 먼저 삭제 (ProcessEntity와 관련된 이미지들 삭제)
        for (ProcessEntity process : recipe.getProcesses()) {
            processImageRepository.deleteByProcessEntity_ProcessId(process.getProcessId()); // ProcessImageEntity 삭제
        }

        // 2. ProcessEntity 삭제
        processRepository.deleteByRecipeEntity_RecipeId(recipeId); // ProcessEntity 삭제
        // 3. IngredientEntity 삭제
        ingredientRepository.deleteByRecipeEntity_RecipeId(recipeId); // IngredientEntity 삭제
        // 4. 레시피 삭제
        recipeRepository.delete(recipe); // RecipeEntity 삭제
    }


    //다른 사용자가 작성한 래시피 목록 조회
    //다른 사용자의 마이페이지
    //닉네임으로 사용자아이디를 찾고 해당 사용자의 레시피 목록 조회
    public List<MyOwnRecipeListResponseDto> getRecipesByNickname(String nickname) {
        // nickname으로 userId 조회
        UserEntity userEntity = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + nickname));

        Long userId = userEntity.getUserId();

        // 해당 유저의 레시피 최신순 조회
        List<RecipeEntity> recipes = recipeRepository.findByUserEntity_UserIdOrderByWriteTimeDesc(userId);

        return recipes.stream()
                .map(recipe -> new MyOwnRecipeListResponseDto(
                        recipe.getRecipeId(),
                        recipe.getRecipeTitle(),
                        recipe.getImage(),
                        recipe.getHits(),
                        recipe.getRecipeBookmarkEntities().size() // 북마크 개수 가져오기
                ))
                .collect(Collectors.toList());
    }



    public RecipeEntity getRecipeByIdAndUserId(Long recipeId, Long userId) {
        return recipeRepository.findByRecipeIdAndUserEntity_UserId(recipeId, userId)
                .orElseThrow(() -> new RuntimeException("이 레시피는 해당 사용자가 작성한 것이 아닙니다."));
    }


}
