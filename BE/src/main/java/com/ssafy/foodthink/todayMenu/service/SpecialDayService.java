package com.ssafy.foodthink.todayMenu.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.foodthink.todayMenu.dto.SpecialDayDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class SpecialDayService {

    @Value("${api.service-key}")
    private String serviceKey;

    private static final String API_URL = "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo";

    private final RestTemplate restTemplate;

    public List<SpecialDayDto> getHolidays(int year, Integer month) throws Exception {
        StringBuilder urlBuilder = new StringBuilder(API_URL);
        urlBuilder.append("?serviceKey=").append(URLEncoder.encode(serviceKey, "UTF-8"));
        urlBuilder.append("&solYear=").append(year);
        if (month != null) {
            urlBuilder.append("&solMonth=").append(String.format("%02d", month));
        }
        urlBuilder.append("&_type=json");

        String response = restTemplate.getForObject(urlBuilder.toString(), String.class);
        return parseHolidayResponse(response);
    }

    private List<SpecialDayDto> parseHolidayResponse(String response) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(response);
        JsonNode items = root.path("response").path("body").path("items").path("item");

        List<SpecialDayDto> holidays = new ArrayList<>();
        if (items.isArray()) {
            for (JsonNode item : items) {
                SpecialDayDto holiday = new SpecialDayDto();
                holiday.setDateName(item.path("dateName").asText());
                holiday.setLocdate(item.path("locdate").asText());
                holiday.setIsHoliday(item.path("isHoliday").asText());
                holidays.add(holiday);
            }
        }
        return holidays;
    }
}
