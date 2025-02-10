package com.ssafy.foodthink.global;

import com.ssafy.foodthink.foodRecommend.service.RecipeTFIDFService;
import com.ssafy.foodthink.foodRecommend.service.UserTFIDFService;
import com.ssafy.foodthink.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class BatchScheduler {
    private final RecipeTFIDFService recipeTFIDFService;
    private final UserTFIDFService userTFIDFService;
    private final UserRepository userRepository;

    //매일 새벽 4시에 모든 레시피 TF-IDF 계산
    @Scheduled(cron = "0 0 4 * * *", zone = "Asia/Seoul")
    public void scheduleRecipeTfIdfTask() {
        log.info("레시피 TF-IDF 계산 배치 시작");
        recipeTFIDFService.calculateAndSaveAllTfIdf();
        log.info("레시피 TF-IDF 계산 배치 완료");
    }

    // 1분 간격으로 모든 사용자의 TF-IDF 계산
    @Scheduled(cron = "0 * * * * *", zone = "Asia/Seoul")
    public void scheduleUserProfileUpdate() {
        log.info("사용자 프로필 업데이트 배치 시작");
        userRepository.findAll().forEach(user ->
                userTFIDFService.updateUserTfidf(user.getUserId())
        );
        log.info("사용자 프로필 업데이트 배치 완료");
    }
}

