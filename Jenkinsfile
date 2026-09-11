pipeline {
    agent any
    environment {
        IP_SERVER = '178.128.x.x'
        DEPLOY_PATH = '/root/mern-todo-app'
    }

        stages {
            stage('Deploy to VPS') {
                steps {
                        withCredentials([
                        sshUserPrivateKey(credentialsId:'ssh-key', keyFileVariable:'KEY', usernameVariable:'USER')

                        ]) 
                        {
                            sh """
                            ssh -o StrictHostKeyChecking=no -i ${KEY} ${USER}@${IP_SERVER} '
                            cd ${DEPLOY_PATH} && git pull
                            docker-compose down
                            docker-compose build
                            docker-compose up -d
                            '
                            """
                        } 
                    }
            }
        }
}