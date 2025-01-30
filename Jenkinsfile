pipeline {
    agent any

    environment {
        DB_URL = credentials('DB_URL')  // DB URL (Jenkins Credentials에 저장된 DB_URL 참조)
        DB_PASSWORD = credentials('DB_PWD')  // DB Password (Jenkins Credentials에 저장된 DB_PASSWORD 참조)
    }

    stages {

            stage('Check Maven') {
                steps {
                    script {
                        sh 'echo $MAVEN_HOME'
                        sh 'mvn -v'  // Maven 버전 확인
                    }
                }
            }

        stage('Build & Push Backend') {
            steps {
                script {
                    // 백엔드 애플리케이션의 Maven 빌드
                    sh '''
                    cd BE
                    mvn clean install
                    echo "spring.datasource.url=${DB_URL}" > application.properties
                    echo "spring.datasource.password=${DB_PASSWORD}" >> application.properties

                    // Docker 빌드 및 푸시
                    docker build -t my-backend:latest .
                    docker tag my-backend:latest my-docker-repo/my-backend:latest
                    docker push my-docker-repo/my-backend:latest
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
                    docker rm my-backend-container || true
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
