package com.ssafy.foodthink.webCrawling.service;

import com.ssafy.foodthink.recipes.entity.IngredientEntity;
import com.ssafy.foodthink.recipes.entity.ProcessEntity;
import com.ssafy.foodthink.recipes.entity.ProcessImageEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.webCrawling.repository.*;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@RequiredArgsConstructor
public class CrawlingServiceDemo {
    private final CrawlingRecipeRepository crawlingRecipeRepository;
    private final CrawlingIngredientRepository crawlingIngredientRepository;
    private final CrawlingProcessRepository crawlingProcessRepository;
    private final CrawlingProcessImageRepository crawlingProcessImageRepository;

    private final WebClient webClient;

    private final ExecutorService executorService = Executors.newFixedThreadPool(5);

    private final String baseUrl = "https://www.10000recipe.com/recipe/list.html?";

    @Scheduled(cron = "0 0 1 * * *") // 매일 새벽 2시 실행
    public void startCrawling() {
        System.out.println("크롤링 시작");
        List<String> urls = generateUrls(); // 크롤링할 URL 리스트 생성
        for (String url : urls) {
            executorService.submit(() -> crawlRecipes(url));
        }
    }

    private void crawlRecipes(String url) {
        try {
            System.out.println("크롤링 시작 : " + url);
            Document doc = Jsoup.connect(url).get();
            Elements recipes = doc.select(".common_sp_list_ul .common_sp_list_li");

            // ✅ 목록에서 cat3, cat4 추출
            String cat3Text = "";
            String cat4Text = "";
            Elements categoryElements = doc.select(".tag_tit a");
            for (Element category : categoryElements) {
                String href = category.attr("href");

                if (href.contains("cat3=")) {
                    cat3Text = category.text();
                } else if (href.contains("cat4=")) {
                    cat4Text = href.split("cat4=")[1].split("&")[0];
                }
            }

            for (Element recipe : recipes) {
                String recipeUrl = "https://www.10000recipe.com" + recipe.select("a").attr("href");
                System.out.println("레시피URL : " + recipeUrl);

                if (!crawlingRecipeRepository.existsByRecipeUrl(recipeUrl)) {
                    RecipeEntity entity = extractRecipeData(recipe, recipeUrl, cat4Text, cat3Text);
                    crawlingRecipeRepository.save(entity);
                    processDetailPage(entity);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("크롤링 실패");
        }
    }

    private RecipeEntity extractRecipeData(Element recipe, String recipeUrl, String cat4Text, String cat3Text) {
        System.out.println("크롤링 데이터 추출 : " + recipeUrl);
        RecipeEntity entity = new RecipeEntity();
        entity.setRecipeTitle(recipe.select(".common_sp_caption_tit").text());
        entity.setRecipeUrl(recipeUrl);
        entity.setImage(recipe.select(".common_sp_thumb img").attr("src"));

        // 매핑 후 저장
        entity.setCateType(mapCateType(cat4Text)); // cat4 -> 종류별
        entity.setCateMainIngre(mapCateMainIngre(cat3Text)); // cat3 -> 재료별

        return entity;
    }

    @Transactional
    public void processDetailPage(RecipeEntity entity) {
        try {
            System.out.println("상세 페이지 크롤링 : " + entity.getRecipeUrl());
            Document detailDoc = Jsoup.connect(entity.getRecipeUrl()).get();

            entity.setLevel(newLevel(detailDoc.select(".view2_summary_info3").text()));
            entity.setServing(detailDoc.select(".view2_summary_info1").text());
            entity.setRequiredTime(detailDoc.select(".view2_summary_info2").text());

            // 난이도, 인분, 조리시간이 없으면 저장하지 않음 : 데이터 필터링
            if (entity.getLevel() == 0 || entity.getServing().isEmpty() || entity.getRequiredTime().isEmpty()) {
                System.out.println("필터링된 레시피 (저장 안 함): " + entity.getRecipeUrl());
                crawlingRecipeRepository.delete(entity);    //DB에서 즉시 삭제
                return;
            }

            crawlingRecipeRepository.save(entity);


            //재료 정보
            Elements ingredients = detailDoc.select("div.ready_ingre3 ul.case1");
            for (Element ingredient : ingredients.select("li")) {
                IngredientEntity ingredientEntity = new IngredientEntity();
                ingredientEntity.setIngreName(ingredient.select("div.ingre_list_name a").text());
                ingredientEntity.setAmount(ingredient.select("span.ingre_list_ea").text());
                ingredientEntity.setRecipeEntity(entity);

                System.out.println("Ingredient Name: " + ingredientEntity.getIngreName());
                System.out.println("Ingredient Amount: " + ingredientEntity.getAmount());

                if (!crawlingIngredientRepository.existsByIngreNameAndRecipeEntity_RecipeUrl(ingredientEntity.getIngreName(), entity.getRecipeUrl())) {
                    crawlingIngredientRepository.save(ingredientEntity);
                    crawlingIngredientRepository.flush();
                }

            }


            //요리 과정 정보
            Elements processes = detailDoc.select(".view_step_cont.media");
            int order = 1;

            for (Element process : processes) {
                ProcessEntity processEntity = new ProcessEntity();
                processEntity.setProcessOrder(order++);
                processEntity.setProcessExplain(process.select(".media-body").text());
                processEntity.setRecipeEntity(entity);

                System.out.println("Process Order: " + processEntity.getProcessOrder());
                System.out.println("Process Explain: " + processEntity.getProcessExplain());

                crawlingProcessRepository.save(processEntity);
                crawlingProcessRepository.flush();


                //과정별 이미지 정보
                String imageUrl = detailDoc.select("#stepimg" + processEntity.getProcessOrder() + " img").attr("src");
                if (!imageUrl.isEmpty()) {
                    ProcessImageEntity imageEntity = new ProcessImageEntity();
                    imageEntity.setImageUrl(imageUrl);
                    imageEntity.setProcessEntity(processEntity);

                    System.out.println("Process Image URL: " + imageEntity.getImageUrl());

                    crawlingProcessImageRepository.save(imageEntity);
                    crawlingProcessImageRepository.flush();
                }

            }


            System.out.println("레시피 저장 완료: " + entity.getRecipeUrl());

        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("상세 페이지 크롤링 실패 : " + entity.getRecipeUrl());
        }
    }

    private List<String> generateUrls() {
        List<String> urls = new ArrayList<>();
        System.out.println("URL 생성 시작");

        //종류별 카테고리 반복 처리
        for (Map.Entry<String, List<String>> cateTypeEntry : newCateTypeMap.entrySet()) {
            String cateType = cateTypeEntry.getKey();
            List<String> cat4Values = cateTypeEntry.getValue();

            for (String cat4Value : cat4Values) {
                //재료별 카테고리 반복 처리
                for (Map.Entry<String, String> cat3Entry : cat3Map.entrySet()) {
                    String cateMainIngre = cat3Entry.getKey();
                    String cat3Value = cat3Entry.getValue();

                    int page = 1;
                    boolean hasMorePages = true;

                    //페이지 단위 크롤링 반복
                    //페이지가 없을 때 false
                    while (hasMorePages) {
                        String url = baseUrl + "cat3=" + cat3Value + "&cat4=" + cat4Value + "&order=accuracy&page=" + page;
                        urls.add(url);

                        //hasMorePages = false; // 페이지가 여러 개인 경우 이를 설정하는 로직이 필요합니다.
                        hasMorePages = checkHashMorePage(url);
                        page++;
                    }
                }
            }
        }
        return urls;
    }

    private boolean checkHashMorePage(String url) {
        try {
            System.out.println("페이지 여부 확인 : " + url);
            Document doc = Jsoup.connect(url).get();
            Elements pageLinks = doc.select(".pagination a");

            // "다음 페이지"가 있으면 true 반환
            int currentPage = getCurrentPage(doc);
            for (Element link : pageLinks) {
                String href = link.attr("href");
                if (href.contains("page=")) {
                    int nextPage = Integer.parseInt(href.split("page=")[1]);
                    //TEST : 50페이지까지만 크롤링 (&& nextPage <= 50을 없애면 됨)
                    if (nextPage > currentPage && nextPage <= 5) {
                        return true;  // 다음 페이지가 있음
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;  // 더 이상 페이지가 없음
    }

    private int getCurrentPage(Document doc) {
        // 현재 페이지를 표시하는 <li> 요소를 찾아서 텍스트 값 추출
        Element currentPageElement = doc.select("li.active a").first();
        if (currentPageElement != null) {
            try {
                return Integer.parseInt(currentPageElement.text());
            } catch (NumberFormatException e) {
                return 1;  // 페이지 번호 추출 실패 시 기본값 1 반환
            }
        }
        return 1;  // "active" 클래스가 없으면 첫 번째 페이지로 간주
    }

    private String mapCateType(String cat4Value) {
        for (Map.Entry<String, List<String>> entry : newCateTypeMap.entrySet()) {
            if (entry.getValue().contains(cat4Value)) {
                return entry.getKey(); // 매칭된 key 값을 반환
            }
        }
        return ""; // 매칭되지 않으면 빈 문자열 반환
    }


    private String mapCateMainIngre(String anotherSelectorText) {
        return cat3Map.containsKey(anotherSelectorText) ? anotherSelectorText : "";
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

    //새로운 난이도 구성
    private int newLevel(String level) {
        switch (level) {
            case "아무나": case "초급": return 1;
            case "중급": return 2;
            case "고급": case "신의경지": return 3;
            default: return 0;
        }
    }
}