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
    Optional<UserEntity> findByNickname(String nickname);
}
