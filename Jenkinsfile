pipeline {
    agent any

    tools {
        nodejs "NodeJS"     // Doit être défini dans Jenkins > Tools
        maven "Maven 3.8"   // Pareil ici
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
                    sh 'ng build --prod'  // Ne bloque pas le pipeline
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh './mvnw clean install'
                    sh './mvnw spring-boot:run &'
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
                echo 'Déploiement fictif ici'
            }
        }
    }
}
