pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
            }
        }

        stage('Build & Push Backend') {
            steps {
                script {
                    sh '''
                    cd BE
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
