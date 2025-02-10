package com.ssafy.foodthink.subscribe.service;

import com.ssafy.foodthink.user.dto.UserInfoDto;

import java.util.List;

public interface SubscribeService {
    //구독 생성
    void createSubscribe(Long id, String nickname);
    //구독 삭제
    void deleteSubscribe(Long id, String nickname);
    //구독 조회
    List<UserInfoDto> readSubscribe(Long id);
    //구독 여부 확인
    boolean checkSubscribe(Long id, String nickname);
    //구독자 수
    int countSubscribedUser(String nickname);
}
