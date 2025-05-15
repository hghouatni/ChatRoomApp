pipeline {
    agent any
    
    tools {
        nodejs "NodeJS"
        maven "Maven"
    }
    
    stages {
        // Suppression de l'étape Checkout car Jenkins fait déjà un checkout initial
        // pour obtenir le Jenkinsfile, et nous ne voulons pas recheckout une autre branche
        
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