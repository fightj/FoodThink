package com.ssafy.foodthink.sociaLogin.dto;

import com.ssafy.foodthink.sociaLogin.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
//@Builder
public class UserDto {

    private int userId;
    private String socialId;
    private String socialType;
    private String email;
    private String nickname;
    private String image;

}
