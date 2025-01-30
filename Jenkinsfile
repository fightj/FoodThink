pipeline {
    agent any

    environment {
        DB_URL = credentials('DB_URL')  # 데이터베이스 URL
        DB_PASSWORD = credentials('DB_PWD')  # 데이터베이스 비밀번호
        DOCKER_IMAGE_NAME = 'yyb113/foodthink'  # Docker 이미지 이름
        DOCKER_CREDENTIALS_ID = credentials('docker-hub')  # Docker Hub 자격 증명
    }

    stages {

        stage('Check Maven') {
            steps {
                script {
                    # Maven 경로 확인
                    sh 'echo $MAVEN_HOME'
                    # Maven 버전 확인
                    sh 'mvn -v'
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                script {
                    sh '''
                    cd BE  # Backend 디렉토리로 이동
                    mvn clean install  # Maven 빌드
                    echo "spring.datasource.url=${DB_URL}" > application.properties  # DB URL 설정
                    echo "spring.datasource.password=${DB_PASSWORD}" >> application.properties  # DB 비밀번호 설정

                    # Docker 이미지 빌드 및 푸시
                    docker build -t ${DOCKER_IMAGE_NAME}/my-backend:latest .  # Backend Docker 이미지 빌드
                    docker push ${DOCKER_IMAGE_NAME}/my-backend:latest  # Docker Hub에 푸시
                    '''
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                script {
                    sh '''
                    cd FE/ffood_thing  # Frontend 디렉토리로 이동
                    docker build -t ${DOCKER_IMAGE_NAME}/my-frontend:latest .  # Frontend Docker 이미지 빌드
                    docker push ${DOCKER_IMAGE_NAME}/my-frontend:latest  # Docker Hub에 푸시
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh '''
                    docker stop my-backend-container || true  # 기존 Backend 컨테이너 종료
                    docker rm my-backend-container || true  # 기존 Backend 컨테이너 제거
                    docker run -d --name my-backend-container -p 8080:8080 ${DOCKER_IMAGE_NAME}/my-backend:latest  # 새로운 Backend 컨테이너 실행

                    docker stop my-frontend-container || true  # 기존 Frontend 컨테이너 종료
                    docker rm my-frontend-container || true  # 기존 Frontend 컨테이너 제거
                    docker run -d --name my-frontend-container -p 80:80 ${DOCKER_IMAGE_NAME}/my-frontend:latest  # 새로운 Frontend 컨테이너 실행
                    '''
                }
            }
        }
    }
}
