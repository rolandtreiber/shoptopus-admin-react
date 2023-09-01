pipeline {
    agent any
    stages {
        stage("Npm Install") {
            steps {
                sh 'export NVM_DIR="$HOME/.nvm"
                      [ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"
                      [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/usr/local/opt/nvm/etc/bash_completion.d/nvm"'
                sh 'nvm use 16'
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
