pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('docker_hub_login') 
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
                    docker.build(DOCKER_IMAGE)
                }
            }
        }

        stage('Push') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS) {
                        docker.image(DOCKER_IMAGE).push("${env.BUILD_NUMBER}")
                        docker.image(DOCKER_IMAGE).push("latest")
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
