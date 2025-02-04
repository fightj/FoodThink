package com.ssafy.foodthink.feed.dto;

import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class CustomPageResponseDto<T> {
    private List<T> content;
    private int totalPages;
    private long totalElements;
    private boolean last;

    public CustomPageResponseDto(Page<T> page) {
        this.content = page.getContent();
        this.totalPages = page.getTotalPages();
        this.totalElements = page.getTotalElements();
        this.last = page.isLast();
    }
}

