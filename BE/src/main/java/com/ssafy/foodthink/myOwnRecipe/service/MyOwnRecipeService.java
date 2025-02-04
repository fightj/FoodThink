package com.ssafy.foodthink.myOwnRecipe.service;

import com.ssafy.foodthink.global.S3Service;
import com.ssafy.foodthink.myOwnRecipe.dto.MyRecipeWriteRequestDto;
import com.ssafy.foodthink.myOwnRecipe.dto.ProcessImageRequestDto;
import com.ssafy.foodthink.myOwnRecipe.dto.ProcessRequestDto;
import com.ssafy.foodthink.recipes.entity.IngredientEntity;
import com.ssafy.foodthink.recipes.entity.ProcessEntity;
import com.ssafy.foodthink.recipes.entity.ProcessImageEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.recipes.repository.IngredientRepository;
import com.ssafy.foodthink.recipes.repository.ProcessImageRepository;
import com.ssafy.foodthink.recipes.repository.ProcessRepository;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
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

    //레시피 등록
    @Transactional
    public void createRecipe(MyRecipeWriteRequestDto dto,
                             MultipartFile imageFile, List<MultipartFile> processImages) {
        log.info(dto.toString()); // 레시피 저장 요청

        // 사용자 인증 : JWT
        UserEntity user = userRepository.findByUserId(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException(("해당 사용자가 없습니다.")));

        // 대표 이미지 업로드
        String recipeImageUrl = (imageFile != null && !imageFile.isEmpty()) ? s3Service.uploadFile(imageFile) : null;

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

                    process = processRepository.save(process);

                    // 과정 순서에 맞는 이미지 처리
                    if (processDto.getImages() != null && !processDto.getImages().isEmpty()) {
                        for (ProcessImageRequestDto imageRequestDto : processDto.getImages()) {
                            // 이미지가 존재할 때만 S3에 업로드 후 저장
                            if (imageRequestDto.getProcessImage() != null && !imageRequestDto.getProcessImage().isEmpty()) {
                                String uploadedImageUrl = s3Service.uploadFile(imageRequestDto.getProcessImage());
                                ProcessImageEntity processImage = new ProcessImageEntity();
                                processImage.setImageUrl(uploadedImageUrl);
                                processImage.setProcessEntity(process);
                                processImageRepository.save(processImage);
                            }
                        }
                    }

                    return process;
                }).collect(Collectors.toList());

        processRepository.saveAll(processEntities);

        log.info("레시피 저장 완료 : recipeId ", recipeEntity.getRecipeId());
    }

}
