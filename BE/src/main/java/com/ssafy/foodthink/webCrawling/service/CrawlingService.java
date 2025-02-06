package com.ssafy.foodthink.webCrawling.service;

import com.ssafy.foodthink.recipes.entity.IngredientEntity;
import com.ssafy.foodthink.recipes.entity.ProcessEntity;
import com.ssafy.foodthink.recipes.entity.ProcessImageEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.repository.UserRepository;
import com.ssafy.foodthink.webCrawling.repository.CrawlingIngredientRepository;
import com.ssafy.foodthink.webCrawling.repository.CrawlingProcessImageRepository;
import com.ssafy.foodthink.webCrawling.repository.CrawlingProcessRepository;
import com.ssafy.foodthink.webCrawling.repository.CrawlingRecipeRepository;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.transaction.annotation.Transactional;

/*
    웹 크롤링 주 기능 동작 구현
 */

@Service
public class CrawlingService {

    private final CrawlingRecipeRepository crawlingRecipeRepository;
    private final CrawlingIngredientRepository crawlingIngredientRepository;
    private final CrawlingProcessRepository crawlingProcessRepository;
    private final CrawlingProcessImageRepository crawlingProcessImageRepository;
    private final UserRepository userRepository;

    @Autowired
    public CrawlingService(
            CrawlingRecipeRepository crawlingRecipeRepository,
            CrawlingIngredientRepository crawlingIngredientRepository,
            CrawlingProcessRepository crawlingProcessRepository,
            CrawlingProcessImageRepository crawlingProcessImageRepository,
            UserRepository userRepository
    ) {
        this.crawlingRecipeRepository = crawlingRecipeRepository;
        this.crawlingIngredientRepository = crawlingIngredientRepository;
        this.crawlingProcessRepository = crawlingProcessRepository;
        this.crawlingProcessImageRepository = crawlingProcessImageRepository;
        this.userRepository = userRepository;
    }


    //크롤링할 웹 사이트의 앞부분 URL
    private final String baseUrl = "https://www.10000recipe.com/recipe/list.html?";

    //카테고리별 조합의 데이터 개수 제한
    private final int MAX_RECIPES_COMBO = 5;
    //cat3 + cat4 조합별 크롤링된 레시피 개수 저장용
    //HashMap -> ConcurrentHashMapk 동시성 문제 해결
    private final Map<String, Integer> recipeCountMap = new ConcurrentHashMap<>();

    //배치 스케줄러 : 이전 실행 종료 후 1시간마다 1번씩
    @Scheduled(fixedRate = 3600000)
    public void crawlRecipesPeriodically() {
        try {
            System.out.println("배치 크롤링 작업 시작");
            crawlRecipes();
            System.out.println("배치 크롤링 완료");
        } catch(Exception e) {
            System.out.println("크롤링 오류 발생 : " + e.getMessage());
            e.printStackTrace();
        }
    }

    //만개의레시피 웹 사이트 크롤링
    //종류별 카테고리(cat4)와 재료별 카테고리(cat3)를 하나씩 선택하여 해당 조합의 목록별로 데이터를 크롤링한다.
    //종류별 카테고리는 새로 재정의한 규칙에 따른다.
    public void crawlRecipes() {
        // 종류별 카테고리 반복 처리
        for (Map.Entry<String, List<String>> cateTypeEntry : newCateTypeMap.entrySet()) {
            String cateType = cateTypeEntry.getKey();               // 종류별 카테고리명 (Map의 key값)
            List<String> cat4Values = cateTypeEntry.getValue();     // 해당 카테고리의 세부 분류 ID 목록 (Map의 value값)

            for (String cat4Value : cat4Values) {
                // 재료별 카테고리 반복 처리
                for (Map.Entry<String, String> cat3Entry : cat3Map.entrySet()) {
                    String cateMainIngre = cat3Entry.getKey();      // 재료명
                    String cat3Value = cat3Entry.getValue();        // 재료별ID

                    //조합별 개수 카운트 초기화 (처음 크롤링 할 때만)
                    String comboKey = cat3Value + "-" + cat4Value;
                    recipeCountMap.putIfAbsent(comboKey, 0);

                    int page = 1;
                    boolean hasMorePages = true;

                    // 페이지 단위로 크롤링 반복
                    // 페이지가 없을 때, hasMorePages = false로 반복 종료
                    while (hasMorePages) {
                        String url = baseUrl + "cat3=" + cat3Value + "&cat4=" + cat4Value + "&order=accuracy&page=" + page;
                        hasMorePages = processPage(cateType, cateMainIngre, url, comboKey);   // 페이지 처리 메서드 호출
                        page++;
                    }
                }
            }
        }

        System.out.println("크롤링 완료");
        deleteRecipesWithoutIngredients();
        System.out.println("재료 정보가 담기지 않은 레시피 전체 삭제 완료");
        assignRandomUserToRecipes();
        System.out.println("user_id 랜덤 삽입 완료");
    }

