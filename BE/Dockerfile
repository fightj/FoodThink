# Docker 이미지의 베이스 이미지를 설정
FROM openjdk:17-jdk

# ARG는 빌드 시점에 전달되는 변수들입니다.
ARG DB_URL
ARG DB_PASSWORD
ARG SPRING_JWT_SECRET
ARG KAKAO_CLIENT_ID
ARG KAKAO_CLIENT_SECRET
ARG KAKAO_REDIRECT_URL
ARG S3_BUCKET
ARG AWS_CREDENTIALS_ACCESS_KEY
ARG AWS_CREDENTIALS_SECRET_KEY

# 환경 변수로 ARG 값을 설정합니다.
ENV DB_URL=${DB_URL}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV SPRING_JWT_SECRET=${SPRING_JWT_SECRET}
ENV KAKAO_CLIENT_ID=${KAKAO_CLIENT_ID}
ENV KAKAO_CLIENT_SECRET=${KAKAO_CLIENT_SECRET}
ENV KAKAO_REDIRECT_URL=${KAKAO_REDIRECT_URL}
ENV S3_BUCKET=${S3_BUCKET}
ENV AWS_CREDENTIALS_ACCESS_KEY=${AWS_CREDENTIALS_ACCESS_KEY}
ENV AWS_CREDENTIALS_SECRET_KEY=${AWS_CREDENTIALS_SECRET_KEY}

# 작업 디렉토리 설정
WORKDIR /spring-boot

# 호스트 시스템의 target 디렉토리에 있는 JAR 파일을 컨테이너의 /spring-boot/ 디렉토리로 복사
COPY target/foodthink-0.0.1-SNAPSHOT.jar /spring-boot/app.jar

# application.properties 파일을 컨테이너로 복사
COPY application.properties /spring-boot/application.properties

# Spring Boot 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/spring-boot/app.jar"]
