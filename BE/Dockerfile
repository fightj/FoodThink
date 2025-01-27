# Docker 이미지 생성할 때 기본으로 사용할 베이스 이미지를 설정하는 명령어
FROM openjdk:17-jdk

# Docker 컨테이너 내에서 작업 디렉토리를 /~~로 설정
#이후의 모든 명령어는 해당 디렉토리에서 실행됨
WORKDIR /spring-boot

#호스트 시스템의 build/libs/ 경로에 있는 *SNAPSHOT.jar 파일을 Docker 컨테이너의 /spring-boot/ 디렉토리에 app.jar 파일로 복사
COPY target/foodthink-0.0.1-SNAPSHOT.jar /app/app.jar

# Docker 컨테이너가 시작되면 java -jar /spring-boot/app.jar 명령어가 실행
# Spring boot 애플리케이션을 실행시킨다.
ENTRYPOINT ["java", "-jar", "/spring-boot/app.jar"]