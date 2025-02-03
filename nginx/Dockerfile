# Nginx 베이스 이미지 사용
FROM nginx:latest

# 기본 Nginx 설정 파일 제거
RUN rm /etc/nginx/conf.d/default.conf

# 빌드된 프론트엔드 파일을 /usr/share/nginx/html로 복사
# FE/ffood_thing 디렉토리 안에 있는 dist 폴더의 빌드 결과물을 복사
COPY ./FE/ffood_thing/dist /usr/share/nginx/html

# nginx.conf 파일을 컨테이너에 복사
COPY ./nginx/nginx.conf /etc/nginx/conf.d/

# 80 포트 개방
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
