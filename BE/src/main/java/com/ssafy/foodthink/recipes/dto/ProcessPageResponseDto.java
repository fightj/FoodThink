package com.ssafy.foodthink.recipes.dto;

import com.ssafy.foodthink.recipes.entity.ProcessEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import software.amazon.awssdk.core.pagination.sync.PaginatedResponsesIterator;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ProcessPageResponseDto {
    private List<ProcessDto> processes;
    private int totalProcess;       //총 과정 수
    private int totalPages;         //총 페이지 수
    private int currentPage;        //현재 페이지
}
