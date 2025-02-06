package com.ssafy.foodthink.user.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
public class RecipeViewDto {
    private Long recipeId;
    private LocalDateTime viewTime;
}
