package com.ssafy.foodthink.todayRecommend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnniversaryService {

    private WebClient webClient; // HTTP 클라이언트 -> 기념일 API 호출시 사용
    private final WebClient.Builder webClientBuilder;
    private final RestTemplate restTemplate;

    @Value("${anniversary.api.url}")
    private String apiUrl;

    @Value("${anniversary.api.key}")
    private String apiKey;

    @PostConstruct
    private void init() {
        this.webClient = webClientBuilder.baseUrl(apiUrl).build();
    }

    public String getAllAnniversary(){
        try {
            LocalDate currentDate = LocalDate.now();
            //String today = currentDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String today = "20250105";
            String[] endpoints = {"getHoliDeInfo", "getRestDeInfo", "getAnniversaryInfo", "get24DivisionsInfo","getSundryDayInfo"};

            StringBuilder result = new StringBuilder();

            for(String endpoint : endpoints){
                result.append(getAnniversaryInfo(endpoint, today));
            }
            return result.toString();
        } catch (Exception e) {
            log.error("getAllAnniversary() 중 오류 발생", e);
            return "오류 발생: " + e.getMessage(); // 클라이언트에게 오류 메시지 반환
        }
    }

    public String getAnniversaryInfo(String endpoint, String today) {

        try {
            StringBuilder urlBuilder = new StringBuilder(apiUrl+"/"+endpoint); /*URL*/
            urlBuilder.append("?" + URLEncoder.encode("serviceKey","UTF-8")+"=" + apiKey); /*Service Key*/
            urlBuilder.append("&" + URLEncoder.encode("_type","UTF-8") + "=" + URLEncoder.encode("json", "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("solYear","UTF-8") + "=" + URLEncoder.encode(today.substring(0, 4), "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("solMonth","UTF-8") + "=" + URLEncoder.encode(today.substring(4, 6), "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("solDay","UTF-8") + "=" + URLEncoder.encode(today.substring(6), "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("numOfRows","UTF-8") + "=" + URLEncoder.encode("1", "UTF-8")); /*최대로 출력할 공휴일 수*/

            URL url = new URL(urlBuilder.toString());
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-type", "application/json");
            System.out.println("Response code: " + conn.getResponseCode());

            BufferedReader rd;
            if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) { //http status code check
                rd = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
            } else {
                rd = new BufferedReader(new InputStreamReader(conn.getErrorStream(), "UTF-8"));
            }

            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = rd.readLine()) != null) {
                sb.append(line);
            }
            rd.close();
            conn.disconnect();
            String jsonResponse = sb.toString();
            return parseJsonResponse(jsonResponse, endpoint, today);
        } catch (Exception e) {
            log.error("getAnniversaryInfo() 중 오류 발생", e);
            return "오류 발생: " + e.getMessage(); // 클라이언트에게 오류 메시지 반환
        }

    }

    private String parseJsonResponse(String jsonResponse, String endpoint, String today) throws IOException{
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        JsonNode itemsNode = rootNode.path("response").path("body").path("items").path("item");

        StringBuilder result = new StringBuilder();
        if (itemsNode.isArray()) {
            for (JsonNode item : itemsNode) {
                if (String.valueOf(item.path("locdate").asInt()).equals(today)) {
                    int locdate = item.path("locdate").asInt();
                    String dateName = item.path("dateName").asText();
                    String isHoliday = item.path("isHoliday").asText();
                    result.append(String.format("날짜: %d, 이름: %s, 공휴일 여부: %s\n", locdate, dateName, isHoliday));
                }
            }
        } else if (!itemsNode.isMissingNode()) {

            if (String.valueOf(itemsNode.path("locdate").asInt()).equals(today)) {
                int locdate = itemsNode.path("locdate").asInt();
                String dateName = itemsNode.path("dateName").asText();
                String isHoliday = itemsNode.path("isHoliday").asText();
                result.append(String.format("날짜: %d, 이름: %s, 공휴일 여부: %s\n", locdate, dateName, isHoliday));
            }
        }
        return result.toString();
    }

}