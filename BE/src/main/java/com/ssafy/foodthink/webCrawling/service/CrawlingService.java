package com.ssafy.foodthink.webCrawling.service;

/*
    주요 크롤링 로직 처리
    카테고리 맵핑
 */

import com.ssafy.foodthink.webCrawling.dto.CrawlingRecipeDto;
import com.ssafy.foodthink.webCrawling.entity.CrawlingIngredientEntity;
import com.ssafy.foodthink.webCrawling.entity.CrawlingProcessEntity;
import com.ssafy.foodthink.webCrawling.entity.CrawlingProcessImageEntity;
import com.ssafy.foodthink.webCrawling.entity.CrawlingRecipeEntity;
import com.ssafy.foodthink.webCrawling.repository.CrawlingIngredientRepository;
import com.ssafy.foodthink.webCrawling.repository.CrawlingProcessImageRepository;
import com.ssafy.foodthink.webCrawling.repository.CrawlingProcessRepository;
import com.ssafy.foodthink.webCrawling.repository.CrawlingRecipeRepository;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CrawlingService {

    @Autowired
    private CrawlingRecipeRepository crawlingRecipeRepository;

    @Autowired
    private CrawlingIngredientRepository crawlingIngredientRepository;

    @Autowired
    private CrawlingProcessRepository crawlingProcessRepository;
    
    @Autowired
    private CrawlingProcessImageRepository crawlingProcessImageRepository;


    //크롤링할 웹 사이트의 앞부분 URL
    private final String baseUrl = "https://www.10000recipe.com/recipe/list.html?";

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

    //크롤링 시작 메서드
    //  크롤링의 전체 프로세스 시작
    //  카테고리별로 데이터를 가져와서 각 페이지를 반복 처리
    public void crawlRecipes() {
        //종류별 카테고리 반복 처리
        for (Map.Entry<String, List<String>> cateTypeEntry : newCateTypeMap.entrySet()) {
            String cateType = cateTypeEntry.getKey();               //종류별 카테고리명 (Map의 key값)
            List<String> cat4Values = cateTypeEntry.getValue();     //해당 카테고리의 세부 분류 ID 목록 (Map의 value값)

            for (String cat4Value : cat4Values) {
                //재료별 카테고리 반복 처리
                for (Map.Entry<String, String> cat3Entry : cat3Map.entrySet()) {
                    String cateMainIngre = cat3Entry.getKey();      //재료명
                    String cat3Value = cat3Entry.getValue();        //재료별ID

                    int page = 1;
                    boolean hasMorePages = true;

                    //페이지 단위로 크롤링 반복
                    //페이지가 없을 때, hashMorePages = false로 반복 종료
                    while (hasMorePages) {
                        String url = generateUrl(cat3Value, cat4Value, page);       //URL 생성 메서드 호출 (아래)
                        hasMorePages = processPage(cateType, cateMainIngre, url);   //페이지 처리 메서드 호출 (아래)
                        page++;
                    }
                }
            }
        }
    }

    //크롤링할 URL 생성 메서드
    private String generateUrl(String cat3Value, String cat4Value, int page) {
        return baseUrl + "cat3=" + cat3Value + "&cat4=" + cat4Value + "&order=accuracy&page=" + page;
    }

    //페이지 처리 메서드 : URL을 통해 데이터를 가져오고 HTML을 파싱해 각 레시피 데이터를 추출 및 저장
    private boolean processPage(String cateType, String cateMainIngre, String url) {
        try {
            Document doc = Jsoup.connect(url).get();    //Jsoup으로 URL에 접속해 HTML 문서 가져오기
            Elements recipes = doc.select(".common_sp_list_ul .common_sp_list_li");     //CSS 선택자로 필요한 HTML릐 레시피 요소 선택

            if (recipes.isEmpty()) return false; // 종료 조건: 더 이상 데이터가 없음

            //긱 레시피 데이터를 extraRecipeDate 메서드로 추출
            //saveRecipe로 저장
            for (Element recipe : recipes) {
                CrawlingRecipeDto dto = extractRecipeData(recipe, cateType, cateMainIngre);
                saveRecipe(dto);
            }

            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    //레시피 데이터를 DTO로 추출 : HTML 요소에서 레시피 데이터를 추출하고 DTO 객체로 변환
    private CrawlingRecipeDto extractRecipeData(Element recipe, String cateType, String cateMainIngre) {
        CrawlingRecipeDto dto = new CrawlingRecipeDto();
        dto.setRecipeTitle(recipe.select(".common_sp_caption_tit").text());               //제목
        dto.setRecipeUrl(recipe.select("a").attr("href"));                      //URL
        dto.setImage(recipe.select(".common_sp_thumb img").attr("src"));        //이미지URL
        dto.setCateType(cateType);                                                                //종류별 분류
        dto.setCateMainIngre(cateMainIngre);                                                      //재료별 분류
        return dto;
    }

    //DTO를 Entity로 변환 후 데이터베이스에 저장
    private void saveRecipe(CrawlingRecipeDto dto) {
        //데이터 중복 확인 : existsByRecipeUrl()로 URL이 이미 저장되어 있는지 확인
        if (!crawlingRecipeRepository.existsByRecipeUrl(dto.getRecipeUrl())) {
            CrawlingRecipeEntity entity = new CrawlingRecipeEntity();
            entity.setRecipeTitle(dto.getRecipeTitle());
            entity.setRecipeUrl(dto.getRecipeUrl());
            entity.setImage(dto.getImage());
            entity.setCateType(dto.getCateType());
            entity.setCateMainIngre(dto.getCateMainIngre());

            //레시피 정보를 먼저 저장
            crawlingRecipeRepository.save(entity);

            //우선 저장으로 레시피 ID 생성 후 나머지 정보 처리
            processDetailPage(entity);

            //TEST
            long recipeCount = crawlingRecipeRepository.count();
            if(recipeCount >= 100) {
                throw new IllegalStateException("stop");
            }
        }
    }

    /*
        [1차] 레시피 목록 페이지에서 동적 크롤링
        [2차] 각 레시피의 상세 페이지까지 동적 크롤링
     */

    //난이도 매핑 재구성
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

    //레시피 상세 페이지에서 재료, 과정, 과정 이미지 크롤링
    @Transactional
    private void processDetailPage(CrawlingRecipeEntity recipeEntity) {
        String baseUrl = "https://www.10000recipe.com"; //기본 URL 설정

        try {
            //상대 URL이 있을 때, 절대 경로로 변경
            String recipeUrl = recipeEntity.getRecipeUrl();
            if(!recipeUrl.startsWith("https://") && !recipeUrl.startsWith("http://")) {
                recipeUrl = new URL(new URL(baseUrl), recipeUrl).toString();
            }

            Document detailDoc = Jsoup.connect(recipeUrl).get();
//            Document detailDoc = Jsoup.connect(recipeEntity.getRecipeUrl()).get();

            //0. 추가 정보 크롤링 : 인분, 소요시간, 난이도
            String serving = detailDoc.select(".view2_summary_info1").text();
            recipeEntity.setServing(serving);

            String requiredTime = detailDoc.select(".view2_summary_info2").text();
            recipeEntity.setRequiredTime(requiredTime);

            String level = detailDoc.select(".view2_summary_info3").text();
            recipeEntity.setLevel(newLevel(level));     //새로운 레벨 단계로 변경 비교하기

            crawlingRecipeRepository.save(recipeEntity);  //CrawlingRecipeEntity 업데이트

            //1. 재료 정보 크롤링
            Elements ingredients = detailDoc.select("ul.case1 li");
//            System.out.println("Found ingredients : " + ingredients.size());

            for(Element ingredient : ingredients) {
                CrawlingIngredientEntity ingredientEntity = new CrawlingIngredientEntity();
                ingredientEntity.setIngreName(ingredient.select("div.ingre_list_name a").text());
                ingredientEntity.setAmount(ingredient.select("span.ingre_list_ea").text());
                ingredientEntity.setCrawlingRecipe(recipeEntity);

                // 이미 존재하는지 확인하고 저장
                if (!crawlingIngredientRepository.existsByIngreNameAndCrawlingRecipe_RecipeUrl(ingredientEntity.getIngreName(), recipeEntity.getRecipeUrl())) {
                    crawlingIngredientRepository.save(ingredientEntity);
                }
            }
;
            //2. 과정 정보 (요리 순서) 크롤링
            Elements processes = detailDoc.select(".view_step_cont.media");

            int order = 1;  //요리 순서는 1번부터

            for(Element process : processes) {
                CrawlingProcessEntity processEntity = new CrawlingProcessEntity();
                processEntity.setProcessOrder(order++);
                processEntity.setProcessExplain(process.select(".media-body").text());
                processEntity.setCrawlingRecipe(recipeEntity);

                //우선 저장
                crawlingProcessRepository.save(processEntity);
//                System.out.println("save processEntity with ID : " + processEntity.getProcessId());

                //각 과정 별 이미지 크롤링 및 저장
//                String imageUrl = process.select(".media-right img").attr("src");
//                System.out.println("Extracted image url : " + imageUrl);
//                System.out.println("HTML : " + process.html());
                String imageUrl = detailDoc.select("#stepimg"
                                        + processEntity.getProcessOrder()
                                        + " img").attr("src");
//                System.out.print("HTML: " + process.html());

                if (!imageUrl.isEmpty()) {
                    if (!imageUrl.startsWith("http")) {
                        imageUrl = new URL(new URL(baseUrl), imageUrl).toString();
                    }

                    CrawlingProcessImageEntity imageEntity = new CrawlingProcessImageEntity();
                    imageEntity.setImageUrl(imageUrl);
                    imageEntity.setCrawlingProcess(processEntity);

                    crawlingProcessImageRepository.save(imageEntity);
//                    System.out.println("Saved process image: " + imageEntity.getImageUrl());
                }


                //요리 과정 저장
//                crawlingProcessRepository.save(processEntity);
            }

        } catch(IOException e) {
            e.printStackTrace();
        }
    }


}
