pipeline {
    agent any

    environment {
        DB_URL = credentials('DB_URL')
        DB_PASSWORD = credentials('DB_PWD')
        DOCKER_IMAGE_NAME = 'yyb113/foodthink'
        DOCKER_CREDENTIALS_ID = credentials('docker-hub')
    }

    stages {

        stage('Check Maven') {
            steps {
                script {
                    sh 'echo $MAVEN_HOME'
                    sh 'mvn -v'
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                script {
                    sh '''
                    cd BE
                    mvn clean install
                    echo "spring.datasource.url=${DB_URL}" > application.properties
                    echo "spring.datasource.password=${DB_PASSWORD}" >> application.properties

                    docker build -t ${DOCKER_IMAGE_NAME}/my-backend:latest .
                    docker push ${DOCKER_IMAGE_NAME}/my-backend:latest
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
