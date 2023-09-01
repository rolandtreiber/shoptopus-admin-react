pipeline {
    agent any
    stages {
        stage("Verify tooling") {
            steps {
                sh '''
                    docker info
                    docker version
                    docker compose version
                '''
            }
        }
        stage("Clear all running docker containers") {
            steps {
                script {
                    try {
                        sh 'docker rm -f $(docker ps -a -q)'
                    } catch (Exception e) {
                        echo 'No running container to clear up...'
                    }
                }
            }
        }
        stage("Npm Install") {
            steps {
                sh 'docker compose run --rm npm install'
            }
        }
        stage("Npm Build") {
            steps {
                sh 'docker compose run --rm npm run build'
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
