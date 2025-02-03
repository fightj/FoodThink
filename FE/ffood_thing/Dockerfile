# Node.js 기반 이미지로부터 빌드 환경을 설정
FROM node:22 AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json 작업 디렉토리에 복사
COPY package.json .

# 의존성 설치 명령어 실행
RUN npm install

# 현재 디렉토리의 모든 파일을 도커 컨테이너의 작업 디렉토리에 복사
COPY . .

# 빌드 실행 (배포용 빌드 파일 생성)
RUN npm run build
