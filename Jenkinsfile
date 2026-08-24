pipeline {
    agent any
        stages {
            stage('Hello') {
                steps {
                        withCredentials([
                        usernamePassword(credentialsId:'github-id', usernameVariable:'USER', passwordVariable:'PASS')

                        ]) 
                        {
                        echo " ${USER} - ${PASS} "
                        } 
                    }
            }
        }
}