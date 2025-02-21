# AI 추천 및 음성 인식과 제스처 기반 레시피 서비스 푸띵(FoodThink)

![alt text](FE/ffood_thing/public/images/메인로고.png)

- 배포 URL: https://i12e107.p.ssafy.io/

## 프로젝트 소개

- 푸띵은 1인 가구의 증가와 요리에 미숙한 사람들을 위한 간단 레시피 참고 프로젝트입니다.
- 개인의 레시피를 등록할 수 있고, 피드를 작성하여 이용자들과 소통할 수 있습니다.
- 메뉴를 고를 때 고민된다면 AI의 간단한 질문에 답변하여 상황에 맞는 메뉴를 추천받을 수 있습니다.
- 기피 및 선호 식재료와 이외 다양한 카테고리의 선택으로 원하는 요리를 추천 받고 선택할 수 있습니다.
- 요리 도중, 음성과 손동작으로 요리 과정을 제어하며 위생 관리를 향상할 수 있습니다.

## 1. 개발 환경

- Infra : AWS EC2 / Docker / Jenkins / Nginx

- BackEnd : Spring Boot / JPA / Spring Security (JWT) / Spring GPT API / TTS / OpenAI Whisper / Dialogflow

- FrontEnd : React / React Native / 텐서플로우 자바스크립트

- 협업 및 기타 툴 : Jira / Git Lab / Notion / Postman / ERD Cloud

- 디자인: Figma

## 2. 브랜치 전략

- Git-flow 전략을 기반으로 master, develop 브랜치와 feature, style, hotfix 보조 브랜치를 운용했습니다.

  - master 브랜치는 배포 단계에서만 사용하는 브랜치입니다.

  - develop 브랜치는 개발 단계에서 git-flow의 master 역할을 하는 브랜치입니다.

  - feature, style, hotfix 브랜치는 기능 단위로 독립적인 개발 환경을 위하여 사용하고 merge 후 각 브랜치를 삭제해주었습니다.

## 3. 프로젝트 구조

```
├── README.md
├── exec
├── Jenkinsfile
├── docker-compose.yml
├── package-lock.json
└── BE
    └── src/main
        ├── java/com/ssafy/foodthink
            ├── elasticsearch
            ├── feed
            ├── foodRecommend
            ├── global
            ├── myOwnRecipe
            ├── recipeBookmark
            ├── recipes
            ├── speech
            ├── subscribe
            ├── todayRecommend
            ├── user
            ├── webCrawling
            └── FoodThinkApplication.java
        └── resources
            └── application.properties
        ├── Dockerfile
        └── pom.xml
├── FE
    └── public
    └── src
        ├── components
        ├── contexts
        ├── data
        ├── pages
        ├── styles
        ├── App.css
        ├── App.jsx
        ├── index.css
        └── main.jsx
    ├── Dockerfile
    ├── index.html
    ├── nginx.conf
    ├── package-lock.json
    ├── package.json
    └── vite/config.js
```

## 4. 역할 분담

### 강혜경

- 기능
  - 마이 페이지, AI 추천, 오늘 뭐 먹지, 선호도
- UI
  - 레시피 메인, 레시피 디테일, AI 추천, 오늘 뭐 먹지, 마이페이지, 레시피 작성, 선호도, 앱 튜토리얼
  - 반응형 웹

### 박민제

- 기능
  - 레시피 메인, 레시피 검색 결과, 레시피 카테고리 필터 및 최신순/북마크순/조회순 필터링, 요리 과정(제스쳐), 레시피 수정, 북마크,
- UI
  - 요리 과정 전반

### 정승국

- 기능
  - SNS, 요리 과정(음성인식), 제스쳐 및 음성인식 최적화
- UI
  - 홈 화면, SNS 메인, SNS 디테일, SNS 작성 / 수정 / 삭제, 레시피 디테일, 조리 과정 process

### 최정원

- 기능
  - 웹 크롤링, 요리과정(음성인식), 레시피 CRUD
- UI
  - SNS 피드 메인, SNS 피드 작성/수정
- 반응형

### 윤유빈

- 기능
  - 인프라 구축, CI/CD
  - 엘라스틱서치, 레시피/SNS 피드 검색 성능 향상, SNS 피드 CRUD, 구독독
- UI
  - 사이드바, 버튼, 메인페이지
- UCC 제작

### 김태영

- 기능
  - AI 요리 추천, 소셜로그인, 오늘 뭐 먹지, 회원정보관리 CRUD, 레시피 북마크 CRUD, 레시피 조회수 CR
- UI
  - 레시피 작성/수정, 메인페이지, 오늘 뭐 먹지, 전체 페이지 폰트

## 5. 개발 기간 및 작업 관리

### 개발 기간

- 전체 개발 기간: 2025-01-13 ~ 2025-02-21
- 프로젝트 기획: 2025-01-13 ~ 2025-01-19
- 기능 구현: 2025-01-20 ~ 2025-02-07
- UI 구현: 2025-02-07 ~ 2025-02-14
- 테스팅 및 리펙토링: 2025-02-15 ~ 2025-02-21

### 작업 관리

- Jira, GitLab, Notion을 사용하여 진행 상황을 공유했습니다.
- 일간 스크럼 / 주간 스프린트를 진행하며 작업 순서와 방향성에 대한 고민을 나누고 Notion에 회의 내용을 기록했습니다.

## 6. 페이지별 기능

[홈 화면]

![홈_화면](/uploads/e331b18ef76215c7d7c8b7e205df1eb1/홈_화면.png)

[튜토리얼]

[레시피]

![카테고리_선택](/uploads/36bffbd2798246ec0ff3e1b37e0967b1/카테고리_선택.gif)

[검색 페이지]

![엘라스틱_서치](/uploads/b12229ea0ec6decfaa5b3f32a9076bc7/엘라스틱_서치.gif)

[요리 과정]

![음성인식_타이머_설정_](/uploads/673324d48a4c7ac54e313549a4a0f6e6/음성인식_타이머_설정_.gif)

[AI 추천]

![AI_요리추천](/uploads/3089500b1b7a4b7bde1178d5887eef92/AI_요리추천.gif)

[오늘 뭐 먹지]

![오늘_뭐_먹지](/uploads/9ae98e72087e777383891db7767a8c6e/오늘_뭐_먹지.gif)

[SNS]

![SNS_예시_엘라스틱_서치_포함_](/uploads/a4edded6c207cf045b1db131070b2fd0/SNS_예시_엘라스틱_서치_포함_.gif)

[마이 페이지]

![마이_페이지](/uploads/d918435d112da02bfd7f3957b3828985/마이_페이지.png)

## 7. 개선 목표

- 제스쳐 및 음성인식 기능 최적화

- 정확도 향상을 위한 데이터 확장

-
