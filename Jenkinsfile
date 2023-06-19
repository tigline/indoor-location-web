pipeline {
    agent any

    tools {
        nodejs 'NodeJS-19'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main-release', url: 'https://github.com/tigline/indoor-location-web.git'
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // 使用 SSH 凭据和 scp 将构建好的文件传输到 EC2 实例
                    withCredentials([sshUserPrivateKey(credentialsId: 'aliyun-key', keyFileVariable: 'keyFile')]) {
                        sh 'scp -i $keyFile -r dist/* root@8.217.20.176:/home/ecs-assist-user/frontend'
                    }
                }
            }
        }
    }
}
