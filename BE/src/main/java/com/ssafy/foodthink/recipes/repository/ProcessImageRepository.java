package com.ssafy.foodthink.recipes.repository;

import com.ssafy.foodthink.recipes.entity.IngredientEntity;
import com.ssafy.foodthink.recipes.entity.ProcessImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessImageRepository extends JpaRepository<ProcessImageEntity, Long> {
    
}
