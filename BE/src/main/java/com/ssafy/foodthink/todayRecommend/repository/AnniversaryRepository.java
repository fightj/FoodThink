package com.ssafy.foodthink.todayRecommend.repository;

import com.ssafy.foodthink.todayRecommend.entity.AnniversaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnniversaryRepository extends JpaRepository<AnniversaryEntity, Long> {

    Optional<AnniversaryEntity> findByAnniversaryName(String anniversaryName);

}

