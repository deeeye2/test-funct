pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "deeeye2/k8s-manifest-generator"
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/deeeye2/test-funct.git'
            }
        }

        stage('Build') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${env.BUILD_NUMBER}")
                }
            }
        }

        stage('Push') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker_hub_login') {
                        docker.image("${DOCKER_IMAGE}:${env.BUILD_NUMBER}").push()
                        docker.image("${DOCKER_IMAGE}:latest").push()
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
