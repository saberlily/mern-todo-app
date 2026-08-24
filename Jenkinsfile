pipeline {
    agent any
        stages {
            stage('Hello') {
                steps {
                    echo "Chào bạn!"
                    echo "Pipeline đang chạy..."
                    }
            }

            stage('List files') {
                steps {
                    sh "ls -la"
                    }
                }
        }
}