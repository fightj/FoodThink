package com.ssafy.foodthink.feed.service;

import com.ssafy.foodthink.another.*;
import com.ssafy.foodthink.feed.dto.FeedCommentRequestDto;
import com.ssafy.foodthink.feed.dto.FeedRequestDto;
import com.ssafy.foodthink.feed.dto.FeedResponseDto;
import com.ssafy.foodthink.feed.entity.FeedCommentEntity;
import com.ssafy.foodthink.feed.entity.FeedEntity;
import com.ssafy.foodthink.feed.entity.FeedImageEntity;
import com.ssafy.foodthink.feed.entity.FeedLikeEntity;
import com.ssafy.foodthink.feed.repository.FeedCommentRepository;
import com.ssafy.foodthink.feed.repository.FeedImageRepository;
import com.ssafy.foodthink.feed.repository.FeedLikeRepository;
import com.ssafy.foodthink.feed.repository.FeedRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class FeedServiceImpl implements FeedService{

    private final FeedRepository feedRepository;
    private final UsersRepository usersRepository;
    private final UserRecipeRepository userRecipeRepository;
    private final CrawlingRecipeRepository crawlingRecipeRepository;
    private final S3Service s3Service;
    private final FeedImageRepository feedImageRepository;
    private final FeedLikeRepository feedLikeRepository;
    private final FeedCommentRepository feedCommentRepository;

    public FeedServiceImpl(FeedRepository feedRepository, UsersRepository usersRepository, UserRecipeRepository userRecipeRepository, CrawlingRecipeRepository crawlingRecipeRepository, S3Service s3Service, FeedImageRepository feedImageRepository, FeedLikeRepository feedLikeRepository, FeedCommentRepository feedCommentRepository) {
        this.feedRepository = feedRepository;
        this.usersRepository = usersRepository;
        this.userRecipeRepository = userRecipeRepository;
        this.crawlingRecipeRepository = crawlingRecipeRepository;
        this.s3Service = s3Service;
        this.feedImageRepository = feedImageRepository;
        this.feedLikeRepository = feedLikeRepository;
        this.feedCommentRepository = feedCommentRepository;
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
        FeedResponseDto feedResponseDto;

        FeedEntity feedEntity = feedRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 피드를 찾을 수 없습니다. ID: " + id));

        List<String> imageUrls = readImageUrlsByFeedId(feedEntity.getId());

        return createFeedResponseDtoByBuilder(feedEntity, imageUrls);
    }

    @Override
    public List<FeedResponseDto> readFeedsByUserId(Long userId) {
        List<FeedResponseDto> feedResponseDtos = new ArrayList<>();

        List<FeedEntity> feedEntities = feedRepository.findAllByUsersEntity_userIdOrderByWriteTime(userId);

        for (FeedEntity feedEntity : feedEntities) {
            List<String> imageUrls = readImageUrlsByFeedId(feedEntity.getId());

            feedResponseDtos.add(createFeedResponseDtoByBuilder(feedEntity, imageUrls));
        }

        return feedResponseDtos;
    }

    @Override
    public void createFeedLikeByFeedId(Long feedId, Long userId) {
        //중복 여부 확인
        boolean exists = feedLikeRepository.existsByFeedEntity_IdAndUsersEntity_userId(feedId, userId);
        if(exists) {
            throw  new IllegalArgumentException(" 이미 좋아요를 누른 상태입니다.");
        }

        //엔티티 조회
        FeedEntity feedEntity = feedRepository.findById(feedId)
                .orElseThrow(() -> new IllegalArgumentException("해당 피드를 찾을 수 없습니다. ID: " + feedId));
        UsersEntity usersEntity = usersRepository.findUsersByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다. ID: " + userId));

        //좋아요 저장
        FeedLikeEntity feedLikeEntity = FeedLikeEntity.builder()
                .feedEntity(feedEntity)
                .usersEntity(usersEntity)
                .build();

        feedLikeRepository.save(feedLikeEntity);
    }

    @Override
    public void deleteFeedLikeByFeedId(Long feedId, Long userId) {
        FeedLikeEntity feedLikeEntity = feedLikeRepository.findByFeedEntity_IdAndUsersEntity_userId(feedId, userId);
        feedLikeRepository.delete(feedLikeEntity);
    }

    @Override
    public void createFeedCommentByFeedId(Long feedId, FeedCommentRequestDto feedCommentRequestDto) {
        //엔티티 조회
        FeedEntity feedEntity = feedRepository.findById(feedId)
                .orElseThrow(() -> new IllegalArgumentException("해당 피드를 찾을 수 없습니다. ID: " + feedId));
        UsersEntity usersEntity = usersRepository.findUsersByUserId(feedCommentRequestDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다. ID: " + feedCommentRequestDto.getUserId()));

        //댓글 저장
        FeedCommentEntity feedCommentEntity = FeedCommentEntity.builder()
                .content(feedCommentRequestDto.getContent())
                .usersEntity(usersEntity)
                .feedEntity(feedEntity)
                .build();
        feedCommentRepository.save(feedCommentEntity);
    }

    @Override
    public void deleteFeedCommentByFeedId(Long feedCommentId) {
        FeedCommentEntity feedCommentEntity = feedCommentRepository.findById(feedCommentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 피드 댓글을 찾을 수 없습니다. ID: " + feedCommentId));
        feedCommentRepository.delete(feedCommentEntity);
    }


    @Override
    public List<FeedResponseDto> readFeedsByUserIdAndLogIn(Long searchUserId, Long logInUserId) {
        List<FeedResponseDto> feedResponseDtos = new ArrayList<>();

        List<FeedEntity> feedEntities = feedRepository.findAllByUsersEntity_userIdOrderByWriteTime(searchUserId);

        for (FeedEntity feedEntity : feedEntities) {
            List<String> imageUrls = readImageUrlsByFeedId(feedEntity.getId());

            FeedResponseDto feedResponseDto = createFeedResponseDtoByBuilder(feedEntity, imageUrls);
            if(logInUserId != null) {
                feedResponseDto.setLike(feedLikeRepository.existsByFeedEntity_IdAndUsersEntity_userId(feedResponseDto.getId(), logInUserId));
            }
            feedResponseDtos.add(feedResponseDto);
        }

        return feedResponseDtos;
    }

    @Override
    public void deleteFeedByFeedId(Long feedId) {
        FeedEntity feedEntity = feedRepository.findById(feedId)
                .orElseThrow(() -> new IllegalArgumentException("해당 피드가 존재하지 않습니다."));
        feedRepository.delete(feedEntity);
    }

    @Override
    public List<String> readImageUrlsByFeedId(Long id) {
        List<FeedImageEntity> feedImageEntities = feedImageRepository.findByFeedEntity_Id(id);
        List<String> imageUrls = new ArrayList<>();
        for (FeedImageEntity feedImageEntity : feedImageEntities) {
            imageUrls.add(feedImageEntity.getImageUrl());
        }
        return imageUrls;
    }

    @Override
    public FeedResponseDto createFeedResponseDtoByBuilder(FeedEntity feedEntity, List<String> imageUrls) {
        return FeedResponseDto.builder()
                .id(feedEntity.getId())
                .foodName(feedEntity.getFoodName())
                .content(feedEntity.getContent())
                .writeTime(feedEntity.getWriteTime())
                .userId(feedEntity.getUsersEntity().getUserId())
                .username(feedEntity.getUsersEntity().getUsername())
                .userRecipeId(feedEntity.getUserRecipe() != null ? feedEntity.getUserRecipe().getRecipeId() : null)
                .crawlingRecipeId(feedEntity.getCrawlingRecipe() != null ? feedEntity.getCrawlingRecipe().getRecipeId() : null)
                .images(imageUrls)
                .build();
    }


}
