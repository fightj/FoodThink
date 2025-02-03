package com.ssafy.foodthink.foodRecommend.service;

import com.ssafy.foodthink.foodRecommend.entity.RecipeTfIdf;
import com.ssafy.foodthink.foodRecommend.repository.RecipeTfIdfRepository;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TFIDFService {

    private final RecipeRepository recipeRepository;
    private final RecipeTfIdfRepository recipeTfIdfRepository;

    // 모든 레시피에 대한 TF-IDF 벡터 계산
    @Transactional
    public void calculateAndSaveAllTfIdf(){
        List<RecipeEntity> recipes = recipeRepository.findAll();
        List<List<String>> documents = recipes.stream()
                .map(this::getRecipeFeatures)
                .toList();

        Map<String, Double> idfValues = calculateIdf(documents);

        recipes.forEach(recipe -> {
            List<String> features = getRecipeFeatures(recipe); // 특성 추출
            Map<String, Double> tfidfVector = calculateTfIdfVector(features, documents, idfValues); // TF-IDF 계산
            saveTfIdfVector(recipe, tfidfVector); // DB에 저장
        });
    }

    // IDF 계산 (특성이 전체 레시피에서 얼마나 희소한지)
    private Map<String, Double> calculateIdf(List<List<String>> docs){
        Map<String, Integer> docFrequency = new HashMap<>(); // 각 특성이 등장하는 레시피의 수를 저장
        for(List<String> doc:docs){ // 모든 레시피
            Set<String> uniqueFeatures = new HashSet<>(doc); // 각 레시피의 고유한 특성 추출
            uniqueFeatures.forEach(feature -> docFrequency.put(feature, docFrequency.getOrDefault(feature,0)+1)); // 한 레시피 내에서 feature이 여러번 등장해도 한번만 카운트

        }
        int totalDocs = docs.size(); // 전체 레시피의 수

        return docFrequency.entrySet().stream() // 각 항목에 대한 IEF 값 계산
                .collect(Collectors.toMap(Map.Entry::getKey, e-> Math.log((double) totalDocs / e.getValue()))); // 각 feature에 대해 IDF 계산, log(전체레시피 수 / feature이 등장한 레시피 수), IDF 값이 높을 수록 해당 feature은 전체 레시피에서 희소하다.

    }

    // 각 특성에 대해 TF-IDF 계산, 해당 레시피에서 각 특성의 중요도를 나타냄
    private Map<String, Double> calculateTfIdfVector(List<String> features,
                                                     List<List<String>> docs,
                                                     Map<String, Double> idf) {

        // TF 계산
        Map<String, Long> tf = features.stream()
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        // TF-IDF 계산
        Map<String, Double> tfidf = tf.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> (e.getValue() / (double) features.size()) * idf.getOrDefault(e.getKey(), 0.0)
                ));

        // L2 정규화
        double l2Norm = Math.sqrt(tfidf.values().stream()
                .mapToDouble(v -> v * v)
                .sum());

        return tfidf.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue() / l2Norm
                ));
    }


    // 레시피 특성 추출
    private List<String> getRecipeFeatures(RecipeEntity recipe) {
        List<String> features = new ArrayList<>();
        //features.add(recipe.getCateType()); // 레시피의 종류 -> 오로지 재료로만 하는게 나을듯
        recipe.getIngredients().forEach(ingredient ->
                features.add(ingredient.getIngreName()) // 모든 재료
        );
        return features;
    }

    // 각 레시피의 모든 특성에 대한 TF-IDF 값 저장
    private void saveTfIdfVector(RecipeEntity recipe, Map<String, Double> tfidfVector) {
        tfidfVector.forEach((feature, value) -> {
            recipeTfIdfRepository.upsertTfIdf( // 해당 레코드가 존재하면 업데이트하고, 존재하지 않으면 새로 삽입
                    recipe.getRecipeId(),
                    feature,
                    value
            );
        });
    }


}
