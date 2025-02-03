# Node.js 기반 이미지로부터 빌드 환경을 설정
FROM node:22 AS build

# 작업 디렉토리 설정
WORKDIR /app

# 프론트엔드 프로젝트 파일들을 복사
COPY ./package*.json ./  # package.json, package-lock.json 복사

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY ./src/ ./  # ./src 디렉토리 복사

# 빌드 실행
RUN npm run build

# Nginx를 위한 프론트엔드 빌드 결과물을 복사할 새로운 이미지
FROM nginx:latest

# /app 디렉토리 생성
RUN mkdir /app

# 작업 디렉토리 설정
WORKDIR /app

# /app/dist 디렉토리 생성
RUN mkdir ./dist

# 1단계에서 빌드된 프론트엔드 결과물을 Nginx의 /app/dist로 복사
COPY --from=build /app/dist ./dist

# 기존 Nginx 기본 설정 파일 제거
RUN rm /etc/nginx/conf.d/default.conf

# host PC의 nginx.conf 파일을 컨테이너에 복사
COPY ./nginx.conf /etc/nginx/conf.d

# 80 포트 개방
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
