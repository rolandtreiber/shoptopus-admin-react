pipeline {
    agent any
    stages {
        stage('Preparing node version') {
            steps {
                sh '''
                    set +ex
                    export NVM_DIR="$HOME/.nvm"
                    . ~/.nvm/nvm.sh
                    . ~/.profile
                    nvm use 16
                    node -v
                    set -ex
                '''
            }
        }
        stage("Npm Install") {
            steps {
                sh 'npm install'
            }
        }
        stage("Npm Build") {
            steps {
                sh 'npm run build'
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
                sh 'unzip -o /Users/rolandtreiber/Sites/shoptopusAdmin.zip -d /Users/rolandtreiber/Sites/shoptopus/admin'
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
