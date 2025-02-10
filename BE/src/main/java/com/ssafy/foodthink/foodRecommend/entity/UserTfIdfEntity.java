package com.ssafy.foodthink.foodRecommend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="user_tfidf")
public class UserTfIdfEntity {

    @EmbeddedId  // 복합 키
    private UserTfIdfId id;

    @Column(name = "tfidf_value", nullable = false)
    private Double tfIdfValue;

    public UserTfIdfEntity(Long userId, String feature, Double tfIdfValue) {
        this.id = new UserTfIdfId(userId, feature);
        this.tfIdfValue = tfIdfValue;
    }

    // 편의 메서드 추가
    public Long getUserId() { return id.getUserId(); }
    public String getFeature() { return id.getFeature(); }
}


//@Entity
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Table(name="user_tfidf")
//public class UserTfIdfEntity {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "user_tfidf_id")
//    private Long userTfidfId;
//
//    @Column(name="user_id")
//    private Long userId;
//
//    @Column(name = "feature", nullable = false)
//    private String feature;
//
//    @Column(name = "tfidf_value", nullable = false)
//    private Double tfIdfValue;
//
//    public UserTfIdfEntity(Long userId, String feature, Double tfIdfValue) {
//        this.userId = userId;
//        this.feature = feature;
//        this.tfIdfValue = tfIdfValue;
//    }
//
//}
