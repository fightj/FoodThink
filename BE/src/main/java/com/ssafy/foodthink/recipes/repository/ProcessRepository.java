package com.ssafy.foodthink.recipes.repository;

import com.ssafy.foodthink.recipes.entity.IngredientEntity;
import com.ssafy.foodthink.recipes.entity.ProcessEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessRepository extends JpaRepository<ProcessEntity, Long> {
    
}
