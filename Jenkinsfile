pipeline {
    agent any

    environment {
        DB_URL = credentials('DB_URL')
        DB_PASSWORD = credentials('DB_PWD')
        DOCKER_IMAGE_NAME = 'yyb113/foodthink'
        DOCKER_CREDENTIALS_ID = 'docker-hub'
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

        stage('Check Docker Login in Jenkins') {
            steps {
                script {
                    // Docker 로그인 상태 확인
                    sh '''
                    docker info | grep "Username" || echo "Not logged in"
                    '''
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                        cd BE
                        mvn clean install
                        echo "spring.datasource.url=${DB_URL}" > application.properties
                        echo "spring.datasource.password=${DB_PASSWORD}" >> application.properties

                        # Docker 로그인
                        docker login -u $DOCKER_USER -p $DOCKER_PASS

                        # 로그인 성공 후 확인
                        docker info | grep "Username"

                        # Docker 빌드 및 푸시
                        docker build -t ${DOCKER_IMAGE_NAME}/my-backend:latest .
                        docker push ${DOCKER_IMAGE_NAME}/my-backend:latest
                        '''
                    }
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                        cd FE/ffood_thing  # Frontend 디렉토리로 이동
                        docker login -u $DOCKER_USER -p $DOCKER_PASS  # Docker Hub 로그인

                        # 로그인 성공 후 확인
                        docker info | grep "Username"

                        # Frontend Docker 이미지 빌드 및 푸시
                        docker build -t ${DOCKER_IMAGE_NAME}/my-frontend:latest .
                        docker push ${DOCKER_IMAGE_NAME}/my-frontend:latest  # Docker Hub에 푸시
                        '''
                    }
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
