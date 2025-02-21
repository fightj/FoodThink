package com.ssafy.foodthink.user.repository;

import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.entity.UserInterestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email); // 이메일로 기존 사용자인지 확인하기
    Optional<UserEntity> findByUserId(Long userid); // userId로 사용자 찾기
    Optional<UserEntity> findByNickname(String nickname); // 닉네임 중복 확인하기

    List<UserEntity> findAll(); // 모든 사용자 조회(배치 스케줄러 시 사용)
    List<UserEntity> findByUserIdBetween(Long start, Long end); // userId 1~20 사이 조회
}
