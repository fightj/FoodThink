package com.ssafy.foodthink.subscribe.entity;

import com.ssafy.foodthink.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class)
@Data
@Table(name="subscribe")
@NoArgsConstructor    //jpa사용하는 경우 기본 생성자 필요
@AllArgsConstructor   //builer와 noargsconstructor 같이 사용하려면 allargsconstructor도 사용해야함
@Entity
@Builder
public class SubscribeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscriber_id")
    private UserEntity subscriber; // 구독자 (User 엔티티와 연결)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscribed_user_id")
    private UserEntity subscribedUser; // 구독 대상 사용자 (User 엔티티와 연결)

    @Column(name = "write_time")
    @CreatedDate
    private LocalDateTime writeTime;

}
