package com.ssafy.foodthink.recipes.dto;

public class IngredientDto {
    private String ingreName;
    private String amount;

    public IngredientDto() {

    }

    public IngredientDto(String ingreName, String amount) {
        this.ingreName = ingreName;
        this.amount = amount;
    }

    public String getIngreName() {
        return ingreName;
    }

    public String getAmount() {
        return amount;
    }

    public void setIngreName(String ingreName) {
        this.ingreName = ingreName;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

}