    //Jsoup를 활용하여 HTML 및 CSS 선택자로 크롤링 정보 추출
    //레시피 제목, 레시피URL, 레시피 대표 이미지, 종류별 카테고리, (메인)재료별 카테고리
    private boolean processPage(String cateType, String cateMainIngre, String url, String comboKey) {
        try {
            Document doc = Jsoup.connect(url).get();    // Jsoup으로 URL에 접속해 HTML 문서 가져오기
            Elements recipes = doc.select(".common_sp_list_ul .common_sp_list_li");

            if (recipes.isEmpty()) return false; // 종료 조건: 더 이상 데이터가 없음

            // 각 레시피 데이터를 직접 추출 후 저장
            for (Element recipe : recipes) {
                //조합별 데이터가 지정 개수를 넘으면 중단
                if(recipeCountMap.get(comboKey) >= MAX_RECIPES_COMBO) {
                    return false;
                }

                RecipeEntity entity = new RecipeEntity();
                entity.setRecipeTitle(recipe.select(".common_sp_caption_tit").text());  // 제목
                entity.setRecipeUrl(recipe.select("a").attr("href"));                  // URL
                entity.setImage(recipe.select(".common_sp_thumb img").attr("src"));    // 이미지URL
                entity.setCateType(cateType);                                           // 종류별 분류
                entity.setCateMainIngre(cateMainIngre);                                 // 재료별 분류

                // 데이터 중복 확인 : existsByRecipeUrl()로 URL이 이미 저장되어 있는지 확인
                if (!crawlingRecipeRepository.existsByRecipeUrl(entity.getRecipeUrl())) {
                    // 레시피 정보 먼저 저장
                    crawlingRecipeRepository.saveAndFlush(entity);
                    // 우선 저장 : 레시피 ID 생성 후 나머지 정보 처리
                    processDetailPage(entity);
                    // 조합별 데이터 개수 카운트 증가
                    recipeCountMap.put(comboKey, recipeCountMap.get(comboKey) + 1);
                }

            }

            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    //레시피 상세 페이지에서 재료, 과정, 과정 이미지 크롤링
    //레시피URL을 통해 상세 페이지로 이동하고, 그곳에서 정보를 추출한다.
    //그래서 위의 processPage를 우선 크롤링 및 저장한 후, processDetailPage를 실행한다.
    @Transactional
    private void processDetailPage(RecipeEntity recipeEntity) {

        String baseUrl = "https://www.10000recipe.com"; //기본 URL 설정

        try {
            //상대 URL이 있을 때, 절대 경로로 변경
            String recipeUrl = recipeEntity.getRecipeUrl();
            if(!recipeUrl.startsWith("https://") && !recipeUrl.startsWith("http://")) {
                recipeUrl = new URL(new URL(baseUrl), recipeUrl).toString();
            }

            Document detailDoc = Jsoup.connect(recipeUrl).get();

            /*
                0. 추가 정보 크롤링 : 인분, 소요시간, 난이도
             */
            String serving = detailDoc.select(".view2_summary_info1").text();
            recipeEntity.setServing(serving);
            String requiredTime = detailDoc.select(".view2_summary_info2").text();
            recipeEntity.setRequiredTime(requiredTime);
            String level = detailDoc.select(".view2_summary_info3").text();
            recipeEntity.setLevel(newLevel(level));     //새로운 레벨 단계로 변경 비교하기

            //난이도, 인분, 조리시간이 없으면 저장하지 않음 : 데이터 필터링
            //+대표 이미지에 Icon_vod가 포함되어 있다면 저장하지 않음 (영상 제거)
            if (recipeEntity.getLevel() == 0 || recipeEntity.getServing().isEmpty() || recipeEntity.getRequiredTime().isEmpty()
                    || (recipeEntity.getImage() != null && recipeEntity.getImage().contains("icon_vod"))) {
                System.out.println("필터링된 데이터: " + recipeEntity.getRecipeUrl());
                crawlingRecipeRepository.delete(recipeEntity);
                return;
            }

            //Recipe 테이블 완성
            crawlingRecipeRepository.saveAndFlush(recipeEntity);  //CrawlingRecipeEntity 업데이트

            /*
                1. 재료 정보 크롤링
             */
            Elements ingredients = detailDoc.select("ul.case1 li");

            List<IngredientEntity> ingredientEntityList = new ArrayList<>();
            boolean hasInvalidIngredient = false;

            for(Element ingredient : ingredients) {
                String ingreName = ingredient.select("div.ingre_list_name a").text();   //재료명
                String amount = ingredient.select("span.ingre_list_ea").text();         //재료 수량+단위

                //재료의 빈 값이나 null 확인
                if(ingreName.isEmpty() || amount.isEmpty()) {
                    hasInvalidIngredient = true;    //잘못된 재료가 있음
                    break;  //하나라도 있으면 더 이상 처리X
                }

                IngredientEntity ingredientEntity = new IngredientEntity();
                ingredientEntity.setIngreName(ingreName);
                ingredientEntity.setAmount(amount);
                ingredientEntity.setRecipeEntity(recipeEntity);
                ingredientEntityList.add(ingredientEntity);

                //잘못된 재료가 있을 때, 해당 레시피 삭제 (cascade)
                if(hasInvalidIngredient) {
                    deleteRecipeWithCascade(recipeEntity.getRecipeId());
                    System.out.println("잘못된 재료가 있을 때 해당 레시피 정보 삭제");
                    return;
                }

                //재료 데이터 중복 확인
                for(IngredientEntity ingre : ingredientEntityList) {
                    if(!crawlingIngredientRepository.existsByIngreNameAndRecipeEntity_RecipeUrl(
                            ingredientEntity.getIngreName(), recipeEntity.getRecipeUrl())) {
                        crawlingIngredientRepository.saveAndFlush(ingre);
                    }
                }
            }

            /*
                2. 요리 과정 정보 크롤링
             */
            Elements processes = detailDoc.select(".view_step_cont.media");
            int order = 1;  //요리 순서는 1번부터

            for(Element process : processes) {
                ProcessEntity processEntity = new ProcessEntity();
                processEntity.setProcessOrder(order++);
                processEntity.setProcessExplain(process.select(".media-body").text());
                processEntity.setRecipeEntity(recipeEntity);

                //우선 저장 : 과정별 이미지 크롤링 때 각 과정의 process_id가 필요하다.
                crawlingProcessRepository.saveAndFlush(processEntity);
                
                /*
                    3. 각 과정별 이미지 크롤링
                 */
                String imageUrl = detailDoc.select("#stepimg"
                                        + processEntity.getProcessOrder()
                                        + " img").attr("src");

                if (!imageUrl.isEmpty()) {
                    if (!imageUrl.startsWith("http")) {
                        imageUrl = new URL(new URL(baseUrl), imageUrl).toString();
                    }

                    ProcessImageEntity imageEntity = new ProcessImageEntity();
                    imageEntity.setImageUrl(imageUrl);
                    imageEntity.setProcessEntity(processEntity);
                    crawlingProcessImageRepository.saveAndFlush(imageEntity);
                }

            }

        } catch(IOException e) {
            e.printStackTrace();
        }

    }
    
    //ingredient 테이블의 빈 값 또는 NULL 값의 재료 데이터 삭제 : 데이터 정제
    @Transactional
    private void deleteRecipeWithCascade(Long recipeId) {
        if(recipeId == null) {
            return;
        }

        //RecipeEntity 찾기
        Optional<RecipeEntity> optionalRecipe = crawlingRecipeRepository.findById(recipeId);
        if (optionalRecipe.isEmpty()) return;

        RecipeEntity recipeEntity = optionalRecipe.get();
        crawlingProcessImageRepository.deleteByProcessEntity_RecipeEntity(recipeEntity);
        crawlingProcessRepository.deleteByRecipeEntity(recipeEntity);
        crawlingIngredientRepository.deleteByRecipeEntity(recipeEntity);
        crawlingRecipeRepository.delete(recipeEntity);

    }

    //ingredient 테이블에 존재하지 않는 recipe_id를 찾아서 관련된 모든 데이터 삭제 : 데이터 정제
    //크롤링이 끝난 후 자동 처리
    @Transactional
    public void deleteRecipesWithoutIngredients() {
        // ingredient 테이블에 없는 recipe_id 목록 가져오기
        List<Long> invalidRecipeIds = crawlingRecipeRepository.findRecipeIdsWithoutIngredients();

        if (!invalidRecipeIds.isEmpty()) {
            // process_image 테이블 삭제
            crawlingProcessImageRepository.deleteByProcessEntity_RecipeEntity_RecipeIdIn(invalidRecipeIds);
            // process 테이블 삭제
            crawlingProcessRepository.deleteByRecipeEntity_RecipeIdIn(invalidRecipeIds);
            // ingredient 테이블 삭제 (혹시라도 남아 있는 게 있으면)
            crawlingIngredientRepository.deleteByRecipeEntity_RecipeIdIn(invalidRecipeIds);
            // recipe 테이블 삭제
            crawlingRecipeRepository.deleteByRecipeIdIn(invalidRecipeIds);
        }
    }

    //크롤링 종료 후, 사용자 아이디 랜덤 할당
    @Transactional
    public void assignRandomUserToRecipes() {
        List<RecipeEntity> allRecipes = crawlingRecipeRepository.findAll(); //모든 레시피 조회
        List<UserEntity> users = userRepository.findAll();  //사용자 미리 조회

        if(users.isEmpty()) return;

        // 1~20 사이의 랜덤 값으로 사용자 ID 할당
        Random random = new Random();
        allRecipes.forEach(recipe -> {
            UserEntity randomUser = users.get(random.nextInt(users.size()));
            recipe.setUserEntity(randomUser);
        });

//        for (RecipeEntity recipe : allRecipes) {
//            // 랜덤 사용자 ID (1~20)
//            Long randomUserId = (long) (random.nextInt(20) + 1);
//
//            // 해당 사용자 ID가 존재하는지 확인
//            Optional<UserEntity> userEntityOptional = userRepository.findById(randomUserId);
//            if (userEntityOptional.isPresent()) {
//                UserEntity randomUser = userEntityOptional.get();
//                recipe.setUserEntity(randomUser); // 사용자 아이디 할당
//            } else {
//                // 해당 사용자 ID가 없다면, 어떤 처리를 할지 결정 (예: 로그 남기기, 기본값 할당 등)
//                System.out.println("사용자 ID " + randomUserId + " 가 존재하지 않음");
//            }
//        }

        // 업데이트된 레시피 정보 저장
        crawlingRecipeRepository.saveAll(allRecipes);
        System.out.println("모든 레시피에 사용자 아이디를 할당했습니다.");
    }

    // 종류별 카테고리 재정의
    // 반찬 국/탕 찌개 디저트 면/만투 밥/죽/떡 김치/젓갈/장류 양념/소스쨈 양식 샐러드 차/음료/술 기타
    private final Map<String, List<String>> newCateTypeMap = new HashMap<>() {
        {
            put("반찬", new ArrayList<>(List.of("36", "65")));
            put("국/탕", new ArrayList<>(List.of("54")));
            put("찌개", new ArrayList<>(List.of("55")));
            put("디저트", new ArrayList<>(List.of("60", "66", "69")));
            put("면/만두", new ArrayList<>(List.of("53")));
            put("밥/죽/떡", new ArrayList<>(List.of("52")));
            put("김치/젓갈/장류", new ArrayList<>(List.of("57")));
            put("양념/소스/쨈", new ArrayList<>(List.of("58")));
            put("양식", new ArrayList<>(List.of("65", "68")));
            put("샐러드", new ArrayList<>(List.of("64")));
            put("차/음료/술", new ArrayList<>(List.of("59")));
            put("기타", new ArrayList<>(List.of("62", "61")));
        }
    };

    // 재료별 카테고리 매핑
    private final Map<String, String> cat3Map = new HashMap<>() {{
        put("소고기", "70");
        put("돼지고기", "71");
        put("닭고기", "72");
        put("육류", "23");
        put("채소류", "28");
        put("해물류", "24");
        put("달걀/유제품", "50");
        put("가공식품류", "33");
        put("쌀", "47");
        put("밀가루", "32");
        put("건어물류", "25");
        put("버섯류", "31");
        put("과일류", "48");
        put("콩/견과류", "27");
        put("곡류", "26");
        put("기타", "34");
    }};

    //난이도 재구성
    private int newLevel(String level) {
        switch (level) {
            case "아무나":
            case "초급":
                return 1;
            case "중급":
                return 2;
            case "고급":
            case "신의경지":
                return 3;
            default:
                return 0;
        }
    }

}
