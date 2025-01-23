package com.ssafy.foodthink.user.repository;

import com.ssafy.foodthink.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email); // 이메일로 기존 사용자인지 확인하기
    Optional<UserEntity> findById(Long id);
    Optional<UserEntity> findByNickname(String nickname);
}
