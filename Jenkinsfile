//// pipeline {
////     agent any
////
////     environment {
////         DB_URL = credentials('DB_URL')
////         DB_PASSWORD = credentials('DB_PWD')
////         SPRING_JWT_SECRET = credentials('SPRING_JWT_SECRET')
////         KAKAO_CLIENT_ID = credentials('KAKAO_CLIENT_ID')
////         KAKAO_CLIENT_SECRET = credentials('KAKAO_CLIENT_SECRET')
////         KAKAO_REDIRECT_URL = credentials('KAKAO_REDIRECT_URL')
////         S3_BUCKET = credentials('S3_BUCKET')
////         AWS_CREDENTIALS_ACCESS_KEY = credentials('AWS_CREDENTIALS_ACCESS_KEY')
////         AWS_CREDENTIALS_SECRET_KEY = credentials('AWS_CREDENTIALS_SECRET_KEY')
////         GPT_API_KEY = credentials('GPT_API_KEY')
////         API_SERVICE_KEY = credentials('API_SERVICE_KEY')
////         DOCKER_IMAGE_NAME = 'yyb113'
////         DOCKER_CREDENTIALS_ID = 'docker-hub'
////     }
////
////     stages {
////         stage('Build & Push Backend') {
////             steps {
////                 script {
////                     withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
////                         sh '''
////                         cd BE
////                         mvn clean install
////                         echo "spring.datasource.url=${DB_URL}" > application.properties
////                         echo "spring.datasource.password=${DB_PASSWORD}" >> application.properties
////                         echo "spring.jwt.secret=${SPRING_JWT_SECRET}" >> application.properties
////                         echo "cloud.aws.credentials.access-key=${AWS_CREDENTIALS_ACCESS_KEY}"  >> application.properties
////                         echo "cloud.aws.credentials.secret-key=${AWS_CREDENTIALS_SECRET_KEY}"  >> application.properties
////                         echo "spring.security.oauth2.client.registration.kakao.client-id=${KAKAO_CLIENT_ID}"  >> application.properties
////                         echo "spring.security.oauth2.client.registration.kakao.client-secret=${KAKAO_CLIENT_SECRET}"  >> application.properties
////                         echo "spring.security.oauth2.client.registration.kakao.redirect-uri=${KAKAO_REDIRECT_URL}"  >> application.properties
////                         echo "gpt.api.key=${GPT_API_KEY}" >> application.properties
////                         echo "api.service-key=${API_SERVICE_KEY}" >> application.properties
////                         echo "cloud.aws.s3.bucket=${S3_BUCKET}"  >> application.properties
////
////                         # application.properties 내용 확인
////                         cat application.properties  # 파일 내용 출력
////
////                         # Docker 로그인
////                         echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
////
////                         # 로그인 성공 후 확인
////                         docker info | grep "Username"
////
////                         # Docker 빌드 및 푸시
////                         docker build -t ${DOCKER_IMAGE_NAME}/my-backend:latest .
////                         docker push ${DOCKER_IMAGE_NAME}/my-backend:latest
////                         '''
////                     }
////                 }
////             }
////         }
////
////         stage('Build & Push Frontend') {
////             steps {
////                 script {
////                     withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
////                         nodejs('node') {
////                             sh '''
////                             cd FE/ffood_thing
////                             npm install
////                             npm run build
////
////                             # Docker 로그인
////                             docker login -u $DOCKER_USER -p $DOCKER_PASS
////
////                             # Frontend Docker 이미지 빌드 및 푸시
////                             docker build -t ${DOCKER_IMAGE_NAME}/my-frontend:latest .
////                             docker push ${DOCKER_IMAGE_NAME}/my-frontend:latest
////                             '''
////                         }
////                     }
////                 }
////             }
////         }
////
////         stage('Deploy with Docker Compose') {
////             steps {
////                 script {
////                     // docker-compose를 이용하여 모든 서비스 실행
////                     sh 'docker-compose up -d --build'
////                 }
////             }
////         }
////     }
//// }
//
//pipeline {
//    agent any
//
//    environment {
////         NODE_HOME = tool name: 'NodeJS 22.13.0', type: 'NodeJS'
//
//        // Docker Hub 로그인 정보
//        DOCKER_HUB_CREDENTIALS = credentials('docker-hub')  // Jenkins에 저장된 Docker Hub 로그인 정보
//        DOCKER_IMAGE_NAME = 'yyb113'
//        // .env 파일에 저장된 환경 변수들 (추가할 경우)
//        DB_URL = credentials('DB_URL')
//        DB_PASSWORD = credentials('DB_PWD')
//        SPRING_JWT_SECRET = credentials('SPRING_JWT_SECRET')
//        KAKAO_CLIENT_ID = credentials('KAKAO_CLIENT_ID')
//        KAKAO_CLIENT_SECRET = credentials('KAKAO_CLIENT_SECRET')
//        KAKAO_REDIRECT_URL = credentials('KAKAO_REDIRECT_URL')
//        S3_BUCKET = credentials('S3_BUCKET')
//        AWS_CREDENTIALS_ACCESS_KEY = credentials('AWS_CREDENTIALS_ACCESS_KEY')
//        AWS_CREDENTIALS_SECRET_KEY = credentials('AWS_CREDENTIALS_SECRET_KEY')
//        GPT_API_KEY = credentials('GPT_API_KEY')
//        API_SERVICE_KEY = credentials('API_SERVICE_KEY')
//    }
//
//    stages {
//        stage('Checkout') {
//            steps {
//                script {
//                    // Git 저장소에서 코드 체크아웃
//                    checkout scm
//                }
//            }
//        }
//
//        stage('Build') {
//             steps {
//                  script {
//                      dir('BE') {  // BE 디렉토리로 이동
//                          sh 'mvn clean install -f pom.xml'  // BE 디렉토리에서 Maven 빌드
//                      }
//                  }
//             }
//        }
//
//        stage('Frontend Build') {
//             steps {
//                    script {
//                        // 프론트엔드 빌드: npm install 및 npm run build
//                        dir('FE/ffood_thing') {  // 프론트엔드 디렉토리로 이동
//                            nodejs('NodeJS 22.13.0'){
//                                sh 'npm install'  // 의존성 설치
//                                 sh 'npm run build'  // 빌드 실행
//                            }
//                        }
//                    }
//             }
//        }
//
//        stage('Build Backend') {
//            steps {
//                script {
//                    // Backend Docker 이미지 빌드
//                    sh 'docker build -f BE/Dockerfile -t my-backend-container ./BE'
//                }
//            }
//        }
//
//        stage('Build Frontend') {
//            steps {
//                script {
//                    // Frontend Docker 이미지 빌드
//                    sh 'docker build -f FE/ffood_thing/Dockerfile -t my-frontend-container ./FE/ffood_thing'
//                }
//            }
//        }
//
//        stage('Build Nginx') {
//            steps {
//                script {
//                    // Nginx Docker 이미지 빌드
////                     sh 'docker pull ${DOCKER_IMAGE_NAME}/my-nginx-container'
//                    sh 'docker build -f nginx/Dockerfile -t my-nginx-container .'
//                }
//            }
//        }
//
//        stage('Push Docker Images') {
//            steps {
//                script {
//                    // Docker Hub에 이미지를 푸시
//                    withCredentials([usernamePassword(credentialsId: 'docker-hub', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
//                        sh """
//                            docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
//                            docker tag my-backend-container ${DOCKER_IMAGE_NAME}/my-backend-container
//                            docker tag my-frontend-container ${DOCKER_IMAGE_NAME}/my-frontend-container
//                            docker tag my-nginx-container ${DOCKER_IMAGE_NAME}/my-nginx-container
//
//                            docker push ${DOCKER_IMAGE_NAME}/my-backend-container
//                            docker push ${DOCKER_IMAGE_NAME}/my-frontend-container
//                            docker push ${DOCKER_IMAGE_NAME}/my-nginx-container
//                        """
//                    }
//                }
//            }
//        }
//
//         stage('Stop and Remove Containers') {
//              steps {
//                   script {
//                        // 기존 컨테이너가 있으면 강제로 종료하고 제거
//                        sh 'docker rm -f my-backend-container my-frontend-container  my-nginx-container  || true'
//                   }
//              }
//         }
//
//        stage('Deploy') {
//            steps {
//                script {
//                    // docker-compose로 배포
////                    sh 'docker-compose build --pull --no-cache'
//                    sh 'docker-compose -f docker-compose.yml down'
//                    sh 'docker-compose -f docker-compose.yml up -d --build'
//                    sh 'docker-compose -f docker-compose.yml logs nginx'
//
//                }
//            }
//        }
//    }
//
////     post {
////         success {
////             echo 'Deployment was successful!'
////         }
////
////         failure {
////             echo 'Deployment failed.'
////         }
////
////         always {
////             // 'node' 블록 내에서 cleanWs 호출
////             node('master') {  // 'any'는 사용 가능한 노드에서 실행되도록 지정
////                 cleanWs()  // 워크스페이스 정리
////             }
////         }
////     }
//}

pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub')
        DOCKER_IMAGE_NAME = 'yyb113'
        DB_URL = credentials('DB_URL')
        DB_PASSWORD = credentials('DB_PWD')
        SPRING_JWT_SECRET = credentials('SPRING_JWT_SECRET')
        KAKAO_CLIENT_ID = credentials('KAKAO_CLIENT_ID')
        KAKAO_CLIENT_SECRET = credentials('KAKAO_CLIENT_SECRET')
        KAKAO_REDIRECT_URL = credentials('KAKAO_REDIRECT_URL')
        S3_BUCKET = credentials('S3_BUCKET')
        AWS_CREDENTIALS_ACCESS_KEY = credentials('AWS_CREDENTIALS_ACCESS_KEY')
        AWS_CREDENTIALS_SECRET_KEY = credentials('AWS_CREDENTIALS_SECRET_KEY')
        GPT_API_KEY = credentials('GPT_API_KEY')
        API_SERVICE_KEY = credentials('API_SERVICE_KEY')
        DB_USERNAME = credentials('DB_USERNAME')
        WEATHER_API_KEY = credentials('WEATHER_API_KEY')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scm
                }
            }
        }

        stage('Backend Build') {
            steps {
                script {
                    dir('BE') {
                        sh 'mvn clean install -f pom.xml'
                    }
                }
            }
        }

        stage('Frontend Build') {
            steps {
                script {
                    dir('FE/ffood_thing') {
                        nodejs('NodeJS 22.13.0'){
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh 'docker build -f BE/Dockerfile -t my-backend-container ./BE'
                    sh 'docker build -f FE/ffood_thing/Dockerfile -t my-frontend-container ./FE/ffood_thing'
//                    sh 'docker build -f nginx/Dockerfile -t my-nginx-container ./nginx'
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh """
                            docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
                            docker tag my-backend-container ${DOCKER_IMAGE_NAME}/my-backend-container
                            docker tag my-frontend-container ${DOCKER_IMAGE_NAME}/my-frontend-container
                            docker push ${DOCKER_IMAGE_NAME}/my-backend-container
                            docker push ${DOCKER_IMAGE_NAME}/my-frontend-container

                            
                            docker rmi ${DOCKER_IMAGE_NAME}/my-backend-container
                            docker rmi ${DOCKER_IMAGE_NAME}/my-frontend-container
                            docker rmi my-backend-container
                            docker rmi my-frontend-container
                            """
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh 'docker-compose -f docker-compose.yml down'
                    sh 'docker-compose -f docker-compose.yml up -d --build'
//                    sh 'docker-compose -f docker-compose.yml logs nginx'
                }
            }
        }

    }
    post {
        failure {
            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend(color: 'danger',
                        message: "빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)",
                        endpoint: 'https://meeting.ssafy.com/hooks/5aaurax7x7yxdcyt6ict6iiurr',
                        channel: 'foodthinkserverbuild'
                )
            }
        }
        success {
            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend(color: 'good',
                        message: "빌드 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)",
                        endpoint: 'https://meeting.ssafy.com/hooks/5aaurax7x7yxdcyt6ict6iiurr',
                        channel: 'foodthinkserverbuild'
                )
            }
        }
        always {
            cleanWs()
        }
    }
}
