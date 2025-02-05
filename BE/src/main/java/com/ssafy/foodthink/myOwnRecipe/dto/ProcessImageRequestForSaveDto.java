package com.ssafy.foodthink.myOwnRecipe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProcessImageRequestForSaveDto {
    private Integer processOrder;
    private String processExplain;
    private String processImage;  // 단일 이미지 URL
}
