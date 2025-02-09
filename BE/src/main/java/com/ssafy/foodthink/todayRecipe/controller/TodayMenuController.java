package com.ssafy.foodthink.todayRecipe.controller;

import com.ssafy.foodthink.todayRecipe.dto.SpecialDayDto;
import com.ssafy.foodthink.todayRecipe.dto.TodayRecipeResponseDto;
import com.ssafy.foodthink.todayRecipe.service.TodayRecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RestController
@RequestMapping("/api/today-recommend")
@RequiredArgsConstructor
public class TodayMenuController {

    private final TodayRecipeService todayRecipeService;

//    @GetMapping
//    public ResponseEntity<List<SpecialDayDto>> getHolidays(@RequestParam int year,@RequestParam(required = false) Integer month
//    ) throws Exception {
//        return ResponseEntity.ok(specialDayService.getHolidays(year, month));
//    }

    // 랜덤으로 3개의 레시피 추천
    @GetMapping("/random")
    public ResponseEntity<List<TodayRecipeResponseDto>> getRandomRecipe() {
        return ResponseEntity.ok(todayRecipeService.getRandomRecipes(3));
    }
}



