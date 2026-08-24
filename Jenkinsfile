pipeline {
    agent any
    enviroment {
        IP_SERVER = '157.245.194.196'
        DEPLOY_PATH = '/root/mern-todo-app'
    }

        stages {
            stage('Hello') {
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