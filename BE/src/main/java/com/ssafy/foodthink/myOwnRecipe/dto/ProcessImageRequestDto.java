package com.ssafy.foodthink.myOwnRecipe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@AllArgsConstructor
public class ProcessImageRequestDto {
    private MultipartFile processImage;
}
