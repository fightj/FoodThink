package com.ssafy.foodthink.myOwnRecipe.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.foodthink.recipes.dto.ProcessImageDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProcessRequestDto {
    private Integer processOrder;
    private String processExplain;

    @JsonProperty("processImage")
    private List<ProcessImageRequestDto> images;
}
