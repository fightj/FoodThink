package com.ssafy.foodthink.user.repository;

import com.ssafy.foodthink.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
    //Optional<UserEntity> findBySocialId(String socialId);
    //boolean existsByEmail(String email);
}
