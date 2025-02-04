package com.ssafy.foodthink.myOwnRecipe.service;

import com.ssafy.foodthink.global.S3Service;
import com.ssafy.foodthink.myOwnRecipe.dto.myRecipeWriteRequestDto;
import com.ssafy.foodthink.recipes.entity.IngredientEntity;
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
public class myOwnRecipeService {

    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;
    private final ProcessRepository processRepository;
    private final ProcessImageRepository processImageRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;

    //레시피 등록
    @Transactional
    public void createRecipe(Long userId, myRecipeWriteRequestDto dto,
                             MultipartFile imageFile, List<MultipartFile> processImages) {
        log.info(dto.toString());   //레시피 저장 요청

        //사용자 인증 : JWT
        UserEntity user = userRepository.findByUserId(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException(("해당 사용자가 없습니다.")));

        //대표 이미지 업로드
        String recipeImageUrl = (imageFile != null && !imageFile.isEmpty()) ? s3Service.uploadFile(imageFile) : null;

        //레시피 엔티티 생성 및 저장
        RecipeEntity recipeEntity = new RecipeEntity();
        recipeEntity.setUserEntity(user);
        recipeEntity.setRecipeTitle(dto.getRecipeTitle());
        recipeEntity.setCateType(dto.getCateType());
        recipeEntity.setCateMainIngre(dto.getCateMainIngre());
        recipeEntity.setServing(dto.getServing());
        recipeEntity.setLevel(dto.getLevel());
        recipeEntity.setRequiredTime(dto.getRequiredTime());
        recipeEntity.setIsPublic(dto.isPublic());
        recipeEntity.setImage(dto.getImage());

        recipeRepository.save(recipeEntity);

        //재료 저장
//        List<IngredientEntity> ingredientEntities = dto.getIngredients().stream()
//                .map(Ingre -> {
//                    IngredientEntity ingredient = new IngredientEntity();
//                    ingredient.setIngreName(IngredientDto.getIngreName());
//                }).collect(Collectors.toList());

    }

}
