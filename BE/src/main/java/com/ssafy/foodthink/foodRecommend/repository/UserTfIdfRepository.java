package com.ssafy.foodthink.foodRecommend.repository;

import com.ssafy.foodthink.foodRecommend.entity.UserTfIdfEntity;
import com.ssafy.foodthink.foodRecommend.entity.UserTfIdfId;
import com.ssafy.foodthink.user.entity.UserInterestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

//@Repository
//public interface UserTfIdfRepository extends JpaRepository<UserTfIdfEntity, Long> {
//
//    // 특정 사용자의 모든 TF-IDF 벡터 조회
////    List<UserTfIdfEntity> findByUserId(Long userId);
//
//    // 특정 사용자의 feature 조회
////    Optional<UserTfIdfEntity> findByUserIdAndFeature(Long userId, String feature);
//
//    // 사용자의 선호/기피 재료 특성 삭제
//    //@Modifying
//    //@Query("DELETE FROM UserTfIdfEntity u WHERE u.userId = :userId AND u.feature LIKE :prefix%")
//    //void deleteFeaturesByPrefix(Long userId, String prefix);
//
////    @Modifying
////    @Query("DELETE FROM UserTfIdfEntity u WHERE u.userId = :userId")
////    void deleteByUserId(Long userId);
////
////    void deleteByUserIdAndFeature(Long userId, String feature);
////
////    @Modifying
////    @Query(value = "INSERT INTO user_tfidf (user_id, feature, tfidf_value) VALUES (:userId, :feature, :value) " +
////            "ON DUPLICATE KEY UPDATE tfidf_value = :value", nativeQuery = true)
////    void upsert(Long userId, String feature, Double value);
//
//
//    List<UserTfIdfEntity> findByUserId(Long userId);
//    void deleteByUserId(Long userId);
//    void deleteByUserIdAndFeature(Long userId, String feature);
//
//    // upsert 메서드 (복합 키 반영)
//    @Modifying
//    @Query(value = "INSERT INTO user_tfidf (user_id, feature, tfidf_value) " +
//            "VALUES (:userId, :feature, :value) " +
//            "ON DUPLICATE KEY UPDATE tfidf_value = :value",
//            nativeQuery = true)
//    void upsert(Long userId,String feature,Double value);
//
//
//}
@Repository
public interface UserTfIdfRepository extends JpaRepository<UserTfIdfEntity, UserTfIdfId> {
    List<UserTfIdfEntity> findByIdUserId(Long userId);
    void deleteByIdUserId(Long userId);
}

