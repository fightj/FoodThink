package com.ssafy.foodthink.recipes.repository;

import com.ssafy.foodthink.recipes.entity.IngredientEntity;
import com.ssafy.foodthink.recipes.entity.ProcessImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessImageRepository extends JpaRepository<ProcessImageEntity, Long> {

    //레시피 수정 : 기존 과정별 이미지 삭제
    void deleteByProcessEntity_ProcessOrder(Integer processOrder);
}
