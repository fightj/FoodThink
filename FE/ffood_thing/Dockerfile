# Node.js 기반 이미지로부터 빌드 환경을 설정
FROM node:22 AS build

# 작업 디렉토리 설정
# WORKDIR /app

# package.json 작업 디렉토리에 복사
# # COPY package.json ./
#
# # 의존성 설치 명령어 실행
# # RUN npm install
#
# # 현재 디렉토리의 모든 파일을 도커 컨테이너의 작업 디렉토리에 복사
# # COPY . .
#
# # 빌드 실행 (배포용 빌드 파일 생성)
# # RUN npm run build
#
# # 작업 디렉토리 설정
# WORKDIR /app
#
# # 의존성 설치
# COPY package*.json ./
# RUN npm install
#
# # 소스 코드 복사
# COPY . .
#
# # 애플리케이션 빌드
# RUN npm run build
#
# # Nginx를 사용하여 정적 파일 서빙
# FROM nginx:latest
#
# # 빌드된 프론트엔드 파일 복사
# COPY --from=build /app/dist /app/dist
#
# # Nginx가 80 포트를 열도록 설정
# EXPOSE 80

# nginx 이미지 사용
FROM nginx:latest

# root에 /app 폴더 생성
RUN mkdir /app

# work dir 고정
WORKDIR /app

# work dir에 dist 폴더 생성
RUN mkdir ./dist

# 현재 디렉토리에서 dist 폴더를 /app/dist로 복사
COPY ./dist ./dist

# SSL 인증서 복사
COPY ./ssl /etc/letsencrypt

# nginx의 default.conf 삭제
RUN rm /etc/nginx/conf.d/default.conf

# host pc의 nginx.conf를 아래 경로에 복사
COPY ./nginx.conf /etc/nginx/conf.d

# 80 포트 개방
EXPOSE 80
EXPOSE 443  # HTTPS 포트 추가

# container 실행 시 자동으로 실행할 command. nginx 시작함
CMD ["nginx", "-g", "daemon off;"]
