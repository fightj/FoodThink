package com.ssafy.foodthink.todayRecommend.dto;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
public class AnniversaryDto {

    private String anniversaryName;
    private String anniversaryMenu;
    private String menuImage;
}
