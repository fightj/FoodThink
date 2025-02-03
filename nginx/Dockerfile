# Nginx 베이스 이미지 사용
FROM nginx:latest

# 기본 Nginx 설정 파일 제거
RUN rm /etc/nginx/conf.d/default.conf

## SSL 인증서와 키를 컨테이너에 복사
#COPY ./nginx/ssl/server.crt /etc/ssl/certs/
#COPY ./nginx/ssl/server.key /etc/ssl/private/

# 프론트엔드 빌드 결과물을 Nginx HTML 폴더로 복사
COPY ./FE/ffood_thing/dist /usr/share/nginx/html

# nginx.conf 파일을 컨테이너에 복사
COPY ./nginx.conf /etc/nginx/conf.d/

# 443 포트 개방 (HTTPS)
EXPOSE 443

# 80 포트 개방 (HTTP 리디렉션을 위해)
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]

