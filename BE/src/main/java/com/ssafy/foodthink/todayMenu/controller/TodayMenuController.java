package com.ssafy.foodthink.todayMenu.controller;

import com.ssafy.foodthink.todayMenu.dto.SpecialDayDto;
import com.ssafy.foodthink.todayMenu.service.SpecialDayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/today-recommend")
@RequiredArgsConstructor
public class TodayMenuController {

    private final SpecialDayService specialDayService;

    @GetMapping
    public ResponseEntity<List<SpecialDayDto>> getHolidays(@RequestParam int year,@RequestParam(required = false) Integer month
    ) throws Exception {
        return ResponseEntity.ok(specialDayService.getHolidays(year, month));
    }
}



