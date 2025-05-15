pipeline {
    agent any
    
    tools {
        nodejs "NodeJS 24.0.2"
        maven "Maven 3.9.9"
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Explicitly specify the branch to checkout
                git branch: 'master', url: 'https://github.com/hghouatni/ChatRoomApp'
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    // Use bat for Windows instead of sh
                    bat 'npm install'
                    // Assuming Angular CLI is installed globally or available via npx
                    bat 'npx ng build --configuration production'
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    // Use bat for Windows and mvnw.cmd instead of ./mvnw
                    bat 'mvnw.cmd clean install'
                }
            }
        }
        
        stage('Tests Backend') {
            steps {
                dir('backend') {
                    bat 'mvnw.cmd test'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Fake deploy step (to be replaced)'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}