pipeline {
    agent any
    
    tools {
        nodejs "NodeJS"
        maven "Maven"
    }
    
    stages {
        stage('Build Frontend') {
            steps {
                dir('chat-room-frontend') {
                    // Utiliser bat pour Windows
                    bat 'npm install'
                    // Construction de l'application Angular
                    bat 'npx ng build --configuration production'
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('chat-room-backend') {
                    // Utiliser mvnw.cmd pour Windows
                    bat 'mvnw.cmd clean install || mvn clean install'
                }
            }
        }
        
        stage('Tests Backend') {
            steps {
                dir('chat-room-backend') {
                    bat 'mvnw.cmd test || mvn test'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Étape de déploiement factice (à remplacer ultérieurement)'
            }
        }
    }
    
    post {
        always {
            echo 'Nettoyage et finalisation'
        }
        success {
            echo 'Pipeline terminé avec succès!'
        }
        failure {
            echo 'Pipeline échoué!'
        }
    }
}