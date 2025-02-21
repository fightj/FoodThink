package com.ssafy.foodthink.recipes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProcessDto {
    private Integer processOrder;
    private String processExplain;

    private List<ProcessImageDto> images;
    
    //ProcessPageResponseDto의 레시피 보기 기능 중 과정 설명에 대하여
    //시간을 뽑아내기 위한 용도
    private Integer minutes;    //분
    private Integer seconds;    //초

    public ProcessDto(Integer processOrder, String processExplain, List<ProcessImageDto> images) {
        this.processOrder = processOrder;
        this.processExplain = processExplain;
        this.images = images;
        extractTime(processExplain);
    }

    private void extractTime(String explain) {
        minutes = 0;
        seconds = 0;

        if (explain == null) return;

        //정규식 패턴: "XX분YY초" 또는 "XX분" 또는 "YY초"
        Pattern pattern = Pattern.compile("(\\d+)\\s*분(?:\\s*(\\d+)\\s*초)?|(\\d+)\\s*초");
        Matcher matcher = pattern.matcher(explain.replaceAll("\\s+", "")); // 띄어쓰기 제거

        if (matcher.find()) {
            if (matcher.group(1) != null && !matcher.group(1).isEmpty()) {
                minutes = Integer.parseInt(matcher.group(1));
            }
            if (matcher.group(2) != null && !matcher.group(2).isEmpty()) {
                seconds = Integer.parseInt(matcher.group(2));
            }
            if (matcher.group(3) != null && !matcher.group(3).isEmpty()) {
                seconds = Integer.parseInt(matcher.group(3));
            }
        }
    }
}
