package com.ssafy.foodthink.user.dto;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
public class UserInterestDto {

    private String ingredient;
    private Boolean isLiked;
}
