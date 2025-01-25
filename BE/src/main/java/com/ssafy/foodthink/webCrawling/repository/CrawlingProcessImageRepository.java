package com.ssafy.foodthink.webCrawling.repository;

import com.ssafy.foodthink.webCrawling.entity.CrawlingProcessImageEntity;
import com.ssafy.foodthink.webCrawling.entity.CrawlingRecipeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
    데이터베이스와 상호작용 처리 (JPA 기준)
 */

@Repository
public interface CrawlingProcessImageRepository extends JpaRepository<CrawlingProcessImageEntity, Long> {
//
//    //이미지URL과 과정 순서로 과정 이미지 정보의 중복 검사
//    boolean existsByImageUrlAndProcessOrder(String imageUrl, Integer order);

}
