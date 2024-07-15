pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "your_dockerhub_username/k8s-manifest-generator"
        DOCKER_CREDENTIALS_ID = "docker-hub-credentials"
        KUBECONFIG_CREDENTIALS_ID = "kubeconfig"
        K8S_NAMESPACE = "your-namespace"
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-repo/k8s-manifest-generator.git'
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
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        docker.image(DOCKER_IMAGE).push("${env.BUILD_NUMBER}")
                        docker.image(DOCKER_IMAGE).push("latest")
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([file(credentialsId: KUBECONFIG_CREDENTIALS_ID, variable: 'KUBECONFIG')]) {
                    script {
                        sh 'kubectl apply -f k8s-manifest.yaml'
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
