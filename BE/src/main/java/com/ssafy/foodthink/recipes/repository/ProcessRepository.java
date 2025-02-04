package com.ssafy.foodthink.recipes.repository;

import com.ssafy.foodthink.recipes.entity.IngredientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessRepository extends JpaRepository<IngredientEntity, Long> {
    
}
