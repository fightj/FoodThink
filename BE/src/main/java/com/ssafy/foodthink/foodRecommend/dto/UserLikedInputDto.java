package com.ssafy.foodthink.foodRecommend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.stream.Stream;

@Getter
@Setter
public class UserLikedInputDto {
    private List<String> answers;
}
