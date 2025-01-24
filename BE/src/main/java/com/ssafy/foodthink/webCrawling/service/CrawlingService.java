package com.ssafy.foodthink.webCrawling.service;

/*
    크롤링 로직
    카테고리 맵핑
 */

import com.ssafy.foodthink.webCrawling.dto.CrawlingDto;
import com.ssafy.foodthink.webCrawling.entity.CrawlingRecipeEntity;
import com.ssafy.foodthink.webCrawling.repository.CrawlingRepository;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

@Service
public class CrawlingService {

    @Autowired
    private CrawlingRepository crawlingRepository;

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

    public void crawlRecipes() {
        for (Map.Entry<String, List<String>> cateTypeEntry : newCateTypeMap.entrySet()) {
            String cateType = cateTypeEntry.getKey();
            List<String> cat4Values = cateTypeEntry.getValue();

            for (String cat4Value : cat4Values) {
                for (Map.Entry<String, String> cat3Entry : cat3Map.entrySet()) {
                    String cateMainIngre = cat3Entry.getKey();
                    String cat3Value = cat3Entry.getValue();

                    int page = 1;
                    boolean hasMorePages = true;

                    while (hasMorePages) {
                        String url = generateUrl(cat3Value, cat4Value, page);
                        hasMorePages = processPage(cateType, cateMainIngre, url);
                        page++;
                    }
                }
            }
        }
    }

    private String generateUrl(String cat3Value, String cat4Value, int page) {
        return baseUrl + "cat3=" + cat3Value + "&cat4=" + cat4Value + "&order=accuracy&page=" + page;
    }

    private boolean processPage(String cateType, String cateMainIngre, String url) {
        try {
             Document doc = Jsoup.connect(url).get();
//            Document doc = Jsoup.connect(url)
//                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36")
//                    .timeout(5000) // 타임아웃 시간 설정
//                    .get();
            Elements recipes = doc.select(".common_sp_list_ul .common_sp_list_li");

            if (recipes.isEmpty()) return false; // 종료 조건: 더 이상 데이터가 없음

            for (Element recipe : recipes) {
                CrawlingDto dto = extractRecipeData(recipe, cateType, cateMainIngre);
                saveRecipe(dto);
            }

            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    private CrawlingDto extractRecipeData(Element recipe, String cateType, String cateMainIngre) {
        CrawlingDto dto = new CrawlingDto();
        dto.setRecipeTitle(recipe.select(".common_sp_caption_tit").text());
        dto.setRecipeUrl(recipe.select("a").attr("href"));
        dto.setImage(recipe.select(".common_sp_thumb img").attr("src"));
        dto.setCateType(cateType);
        dto.setCateMainIngre(cateMainIngre);
        return dto;
    }

    private void saveRecipe(CrawlingDto dto) {
        if (!crawlingRepository.existsByRecipeUrl(dto.getRecipeUrl())) {
            CrawlingRecipeEntity entity = new CrawlingRecipeEntity();
            entity.setRecipeTitle(dto.getRecipeTitle());
            entity.setRecipeUrl(dto.getRecipeUrl());
            entity.setImage(dto.getImage());
            entity.setCateType(dto.getCateType());
            entity.setCateMainIngre(dto.getCateMainIngre());
            crawlingRepository.save(entity);
        }
    }


}
