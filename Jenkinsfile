pipeline {
    agent any

    tools {
        nodejs "NodeJS"
        maven "Maven"
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/hghouatni/ChatRoomApp'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'ng build --configuration production'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh './mvnw clean install'
                }
            }
        }

        stage('Tests Backend') {
            steps {
                dir('backend') {
                    sh './mvnw test'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Fake deploy step (to be replaced)'
            }
        }
    }
}
