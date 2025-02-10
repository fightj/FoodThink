package com.ssafy.foodthink.foodRecommend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class UserTfIdfId implements Serializable {
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "feature")
    private String feature;

    // 기본 생성자 필수
    public UserTfIdfId() {}

    public UserTfIdfId(Long userId, String feature) {
        this.userId = userId;
        this.feature = feature;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserTfIdfId)) return false;
        UserTfIdfId that = (UserTfIdfId) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(feature, that.feature);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, feature);
    }
}

