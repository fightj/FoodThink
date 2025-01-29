pipeline {
    agent any

    environment {
        DB_URL = credentials('DB_URL')  // DB URL (Jenkins Credentials에 저장된 DB_URL 참조)
        DB_PASSWORD = credentials('DB_PWD')  // DB Password (Jenkins Credentials에 저장된 DB_PASSWORD 참조)
    }

    stages {}

        stage('Build & Push Backend') {
            steps {
                script {
                    // 백엔드 빌드 & 푸시
                    sh '''
                    cd BE
                    docker build -t my-backend:latest .  # Docker 빌드
                    docker tag my-backend:latest my-docker-repo/my-backend:latest
                    docker push my-docker-repo/my-backend:latest

                    # application.properties 파일 생성
                    echo 'spring.datasource.url=${DB_URL}' > application.properties
                    echo 'spring.datasource.password=${DB_PASSWORD}' >> application.properties

                    # 생성된 application.properties를 Dockerfile에 설정된 위치로 복사
                    docker build --build-arg APP_PROPERTIES_PATH=./application.properties -t my-backend:latest .
                    '''
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                script {
                    // 프론트엔드 빌드 & 푸시
                    sh '''
                    cd FE/ffood_thing
                    docker build -t my-frontend:latest .
                    docker tag my-frontend:latest my-docker-repo/my-frontend:latest
                    docker push my-docker-repo/my-frontend:latest
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Docker 컨테이너 실행 (백엔드와 프론트엔드)
                    sh '''
                    docker stop my-backend-container || true
                    docker run -d --name my-backend-container my-docker-repo/my-backend:latest
                    docker stop my-frontend-container || true
                    docker rm my-frontend-container || true
                    docker run -d --name my-frontend-container my-docker-repo/my-frontend:latest
                    '''
                }
            }
        }
    }
}
