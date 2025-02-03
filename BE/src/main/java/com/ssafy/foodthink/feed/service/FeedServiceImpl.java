package com.ssafy.foodthink.feed.service;

import com.ssafy.foodthink.feed.dto.*;
import com.ssafy.foodthink.feed.entity.FeedCommentEntity;
import com.ssafy.foodthink.feed.entity.FeedEntity;
import com.ssafy.foodthink.feed.entity.FeedImageEntity;
import com.ssafy.foodthink.feed.entity.FeedLikeEntity;
import com.ssafy.foodthink.feed.repository.FeedCommentRepository;
import com.ssafy.foodthink.feed.repository.FeedImageRepository;
import com.ssafy.foodthink.feed.repository.FeedLikeRepository;
import com.ssafy.foodthink.feed.repository.FeedRepository;
import com.ssafy.foodthink.global.S3Service;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FeedServiceImpl implements FeedService{

    private final FeedRepository feedRepository;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final S3Service s3Service;
    private final FeedImageRepository feedImageRepository;
    private final FeedLikeRepository feedLikeRepository;
    private final FeedCommentRepository feedCommentRepository;

    public FeedServiceImpl(FeedRepository feedRepository, UserRepository userRepository, RecipeRepository recipeRepository, S3Service s3Service, FeedImageRepository feedImageRepository, FeedLikeRepository feedLikeRepository, FeedCommentRepository feedCommentRepository) {
        this.feedRepository = feedRepository;
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
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
        UserEntity user = userRepository.findByUserId(feedRequestDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다."));

        RecipeEntity recipe = feedRequestDto.getRecipeId() != null
                ? recipeRepository.findById(feedRequestDto.getRecipeId())
                .orElseThrow(() -> new IllegalArgumentException("해당 레시피가 존재하지 않습니다."))
                : null;


        FeedEntity feedEntity = FeedEntity.builder()
                .foodName(feedRequestDto.getFoodName())
                .content(feedRequestDto.getContent())
                .userEntity(user)
                .recipeEntity(recipe)
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

        FeedEntity feedEntity = feedRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 피드를 찾을 수 없습니다. ID: " + id));

        List<String> imageUrls = readImageUrlsByFeedId(feedEntity.getId());
        FeedResponseDto feedResponseDto = createFeedResponseDtoByBuilder(feedEntity, imageUrls);
        //댓글 조회
        List<FeedCommentResponseDto> feedCommentResponseDtos = readFeedCommentsByFeedId(id);
        feedResponseDto.setFeedCommentResponseDtos(feedCommentResponseDtos);
        return feedResponseDto;
    }

    @Override
    public FeedResponseDto readFeedById(Long id, Long userId) {
        FeedResponseDto feedResponseDto = readFeedById(id);
        boolean check = feedLikeRepository.existsByFeedEntity_IdAndUserEntity_userId(id, userId);
        feedResponseDto.setLike(check);
        return feedResponseDto;
    }

    @Override
    public List<FeedResponseDto> readFeedsByUserId(Long userId) {
        List<FeedResponseDto> feedResponseDtos = new ArrayList<>();

        List<FeedEntity> feedEntities = feedRepository.findAllByUserEntity_userIdOrderByWriteTime(userId);

        for (FeedEntity feedEntity : feedEntities) {
            List<String> imageUrls = readImageUrlsByFeedId(feedEntity.getId());

            feedResponseDtos.add(createFeedResponseDtoByBuilder(feedEntity, imageUrls));
        }

        return feedResponseDtos;
    }

    @Override
    public void createFeedLikeByFeedId(Long feedId, Long userId) {
        //중복 여부 확인
        boolean exists = feedLikeRepository.existsByFeedEntity_IdAndUserEntity_userId(feedId, userId);
        if(exists) {
            throw  new IllegalArgumentException(" 이미 좋아요를 누른 상태입니다.");
        }

        //엔티티 조회
        FeedEntity feedEntity = feedRepository.findById(feedId)
                .orElseThrow(() -> new IllegalArgumentException("해당 피드를 찾을 수 없습니다. ID: " + feedId));
        UserEntity UserEntity = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다. ID: " + userId));

        //좋아요 저장
        FeedLikeEntity feedLikeEntity = FeedLikeEntity.builder()
                .feedEntity(feedEntity)
                .userEntity(UserEntity)
                .build();

        feedLikeRepository.save(feedLikeEntity);
    }

    @Override
    public void deleteFeedLikeByFeedId(Long feedId, Long userId) {
        UserEntity UserEntity = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다. ID: " + userId));

        //좋아요 기록이 있는지 확인
        boolean exists = feedLikeRepository.existsByFeedEntity_IdAndUserEntity_userId(feedId, userId);
        if(!exists) {
            throw  new IllegalArgumentException("이미 삭제된 피드 좋아요입니다.");
        }

        FeedLikeEntity feedLikeEntity = feedLikeRepository.findByFeedEntity_IdAndUserEntity_userId(feedId, userId);
        feedLikeRepository.delete(feedLikeEntity);
    }

    @Override
    public void createFeedCommentByFeedId(Long feedId, FeedCommentRequestDto feedCommentRequestDto) {
        //엔티티 조회
        FeedEntity feedEntity = feedRepository.findById(feedId)
                .orElseThrow(() -> new IllegalArgumentException("해당 피드를 찾을 수 없습니다. ID: " + feedId));
        UserEntity UserEntity = userRepository.findByUserId(feedCommentRequestDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다. ID: " + feedCommentRequestDto.getUserId()));

        //댓글 저장
        FeedCommentEntity feedCommentEntity = FeedCommentEntity.builder()
                .content(feedCommentRequestDto.getContent())
                .userEntity(UserEntity)
                .feedEntity(feedEntity)
                .build();
        feedCommentRepository.save(feedCommentEntity);
    }

    @Override
    public void deleteFeedCommentByFeedCommentId(Long feedCommentId) {
        FeedCommentEntity feedCommentEntity = feedCommentRepository.findById(feedCommentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 피드 댓글을 찾을 수 없습니다. ID: " + feedCommentId));

        feedCommentRepository.delete(feedCommentEntity);
    }

    @Override
    public void updateFeedCommentByFeedCommentId(Long feedCommentId, FeedCommentRequestDto feedCommentRequestDto) {
        //엔티티 조회
        FeedCommentEntity feedCommentEntity = feedCommentRepository.findById(feedCommentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 피드 댓글을 찾을 수 없습니다. ID: " + feedCommentId));

        //피드 댓글 작성자만 수정 가능
        if(!Objects.equals(feedCommentEntity.getUserEntity().getUserId(), feedCommentRequestDto.getUserId())){
            throw new RuntimeException("댓글을 작성한 사용자와 다릅니다.");
        }

        //피드 댓글 수정
        feedCommentEntity.setContent(feedCommentRequestDto.getContent());
        feedCommentRepository.save(feedCommentEntity);
    }

    @Override
    public List<FeedCommentResponseDto> readFeedCommentsByFeedId(Long feedId) {
        List<FeedCommentEntity> feedCommentEntities = feedCommentRepository.findAllByFeedEntity_IdOrderByFeedEntity_writeTime(feedId);

        return feedCommentEntities.stream()
                .map(FeedCommentResponseDto::fromEntity)
                .collect(Collectors.toList());
    }


    @Override
    public List<FeedResponseDto> readFeedsByUserId(Long searchUserId, Long logInUserId) {
        List<FeedResponseDto> feedResponseDtos = new ArrayList<>();

        List<FeedEntity> feedEntities = feedRepository.findAllByUserEntity_userIdOrderByWriteTime(searchUserId);

        for (FeedEntity feedEntity : feedEntities) {
            List<String> imageUrls = readImageUrlsByFeedId(feedEntity.getId());

            FeedResponseDto feedResponseDto = createFeedResponseDtoByBuilder(feedEntity, imageUrls);
            if(logInUserId != null) {
                feedResponseDto.setLike(feedLikeRepository.existsByFeedEntity_IdAndUserEntity_userId(feedResponseDto.getId(), logInUserId));
            }
            feedResponseDtos.add(feedResponseDto);
        }

        return feedResponseDtos;
    }

    @Override
    @Transactional
    public void deleteFeed(Long feedId, Long userId) {
        FeedEntity feedEntity = feedRepository.findById(feedId)
                .orElseThrow(() -> new IllegalArgumentException("해당 피드가 존재하지 않습니다."));

        // 피드 작성자와 요청한 사용자가 동일한지 확인
        if (!feedEntity.getUserEntity().getUserId().equals(userId)) {
            throw new AccessDeniedException("본인 피드만 삭제할 수 있습니다.");
        }

        // S3에 업로드된 파일 삭제 (피드에 저장된 이미지 URL 리스트 가져오기)
        List<FeedImageEntity> feedImageEntities = feedEntity.getImages(); // 가정: 이미지 URL을 저장하는 필드가 있음
        if (feedImageEntities!= null) {
            for (FeedImageEntity feedImageEntity : feedImageEntities) {
                s3Service.deleteFileFromS3(feedImageEntity.getImageUrl());
            }
        }

        //DB 삭제
        feedRepository.delete(feedEntity);
    }

    @Override
    @Transactional
    public void updateFeed(Long feedId, Long userId, FeedRequestDto feedRequestDto, List<MultipartFile> images) {
        FeedEntity feedEntity = feedRepository.findById(feedId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 피드입니다. ID: " + feedId));

        // 피드 작성자인지 확인
        if (!feedEntity.getUserEntity().getUserId().equals(userId)) {
            throw new AccessDeniedException("본인 피드만 수정할 수 있습니다.");
        }

        RecipeEntity recipe = (feedRequestDto.getRecipeId() != null) ?
                recipeRepository.findById(feedRequestDto.getRecipeId())
                        .orElseThrow(() -> new IllegalArgumentException("해당 레시피가 존재하지 않습니다."))
                : null;

        // 선택적 업데이트
        Optional.ofNullable(feedRequestDto.getFoodName()).ifPresent(feedEntity::setFoodName);
        Optional.ofNullable(feedRequestDto.getContent()).ifPresent(feedEntity::setContent);
        Optional.ofNullable(recipe).ifPresent(feedEntity::setRecipeEntity);

        // 기존 이미지 삭제
        List<FeedImageEntity> feedImageEntities = feedImageRepository.findByFeedEntity_Id(feedId);

        if (feedImageEntities != null && !feedImageEntities.isEmpty()) {
            for (FeedImageEntity feedImageEntity : feedImageEntities) {
                s3Service.deleteFileFromS3(feedImageEntity.getImageUrl());
            }

            feedImageRepository.deleteAll(feedImageEntities);
        }

        // 새로운 이미지 업로드
        if (images != null && !images.isEmpty()) {
            List<FeedImageEntity> newFeedImageEntities = new ArrayList<>();
            int sequence = 1;

            for (MultipartFile image : images) {
                if (image != null && !image.isEmpty()) {
                    String imageUrl = s3Service.uploadFile(image);
                    FeedImageEntity feedImageEntity = FeedImageEntity.builder()
                            .imageUrl(imageUrl)
                            .sequence(sequence++)
                            .feedEntity(feedEntity)
                            .build();

                    newFeedImageEntities.add(feedImageEntity);
                }
            }

            feedImageRepository.saveAll(newFeedImageEntities);
        }
    }

    @Override
    public CustomPageResponseDto<FeedSummaryResponseDto> readFeedsOrderByWriteTime(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FeedEntity> feedEntities = feedRepository.findAllOrderByWriteTime(pageable);

        Page<FeedSummaryResponseDto> feedDtos = feedEntities.map(feed -> FeedSummaryResponseDto.builder()
                .id(feed.getId())
                .image(feed.getImages().get(0).getImageUrl())
                .imageSize(feed.getImages().size())
                .userNickname(feed.getUserEntity().getNickname())
                .userImage(feed.getUserEntity().getImage())
                .build());

        return new CustomPageResponseDto<>(feedDtos);
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
                .userId(feedEntity.getUserEntity().getUserId())
                .username(feedEntity.getUserEntity().getNickname())
                .recipeId(feedEntity.getRecipeEntity() != null ? feedEntity.getRecipeEntity().getRecipeId() : null)
                .images(imageUrls)
                .build();
    }


}
