package com.ssafy.foodthink.foodRecommend.dto;

import com.ssafy.foodthink.foodRecommend.repository.CrawlingRecipeRepository;
import com.ssafy.foodthink.foodRecommend.repository.UserRecipeRepository;
import kr.co.shineware.nlp.komoran.constant.DEFAULT_MODEL;
import kr.co.shineware.nlp.komoran.core.Komoran;
import kr.co.shineware.nlp.komoran.model.KomoranResult;

import java.util.*;
import java.util.stream.Collectors;

public class RecipeInfoDto {

    private String recipeTitle;   // 레시피 제목
    private String cateType;      // 종류별 분류
    private String cateMainIngre; // 재료별 분류

    private final UserRecipeRepository userRecipeRepository;
    private final CrawlingRecipeRepository crawlingRecipeRepository;

    public RecipeInfoDto(String recipeTitle, String cateType, String cateMainIngre,
                         UserRecipeRepository userRecipeRepository,
                         CrawlingRecipeRepository crawlingRecipeRepository) {
        this.recipeTitle = recipeTitle;
        this.cateType = cateType;
        this.cateMainIngre = cateMainIngre;
        this.userRecipeRepository = userRecipeRepository;
        this.crawlingRecipeRepository = crawlingRecipeRepository;
    }

    // 레시피 제목에서 요리명(?) 추출
    public String getRecipeName() {

        // 한국어 형태소 분석기 초기화
        Komoran komoran = new Komoran(DEFAULT_MODEL.FULL); // Komoran 객체 생성

        // 불용어 리스트
        Set<String> stopwords = new HashSet<>(Arrays.asList(
                "의", "레시피", "만들기", "황금", "맛있는", "만드는", "법", "추천", "방법", "요리"
        ));

        // 레시피 제목을 형태소 분석
        KomoranResult analyzeResult = komoran.analyze(this.recipeTitle);

        List<String> nouns = analyzeResult.getNouns().stream() // 명사추출, 스트림으로 변환
                .filter(word -> !stopwords.contains(word)) // 불용어 제거
                .collect(Collectors.toList()); // 필터링된 단어들을 List 형태로 반환

        // TF-IDF 계산을 위한 문서 집합 생성
        List<String> documents = getRelatedRecipeTitles();

        // TF-IDF 계산
        TFIDFCalculator calculator = new TFIDFCalculator();
        Map<String, Double> tfidfScores = new HashMap<>();

        for (String noun : nouns) {
            double tfidf = calculator.tfIdf(noun, this.recipeTitle, documents);
            tfidfScores.put(noun, tfidf);
        }

        // TF-IDF 점수가 가장 높은 단어 반환
        return tfidfScores.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(this.recipeTitle);
    }

    private List<String> getRelatedRecipeTitles() {
        // UserRecipe와 CrawlingRecipe의 모든 레시피 제목을 가져옴
        List<String> recipeTitles = new ArrayList<>();

        // UserRecipe 테이블에서 레시피 제목 가져오기
        recipeTitles.addAll(userRecipeRepository.findAllRecipeTitles());

        // CrawlingRecipe 테이블에서 레시피 제목 가져오기
        recipeTitles.addAll(crawlingRecipeRepository.findAllRecipeTitles());

        return recipeTitles;
    }

    // TF-IDF 계산 클래스
    public class TFIDFCalculator {
        public double tf(String term, String document) {
            String[] words = document.split("\\s+");
            long count = Arrays.stream(words)
                    .filter(word -> word.equalsIgnoreCase(term))
                    .count();
            return (double) count / words.length;
        }

        public double idf(String term, List<String> documents) {
            long docsWithTerm = documents.stream()
                    .filter(doc -> doc.contains(term))
                    .count();
            return Math.log((double) documents.size() / (1 + docsWithTerm));
        }

        public double tfIdf(String term, String document, List<String> documents) {
            return tf(term, document) * idf(term, documents);
        }
    }
}
