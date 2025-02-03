# Node.js 기반 이미지로부터 빌드 환경을 설정
FROM node:22 AS build

# 작업 디렉토리 설정
WORKDIR /app

# 프론트엔드 프로젝트 파일들을 복사
COPY ./package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY ./src/ ./

COPY ./index.html ./

# 빌드 실행
RUN npm run build
