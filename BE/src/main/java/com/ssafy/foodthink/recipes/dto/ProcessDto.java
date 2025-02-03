package com.ssafy.foodthink.recipes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ProcessDto {
    private Integer processOrder;
    private String processExplain;

    private List<ProcessImageDto> images;
}
