package com.ssafy.foodthink.subscribe.repository;

import com.ssafy.foodthink.subscribe.entity.SubscribeEntity;
import com.ssafy.foodthink.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SubscribeRepository extends JpaRepository<SubscribeEntity, Long> {

//    List<SubscribeEntity> findSubscribedUserBySubscriber(UserEntity subscriber);
    // 특정 subscriber가 구독한 사용자 목록을 가져오는 쿼리
    @Query("SELECT s.subscribedUser FROM SubscribeEntity s WHERE s.subscriber = :subscriber")
    List<UserEntity> findSubscribedUserBySubscriber(@Param("subscriber") UserEntity subscriber);
    // 특정 구독자가 구독한 사용자 조회
    Optional<SubscribeEntity> findBySubscriberAndSubscribedUser(UserEntity subscriber, UserEntity subscribedUser);
    // 구독중인지 확인
    boolean existsBySubscriberAndSubscribedUser(UserEntity subscriber, UserEntity subscribedUser);
    int countBySubscriber(UserEntity userEntity);

}
