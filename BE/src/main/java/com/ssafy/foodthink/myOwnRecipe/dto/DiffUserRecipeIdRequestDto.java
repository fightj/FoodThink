package com.ssafy.foodthink.myOwnRecipe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/*
    다른 사용자가 작성한 레시피 목록 조회 RequestDto
    (다른 사용자의 마이페이지에서 사용)
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DiffUserRecipeIdRequestDto {
    private String nickname;
}
