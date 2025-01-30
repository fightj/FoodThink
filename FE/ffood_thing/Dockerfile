# Node.js 이미지 사용 (프론트엔드 빌드를 위한 임시 이미지)
FROM node:16 AS build

# 작업 디렉토리 설정
WORKDIR /app

# 프로젝트 코드 복사
COPY ./FE/ffood_thing /app

# 의존성 설치
RUN npm install

# 빌드 실행 (dist 폴더 생성)
RUN npm run build

# 최종 Nginx 이미지
FROM nginx:latest

# 작업 디렉토리 생성
RUN mkdir /app

# dist 폴더 복사 (빌드된 결과물 복사)
COPY --from=build /app/dist /app/dist

# 기존 nginx 설정 제거
RUN rm /etc/nginx/conf.d/default.conf

# 새로운 nginx 설정 복사
COPY ./nginx.conf /etc/nginx/conf.d

# 80 포트 개방
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
