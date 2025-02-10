package com.ssafy.foodthink.todayRecipe.controller;

import com.ssafy.foodthink.todayRecipe.dto.SpecialDayDto;
import com.ssafy.foodthink.todayRecipe.dto.TodayRecipeResponseDto;
import com.ssafy.foodthink.todayRecipe.service.AnniversaryService;
import com.ssafy.foodthink.todayRecipe.service.TodayRecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/today-recommend")
@RequiredArgsConstructor
public class TodayMenuController {

    private final TodayRecipeService todayRecipeService;
    private final AnniversaryService anniversaryService;



    // 랜덤으로 3개의 레시피 추천
    @GetMapping("/random")
    public ResponseEntity<List<TodayRecipeResponseDto>> getRandomRecipe() {
        return ResponseEntity.ok(todayRecipeService.getRandomRecipes(3));
    }

    // 기념일 api로 레시피 추천
    @GetMapping("/anniversary")
    public String getAnniversaryInfo() throws IOException {
        return anniversaryService.getAnniversaryInfo();
    }
}



