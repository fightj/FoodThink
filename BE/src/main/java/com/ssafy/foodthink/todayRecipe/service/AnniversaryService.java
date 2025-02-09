package com.ssafy.foodthink.todayRecipe.service;

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
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

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
        this.webClient = webClientBuilder.baseUrl("http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService").build();
    }

    // 기념일 api 호출
//    public String getAnniversaryInfo() {
//        try {
//            String encodedApiKey = URLEncoder.encode(apiKey, StandardCharsets.UTF_8);// API Key 인코딩
//
//            System.out.println("API URL: " + apiUrl);
//            System.out.println("API Key: " + apiKey);
//            LocalDate currentDate = LocalDate.now();
//            String formattedDate = currentDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
//            String testUrl = "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo"
//                    + "?serviceKey=" + encodedApiKey + "&solYear=2024&solMonth=02&solDay=09";

//            String response = webClient.get()
//                    .uri(uriBuilder -> uriBuilder
//                            .path("/getHoliDeInfo")
//                            .queryParam("serviceKey", apiKey)
//                            .queryParam("solYear", "2024")
//                            .queryParam("solMonth", "02")
//                            .queryParam("solDay", "09")
//                            .build())
//                    .retrieve()
//                    .bodyToMono(String.class)
//                    .block();
//
//            String response = webClient.get()
//                    .uri(testUrl) // Postman에서 테스트한 URL을 그대로 사용
//                    .retrieve()
//                    .bodyToMono(String.class)
//                    .block();
//
//            log.info("API Response: " + response);
//            return parseXmlResponse(response);
//        } catch (Exception e) {
//            log.error("API 요청 중 오류 발생", e);
//            return "API 요청 실패";
//        }
//
//    }
//public String getAnniversaryInfo() {
//    try {
//        LocalDate currentDate = LocalDate.now();
//        String solYear = String.valueOf(currentDate.getYear());
//        String solMonth = String.format("%02d", currentDate.getMonthValue());
//        String solDay = String.format("%02d", currentDate.getDayOfMonth());
//
//        // URL 인코딩 처리
//        String encodedSolYear = URLEncoder.encode(solYear, StandardCharsets.UTF_8);
//        String encodedSolMonth = URLEncoder.encode(solMonth, StandardCharsets.UTF_8);
//        String encodedSolDay = URLEncoder.encode(solDay, StandardCharsets.UTF_8);
//
//        // API URL 직접 생성
//        String requestUrl = String.format(
//                "%s/getHoliDeInfo?serviceKey=%s&solYear=%s&solMonth=%s&solDay=%s",
//                apiUrl, apiKey, encodedSolYear, encodedSolMonth, encodedSolDay
//        );
//
//        log.info("Request URL: " + requestUrl);
//
//        // API 호출
//        String response = webClient.get()
//                .uri(requestUrl)
//                .retrieve()
//                .bodyToMono(String.class)
//                .block();
//
//        log.info("API Response: " + response);
//        return parseXmlResponse(response);
//
//    } catch (Exception e) {
//        log.error("API 호출 중 오류 발생", e);
//        return "API 호출 실패";
//    }
//}
//public String getAnniversaryInfo() {
//    try {
//        LocalDate currentDate = LocalDate.now();
//        String solYear = String.valueOf(currentDate.getYear());
//        String solMonth = String.format("%02d", currentDate.getMonthValue());
//        String solDay = String.format("%02d", currentDate.getDayOfMonth());
//
//        String encodedSolYear = URLEncoder.encode(solYear, StandardCharsets.UTF_8);
//        String encodedSolMonth = URLEncoder.encode(solMonth, StandardCharsets.UTF_8);
//        String encodedSolDay = URLEncoder.encode(solDay, StandardCharsets.UTF_8);
//
//        String url =
//        log.info("Request URL: " + url);
//
//        URI uri = new URI(url);
//        String response = restTemplate.getForObject(uri, String.class);
//
//        log.info("API Response: " + response);
//        return parseXmlResponse(response);
//
//    } catch (Exception e) {
//        log.error("API 호출 중 오류 발생", e);
//        return "API 호출 실패: " + e.getMessage();
//    }
//}
//
//    private String parseXmlResponse(String xmlResponse) {
//        try {
//            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
//            DocumentBuilder builder = factory.newDocumentBuilder();
//            Document document = builder.parse(new InputSource(new StringReader(xmlResponse)));
//
//            NodeList itemList = document.getElementsByTagName("item");
//            StringBuilder result = new StringBuilder();
//
//            for (int i = 0; i < itemList.getLength(); i++) {
//                Element item = (Element) itemList.item(i);
//                String dateName = getElementValue(item, "dateName");
//                String locdate = getElementValue(item, "locdate");
//
//                result.append("날짜: ").append(locdate).append(", 기념일: ").append(dateName).append("\n");
//            }
//
//            return result.toString();
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "XML 파싱 중 오류 발생";
//        }
//    }
//
//    private String getElementValue(Element element, String tagName) {
//        NodeList nodeList = element.getElementsByTagName(tagName);
//        if (nodeList.getLength() > 0) {
//            return nodeList.item(0).getTextContent();
//        }
//        return "";
//    }

    public String getAnniversaryInfo() throws IOException {

        LocalDate currentDate = LocalDate.now();
        //String today = currentDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String today = "20250101";
        StringBuilder urlBuilder = new StringBuilder("http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo"); /*URL*/
        urlBuilder.append("?" + URLEncoder.encode("serviceKey","UTF-8") + apiKey); /*Service Key*/
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
        // JSON 파싱
//        ObjectMapper objectMapper = new ObjectMapper();
//        JsonNode rootNode = objectMapper.readTree(sb.toString());
//        JsonNode itemsNode = rootNode.path("response").path("body").path("items").path("item");
//
//        StringBuilder result = new StringBuilder();
//        if (itemsNode.isArray()) {
//            for (JsonNode item : itemsNode) {
//                if (Objects.equals(item.path("locdate").toString(), today)) {
//                    String dateName = item.path("dateName").asText();
//                    String isHoliday = item.path("isHoliday").asText();
//                    result.append(today).append(dateName)
//                            .append(", 공휴일 여부: ").append(isHoliday).append("\n");
//                }
//            }
//        }
//
//        return result.length() > 0 ? result.toString() : today+": 해당 날짜의 기념일 정보가 없습니다.";
//        System.out.println(sb.toString());
//
//        return sb.toString();

        String jsonResponse = sb.toString();

        // JSON 파싱
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        JsonNode itemsNode = rootNode.path("response").path("body").path("items").path("item");

        StringBuilder result = new StringBuilder();
        if (itemsNode.isArray()) {
            for (JsonNode item : itemsNode) {
                int locdate = item.path("locdate").asInt();
                String dateName = item.path("dateName").asText();
                String isHoliday = item.path("isHoliday").asText();
                result.append(String.format("날짜: %d, 이름: %s, 공휴일 여부: %s\n", locdate, dateName, isHoliday));
            }
        } else if (!itemsNode.isMissingNode()) {
            int locdate = itemsNode.path("locdate").asInt();
            String dateName = itemsNode.path("dateName").asText();
            String isHoliday = itemsNode.path("isHoliday").asText();
            result.append(String.format("날짜: %d, 이름: %s, 공휴일 여부: %s\n", locdate, dateName, isHoliday));
        } else {
            result.append("해당 날짜의 정보가 없습니다.\n");
        }
        result.append("\n");
        return result.toString();

//        int locdate = itemNode.path("locdate").asInt();
//        String dateName = itemNode.path("dateName").asText();
//        String isHoliday = itemNode.path("isHoliday").asText();
//
//        if(dateName.equals("")){
//            return String.format("%s년 %s월 %s일은 기념일이 아닙니다.", today.substring(0,4), today.substring(4,6),today.substring(6));
//        }
//        return String.format("날짜: %d, 기념일: %s, 기념일 유무: %s", locdate, dateName, isHoliday);
    }
}