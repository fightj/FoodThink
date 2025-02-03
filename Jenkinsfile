import java.awt.AWTKeyStroke

pipeline {
    agent any

    environment {
        DB_URL = credentials('DB_URL')
        DB_PASSWORD = credentials('DB_PWD')
        SPRING_JWT_SECRET = credentials('SPRING_JWT_SECRET')
        KAKAO_CLIENT_ID = credentials('KAKAO_CLIENT_ID')
        KAKAO_CLIENT_SECRET = credentials('KAKAO_CLIENT_SECRET')
        KAKAO_REDIRECT_URL = credentials('KAKAO_REDIRECT_URL')
        S3_BUCKET = credentials('S3_BUCKET')
        AWS_CREDENTIALS_ACCESS_KEY = credentials('AWS_CREDENTIALS_ACCESS_KEY')
        AWS_CREDENTIALS_SECRET_KEY = credentials('AWS_CREDENTIALS_SECRET_KEY')
        DOCKER_IMAGE_NAME = 'yyb113'
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

        stage('Build & Push Backend') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                        cd BE
                        mvn clean install
                        echo "spring.datasource.url=${DB_URL}" > application.properties
                        echo "spring.datasource.password=${DB_PASSWORD}" >> application.properties
                        echo "spring.jwt.secret=${SPRING_JWT_SECRET}" >> application.properties  # SPRING_JWT_SECRET 추가
                        echo "cloud.aws.credentials.access-key=${AWS_CREDENTIALS_ACCESS_KEY}"  >> application.properties
                        echo "cloud.aws.credentials.secret-key=${AWS_CREDENTIALS_SECRET_KEY}"  >> application.properties
                        echo "spring.security.oauth2.client.registration.kakao.client-id=${KAKAO_CLIENT_ID}"  >> application.properties
                        echo "spring.security.oauth2.client.registration.kakao.client-secret=${KAKAO_CLIENT_SECRET}"  >> application.properties
                        echo "spring.security.oauth2.client.registration.kakao.redirect-uri=${KAKAO_REDIRECT_URL}"  >> application.properties
                        echo "cloud.aws.s3.bucket=${S3_BUCKET}"  >> application.properties

                        # application.properties 내용 확인
                        cat application.properties  # 파일 내용 출력

                        # Docker 로그인
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

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
                        nodejs('node') {  // NodeJS 환경을 사용
                            sh '''
                            cd FE/ffood_thing  # Frontend 디렉토리로 이동
                            npm install
                            npm run build

                            # Docker 로그인
                            docker login -u $DOCKER_USER -p $DOCKER_PASS

                            # Frontend Docker 이미지 빌드 및 푸시
                            docker build -t ${DOCKER_IMAGE_NAME}/my-frontend:latest .
                            docker push ${DOCKER_IMAGE_NAME}/my-frontend:latest
                            '''
                        }
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
                    docker run -d --name my-backend-container -p 8085:8080 ${DOCKER_IMAGE_NAME}/my-backend:latest  # 새로운 Backend 컨테이너 실행

                    # 백엔드 컨테이너 로그 확인
                    docker logs my-backend-container
                    
                    docker stop my-frontend-container || true  # 기존 Frontend 컨테이너 종료
                    docker rm my-frontend-container || true  # 기존 Frontend 컨테이너 제거
                    docker run -d --name my-frontend-container -p 80:80 ${DOCKER_IMAGE_NAME}/my-frontend:latest  # 새로운 Frontend 컨테이너 실행
                    
                    '''
                }
            }
        }
    }
}
