package com.ssafy.foodthink.myOwnRecipe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/*
    조회, 수정, 삭제에서 사용할 RequestDto
    레시피 아이디와 로그인 상태를 확인해서 내가 작성한 레시피 목록을 본다거나, 수정하거나, 삭제한다.
    + 수정하기 전, 수정할 레시피 내용 조회 추가
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MyRecipeIdRequestDto {
    private Long recipeId;
}
