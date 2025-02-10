package com.ssafy.foodthink.todayRecommend.service;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.todayRecommend.dto.TodayRecipeResponseDto;
import com.ssafy.foodthink.todayRecommend.repository.TodayRecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class TodayRecipeService {

    private final TodayRecipeRepository todayRecipeRepository;
    private final Random random = new Random();

    public List<TodayRecipeResponseDto> getRandomRecipes(int count) {
        Long maxId = todayRecipeRepository.findMaxRecipeId();
        if (maxId == null) throw new RuntimeException("레시피를 찾을 수 없어요.");

        List<TodayRecipeResponseDto> recipes = new ArrayList<>();
        int attempts = 0;
        int maxAttempts = maxId.intValue() * 2;

        while (recipes.size() < count && attempts < maxAttempts) {
            Long select = random.nextLong(maxId) + 1;
            RecipeEntity recipeEntity = todayRecipeRepository.findByRecipeId(select);
            if (recipeEntity != null) {
                TodayRecipeResponseDto dto = mapToDto(recipeEntity);
                if (!recipes.contains(dto)) {
                    recipes.add(dto);
                }
            }

            attempts++;
        }

        if (recipes.isEmpty()) {
            throw new RuntimeException("랜덤 레시피 검색 실패");
        }
        return recipes;
    }


    private TodayRecipeResponseDto mapToDto(RecipeEntity recipeEntity) {
        return TodayRecipeResponseDto.builder()
                .recipeId(recipeEntity.getRecipeId())
                .recipeTitle(recipeEntity.getRecipeTitle())
                .image(recipeEntity.getImage())
                .build();
    }



    // 기념일  api + 난수 함께 사용 하려할때 구현해놓은 것
//    @Value("${api.service-key}")
//    private String serviceKey;
//
//    private static final String API_URL = "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo";
//
//    private final RestTemplate restTemplate;
//
//    public List<SpecialDayDto> getHolidays(int year, Integer month) throws Exception {
//        StringBuilder urlBuilder = new StringBuilder(API_URL);
//        urlBuilder.append("?serviceKey=").append(URLEncoder.encode(serviceKey, "UTF-8"));
//        urlBuilder.append("&solYear=").append(year);
//        if (month != null) {
//            urlBuilder.append("&solMonth=").append(String.format("%02d", month));
//        }
//        urlBuilder.append("&_type=json");
//
//        String response = restTemplate.getForObject(urlBuilder.toString(), String.class);
//        return parseHolidayResponse(response);
//    }
//
//    private List<SpecialDayDto> parseHolidayResponse(String response) throws Exception {
//        ObjectMapper mapper = new ObjectMapper();
//        JsonNode root = mapper.readTree(response);
//        JsonNode items = root.path("response").path("body").path("items").path("item");
//
//        List<SpecialDayDto> holidays = new ArrayList<>();
//        if (items.isArray()) {
//            for (JsonNode item : items) {
//                SpecialDayDto holiday = new SpecialDayDto();
//                holiday.setDateName(item.path("dateName").asText());
//                holiday.setLocdate(item.path("locdate").asText());
//                holiday.setIsHoliday(item.path("isHoliday").asText());
//                holidays.add(holiday);
//            }
//        }
//        return holidays;
//    }
}
