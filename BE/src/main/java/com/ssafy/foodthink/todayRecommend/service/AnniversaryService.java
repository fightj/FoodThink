package com.ssafy.foodthink.todayRecommend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.foodthink.global.exception.NoExistsException;
import com.ssafy.foodthink.todayRecommend.dto.AnniversaryDto;
import com.ssafy.foodthink.todayRecommend.entity.AnniversaryEntity;
import com.ssafy.foodthink.todayRecommend.repository.AnniversaryRepository;
import com.ssafy.foodthink.user.entity.UserEntity;
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
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnniversaryService {

    private WebClient webClient; // HTTP 클라이언트 -> 기념일 API 호출시 사용
    private final WebClient.Builder webClientBuilder;
    private final RestTemplate restTemplate;
    private final AnniversaryRepository anniversaryRepository;

    @Value("${anniversary.api.url}")
    private String apiUrl;

    @Value("${anniversary.api.key}")
    private String apiKey;

    @PostConstruct
    private void init() {
        this.webClient = webClientBuilder.baseUrl(apiUrl).build();
    }

    public AnniversaryDto getAnniversaryDetails() {
        try{
            LocalDate currentDate = LocalDate.now();
            //String today = currentDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String today = "20250531";
            String[] endpoints = {"getHoliDeInfo", "get24DivisionsInfo","getSundryDayInfo"};

            List<String> anniversaryNames = new java.util.ArrayList<>();

            for (String endpoint : endpoints) {
                List<String> dateNames = getAnniversaryInfo(endpoint, today);
                anniversaryNames.addAll(dateNames);
            }
            log.info("Anniversary Names from API: {}", anniversaryNames);
            if(!anniversaryNames.isEmpty()){
                String AnniversaryName = anniversaryNames.get(0);
                //List<AnniversaryDto> anniversaryDtos = new ArrayList<>();

//                for(String anniversaryName : anniversaryNames){
//                    AnniversaryEntity entity = anniversaryRepository.findByAnniversaryName(anniversaryName)
//                            .orElseThrow(() -> new NoExistsException("데이터베이스가 없는 기념일"));
//                    anniversaryDtos.add(convertDto(entity));
//                }
//
//                return anniversaryDtos;
                AnniversaryEntity entity = anniversaryRepository.findByAnniversaryName(AnniversaryName)
                            .orElseThrow(() -> new NoExistsException("데이터베이스가 없는 기념일"));
                return convertDto(entity);
            }
            throw new NoExistsException("특별한 기념일이 없습니다.");
        }
        catch(Exception e){
            throw new NoExistsException("특별한 기념일이 없습니다.");
        }
    }

    public List<String> getAnniversaryInfo(String endpoint, String today) {

        try {
            StringBuilder urlBuilder = new StringBuilder(apiUrl+"/"+endpoint);
            urlBuilder.append("?" + URLEncoder.encode("serviceKey","UTF-8")+"=" + apiKey);
            urlBuilder.append("&" + URLEncoder.encode("_type","UTF-8") + "=" + URLEncoder.encode("json", "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("solYear","UTF-8") + "=" + URLEncoder.encode(today.substring(0, 4), "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("solMonth","UTF-8") + "=" + URLEncoder.encode(today.substring(4, 6), "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("solDay","UTF-8") + "=" + URLEncoder.encode(today.substring(6), "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("numOfRows","UTF-8") + "=" + URLEncoder.encode("365", "UTF-8"));

            URL url = new URL(urlBuilder.toString());
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-type", "application/json");
            System.out.println("Response code: " + conn.getResponseCode());

            BufferedReader rd;
            if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
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

            return parseJsonResponse(sb.toString(), today);
        } catch (Exception e) {
            log.error("getAnniversaryInfo() 중 오류 발생", e);
            return List.of();
        }

    }

    private List<String> parseJsonResponse(String jsonResponse, String today) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        log.info("API Response: {}", jsonResponse);
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        JsonNode itemsNode = rootNode.path("response").path("body").path("items").path("item");

        List<String> result = new java.util.ArrayList<>();

        if (itemsNode.isArray()) { // 응답 데이터가 배열인 경우
            for (JsonNode item : itemsNode) {
                if (String.valueOf(item.path("locdate").asInt()).equals(today)) {
                    result.add(item.path("dateName").asText());
                }
            }
        } else if (!itemsNode.isMissingNode()) { // 단일 객체인 경우
            if (String.valueOf(itemsNode.path("locdate").asInt()).equals(today)) {
                result.add(itemsNode.path("dateName").asText());
            }
        }

        return result;
    }

    @PostConstruct
    public void insertData() {
        if(anniversaryRepository.count() == 0){
            anniversaryRepository.save(new AnniversaryEntity(null, "설날", "떡국", "https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%EB%96%A1%EA%B5%AD.png"));
            anniversaryRepository.save(new AnniversaryEntity(null, "추석", "송편", "https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%EC%86%A1%ED%8E%B8.png"));
            anniversaryRepository.save(new AnniversaryEntity(null, "정월대보름", "오곡밥", "https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%EC%98%A4%EA%B3%A1%EB%B0%A5.png"));
            anniversaryRepository.save(new AnniversaryEntity(null, "한식", "화전", "https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%ED%99%94%EC%A0%84.png"));
            anniversaryRepository.save(new AnniversaryEntity(null, "단오", "수리취떡", "https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%EC%88%98%EB%A6%AC%EC%B7%A8%EB%96%A1.png"));
            anniversaryRepository.save(new AnniversaryEntity(null, "초복", "삼계탕", "https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%EC%82%BC%EA%B3%84%ED%83%95.png"));
            anniversaryRepository.save(new AnniversaryEntity(null, "중복", "삼계탕", "https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%EC%82%BC%EA%B3%84%ED%83%95.png"));
            anniversaryRepository.save(new AnniversaryEntity(null, "말복", "삼계탕", "https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%EC%82%BC%EA%B3%84%ED%83%95.png"));
            anniversaryRepository.save(new AnniversaryEntity(null, "칠석", "밀전병", "https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%EB%B0%80%EC%A0%84%EB%B3%91.png"));
            anniversaryRepository.save(new AnniversaryEntity(null, "동지", "팥죽", "https://foodthinkawsbucket.s3.ap-northeast-2.amazonaws.com/%ED%8C%A5%EC%A3%BD.png"));
        }

    }

    private AnniversaryDto convertDto(AnniversaryEntity entity) {
        return new AnniversaryDto(
                entity.getAnniversaryName(),
                entity.getAnniversaryMenu(),
                entity.getMenuImage()
        );
    }

}