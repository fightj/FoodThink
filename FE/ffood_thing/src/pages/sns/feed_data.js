// data.js
import unsplashPhoto1 from "../../assets/images/unsplash-photo-1.jpg"
import unsplashPhoto2 from "../../assets/images/unsplash-photo-2.jpg"
import unsplashPhoto3 from "../../assets/images/unsplash-photo-3.jpg"

const Feed = [
  {
    feed_id: 1,
    food_name: "김치찌개",
    content: "이거 진짜 존맛탱이네",
    write_time: "2025-01-28 14:30:00",
    user_id: 1,
    user_recipe_id: 1,
    crawling_recipe_id: 1,
  },
  {
    feed_id: 2,
    food_name: "된장찌개",
    content: "처음 해봤는데 진짜 맛있당. !!!!!@!@",
    write_time: "2025-01-28 14:30:00",
    user_id: 2,
    user_recipe_id: 2,
    crawling_recipe_id: 2,
  },
]

const FeedImages = [
  {
    image_id: 1,
    image_url: unsplashPhoto1,
    order: 1,
    feed_id: 1,
  },
  {
    image_id: 2,
    image_url: unsplashPhoto2,
    order: 2,
    feed_id: 1,
  },
  {
    image_id: 3,
    image_url: unsplashPhoto3,
    order: 3,
    feed_id: 1,
  },
  {
    image_id: 4,
    image_url: unsplashPhoto1,
    order: 4,
    feed_id: 1,
  },
  {
    image_id: 5,
    image_url: unsplashPhoto3,
    order: 1,
    feed_id: 2,
  },
]

const Users = [
  {
    user_id: 1,
    nickname: "칼있나",
    image: "/images/karina.jpg",
  },
  {
    user_id: 2,
    nickname: "겨울",
    image: "/images/winter.jpg", // 프로필 이미지 추가
  }
]

const FeedLike = [
  {
    like_id: 1,
    feed_id: 1,
    user_id: 1,
    write_time: "2025-01-28 14:30:00",
  }
]

const FeedComment = [
  {
    comment_id: 1,
    user_id: 2,
    feed_id: 1,
    write_time: "2025-01-28 14:30:00",
    content: "우와 정말 잘 만드셨네요!!"
  },
  {
    comment_id: 2,
    user_id: 2,
    feed_id: 1,
    write_time: "2025-01-28 15:30:00",
    content: "어떻게 만들었담??"
  }
]
export { Feed, FeedImages, Users, FeedLike, FeedComment }
