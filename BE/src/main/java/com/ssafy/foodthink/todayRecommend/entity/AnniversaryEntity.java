package com.ssafy.foodthink.todayRecommend.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "anniversary")
public class AnniversaryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "anniversary_id")
    private Long anniversaryId;

    @Column(name = "anniversary_name")
    private String anniversaryName; // 기념일 API 호출 시 받아오는 기념일명

    @Column(name = "anniversary_menu")
    private String anniversaryMenu; // 기념일 관련 메뉴

    @Column(name = "menu_Image")
    private String menuImage; // response 기념일명

}
