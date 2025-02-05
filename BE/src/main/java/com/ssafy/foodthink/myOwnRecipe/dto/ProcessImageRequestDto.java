package com.ssafy.foodthink.myOwnRecipe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProcessImageRequestDto {
    private Integer processOrder;   //몇 번째 과정의 이미지인지 표시
    private MultipartFile processImage;
}
