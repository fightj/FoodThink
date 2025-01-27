package com.ssafy.foodthink.feed.service;

import com.ssafy.foodthink.another.*;
import com.ssafy.foodthink.feed.dto.FeedRequestDto;
import com.ssafy.foodthink.feed.dto.FeedResponseDto;
import com.ssafy.foodthink.feed.entity.FeedEntity;
import com.ssafy.foodthink.feed.entity.FeedImageEntity;
import com.ssafy.foodthink.feed.repository.FeedImageRepository;
import com.ssafy.foodthink.feed.repository.FeedRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class FeedServiceImpl implements FeedService{

    private final FeedRepository feedRepository;
    private final UsersRepository usersRepository;
    private final UserRecipeRepository userRecipeRepository;
    private final CrawlingRecipeRepository crawlingRecipeRepository;
    private final S3Service s3Service;
    private final FeedImageRepository feedImageRepository;

    public FeedServiceImpl(FeedRepository feedRepository, UsersRepository usersRepository, UserRecipeRepository userRecipeRepository, CrawlingRecipeRepository crawlingRecipeRepository, S3Service s3Service, FeedImageRepository feedImageRepository) {
        this.feedRepository = feedRepository;
        this.usersRepository = usersRepository;
        this.userRecipeRepository = userRecipeRepository;
        this.crawlingRecipeRepository = crawlingRecipeRepository;
        this.s3Service = s3Service;
        this.feedImageRepository = feedImageRepository;
    }

    @Override
    @Transactional
    public void createFeed(FeedRequestDto feedRequestDto, List<MultipartFile> images) {

//        log.info(feedDto);
        log.info(feedRequestDto.toString());
        // Optional에서 값 추출 (없으면 예외 던짐)
        UsersEntity user = usersRepository.findUsersByUserId(feedRequestDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        // userRecipeId가 주어졌다면, 해당 UserRecipe를 찾고, 그렇지 않으면 null로 설정
        UserRecipe userRecipe = feedRequestDto.getUserRecipeId() != null
                ? userRecipeRepository.findById(feedRequestDto.getUserRecipeId())
                .orElseThrow(() -> new IllegalArgumentException("UserRecipe not found"))
                : null;

        // crawlingRecipeId가 주어졌다면, 해당 CrawlingRecipe를 찾고, 그렇지 않으면 null로 설정
        CrawlingRecipe crawlingRecipe = feedRequestDto.getCrawlingRecipeId() != null
                ? crawlingRecipeRepository.findById(feedRequestDto.getCrawlingRecipeId())
                .orElseThrow(() -> new IllegalArgumentException("CrawlingRecipe not found"))
                : null;


        FeedEntity feedEntity = FeedEntity.builder()
                .foodName(feedRequestDto.getFoodName())
                .content(feedRequestDto.getContent())
                .usersEntity(user)
                .userRecipe(userRecipe)
                .crawlingRecipe(crawlingRecipe)
                .build();

        FeedEntity saveFeed = feedRepository.save(feedEntity);

        //사진 저장
        List<FeedImageEntity> feedImageEntities = new ArrayList<>();
        int sequence = 1;
        for (MultipartFile image : images) {
            if (image != null && !image.isEmpty()) {
                String imageUrl = s3Service.uploadFile(image);
                FeedImageEntity feedImageEntity = FeedImageEntity.builder()
                        .imageUrl(imageUrl)
                        .sequence(sequence++)
                        .feedEntity(feedEntity)
                        .build();

                feedImageEntities.add(feedImageEntity);
            }
        }

        feedImageRepository.saveAll(feedImageEntities);
    }

    @Override
    public FeedResponseDto readFeedById(Long id) {
        return null;
    }
}
