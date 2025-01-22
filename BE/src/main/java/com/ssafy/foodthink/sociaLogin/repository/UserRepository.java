package com.ssafy.foodthink.sociaLogin.repository;

import com.ssafy.foodthink.sociaLogin.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByEmail(String email); // 소셜 로그인 시 사용자가 가입되어 있는지 확인
    //Optional<UserEntity> findByRefreshToken(String refreshToken); // 서버가 전달받은 Refresh Token으로 해당 사용자 찾기
}
