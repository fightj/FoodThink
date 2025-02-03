# Nginx 베이스 이미지 사용
FROM nginx:latest

# /app 디렉토리 생성
RUN mkdir /app

# 작업 디렉토리 설정
WORKDIR /app

# /app/dist 디렉토리 생성
RUN mkdir ./dist

# ffood_thing 내 dist 폴더를 Nginx의 /app/dist로 복사
COPY ./FE/ffood_thing/dist/ ./dist/

# 기존 Nginx 기본 설정 파일 제거
RUN rm /etc/nginx/conf.d/default.conf

# nginx.conf 파일을 컨테이너에 복사
COPY ./nginx/nginx.conf /etc/nginx/conf.d/

# 80 포트 개방
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
