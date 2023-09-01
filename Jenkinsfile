pipeline {
    agent any
    tools { nodejs "nodejs16" }
    stages {
        stage('Preparing node version') {
            steps {
                sh '''
                    npm --version
                '''
            }
        }
        stage('Npm install') {
            steps {
                sh '''
                    npm install
                '''
            }
        }
        stage('Npm build') {
            steps {
                sh '''
                    npm run build
                '''
            }
        }
        stage("Create artifact") {
            steps {
                zip zipFile: 'shoptopusAdmin.zip', archive: true, overwrite: true, dir: 'build'
            }
        }
        stage("Copy artifact") {
            steps {
                fileOperations([fileCopyOperation(
                excludes: '',
                flattenFiles: false,
                includes: 'shoptopusAdmin.zip',
                targetLocation: "/Users/rolandtreiber/Sites"
                )])
            }
        }
        stage("Unzip artifact in place") {
            steps {
                sh 'unzip -o /Users/rolandtreiber/Sites/shoptopusAdmin.zip -d /Users/rolandtreiber/Sites/shoptopus/public/admin'
            }
        }
        stage("Delete artifact zip file") {
            steps {
                sh 'rm /Users/rolandtreiber/Sites/shoptopusAdmin.zip'
            }
        }
    }
    post {
        always {
            sh 'docker compose down --remove-orphans -v'
            sh 'docker compose ps'
        }
    }
}
