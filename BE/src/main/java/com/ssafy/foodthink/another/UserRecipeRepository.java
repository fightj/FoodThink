package com.ssafy.foodthink.another;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRecipeRepository extends JpaRepository<UserRecipe, Long> {
}
