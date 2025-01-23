package com.ssafy.foodthink.feed.service;

import com.ssafy.foodthink.*;
import com.ssafy.foodthink.another.*;
import com.ssafy.foodthink.feed.dto.FeedDto;
import com.ssafy.foodthink.feed.entity.FeedEntity;
import com.ssafy.foodthink.feed.repository.FeedRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class FeedServiceImpl implements FeedService{

    private final FeedRepository feedRepository;
    private final UsersRepository usersRepository;
    private final UserRecipeRepository userRecipeRepository;
    private final CrawlingRecipeRepository crawlingRecipeRepository;

    public FeedServiceImpl(FeedRepository feedRepository, UsersRepository usersRepository, UserRecipeRepository userRecipeRepository, CrawlingRecipeRepository crawlingRecipeRepository) {
        this.feedRepository = feedRepository;
        this.usersRepository = usersRepository;
        this.userRecipeRepository = userRecipeRepository;
        this.crawlingRecipeRepository = crawlingRecipeRepository;
    }

    @Override
    public Long createFeed(FeedDto feedDto) {

//        log.info(feedDto);
        log.info(feedDto.toString());
        // Optional에서 값 추출 (없으면 예외 던짐)
        UsersEntity user = usersRepository.findUsersById(feedDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        // userRecipeId가 주어졌다면, 해당 UserRecipe를 찾고, 그렇지 않으면 null로 설정
        UserRecipe userRecipe = feedDto.getUserRecipeId() != null
                ? userRecipeRepository.findById(feedDto.getUserRecipeId())
                .orElseThrow(() -> new IllegalArgumentException("UserRecipe not found"))
                : null;

        // crawlingRecipeId가 주어졌다면, 해당 CrawlingRecipe를 찾고, 그렇지 않으면 null로 설정
        CrawlingRecipe crawlingRecipe = feedDto.getCrawlingRecipeId() != null
                ? crawlingRecipeRepository.findById(feedDto.getCrawlingRecipeId())
                .orElseThrow(() -> new IllegalArgumentException("CrawlingRecipe not found"))
                : null;


        FeedEntity feedEntity = FeedEntity.builder()
                .foodName(feedDto.getFoodName())
                .content(feedDto.getContent())
                .usersEntity(user)
                .userRecipe(userRecipe)
                .crawlingRecipe(crawlingRecipe)
                .build();

        FeedEntity saveFeed = feedRepository.save(feedEntity);
        return 1L;
    }
}
