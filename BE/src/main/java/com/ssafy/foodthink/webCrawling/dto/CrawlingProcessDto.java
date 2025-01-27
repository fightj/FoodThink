package com.ssafy.foodthink.webCrawling.dto;

import jakarta.persistence.Lob;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CrawlingProcessDto {

    private Integer processOrder;             // 과정 순서
    private String processExplain;            // 과정 설명
    private List<CrawlingProcessImageDto> images; // 과정 이미지 리스트

}
