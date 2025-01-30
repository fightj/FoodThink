pipeline {
    agent any

    environment {
        DB_URL = credentials('DB_URL')
        DB_PASSWORD = credentials('DB_PWD')
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

                    # Docker 빌드 및 푸시
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
