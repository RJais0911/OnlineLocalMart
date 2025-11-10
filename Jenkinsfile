pipeline {
    agent any

    environment {
        REPO_URL = 'https://github.com/RJais0911/Online-Local-Mart.git'
        PROJECT_NAME = 'OnlineLocalMart'
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
		// Set this to YOUR Docker Hub repo (replace username below)
		IMAGE_REPO = 'rjais11/online-local-mart-backend'
		IMAGE_NAME = "${IMAGE_REPO}:latest"
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Clone Repository') {
            steps {
                bat "git clone %REPO_URL%"
            }
        }

        stage('Build Docker Images') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    dir("${PROJECT_NAME}") {
                        bat 'docker-compose build'
                    }
                }
            }
        }


        stage('Tag Docker Image') {
            steps {
                bat 'docker tag onlinelocalmart-backend:latest %IMAGE_NAME%'
            }
        }

        stage('Login to DockerHub') {
            steps {
                bat "echo %DOCKERHUB_CREDENTIALS_PSW% | docker login -u %DOCKERHUB_CREDENTIALS_USR% --password-stdin"
            }
        }

        stage('Push to DockerHub') {
            steps {
                bat 'docker push %IMAGE_NAME%'
            }
        }

        stage('Start Containers') {
            steps {
                dir("${PROJECT_NAME}") {
                    bat 'docker-compose up -d'
                }
            }
        }

        stage('Verify Running Containers') {
            steps {
                bat 'docker ps -a'
            }
        }
    }

    post {
        success {
            mail to: 'jaiswalruchi254@gmail.com',
                 subject: "✅ Build Success - #${env.BUILD_NUMBER}",
                 body: """
    🎉 Congratulations! The Jenkins pipeline has successfully completed all stages.

    This includes cloning the repository, building Docker images, tagging the image, logging into DockerHub, and pushing the image to DockerHub. Furthermore, the Docker containers have been started successfully.

    Your project is now ready and deployed, and everything is running smoothly.

    The details are mentioned below:

    📄 Job Name: ${env.JOB_NAME}
    🔢 Build Number: ${env.BUILD_NUMBER}
    🌿 Branch: ${env.GIT_BRANCH}
    🔗 Build URL: ${env.BUILD_URL}
    🕒 Timestamp: ${new Date()}
    ⏱ Duration: ${currentBuild.durationString}

    ✅ Status: SUCCESS
    """
        }
        failure {
            mail to: 'jaiswalruchi254@gmail.com',
                 subject: "❌ Build Failed - #${env.BUILD_NUMBER}",
                 body: """
    ⚠️ Unfortunately, the pipeline encountered an error during execution.

    The failure occurred during one of the stages such as building Docker images, tagging, logging into DockerHub, or starting the containers. Immediate action is required to resolve the issue.

    The details are mentioned below:

    📄 Job Name: ${env.JOB_NAME}
    🔢 Build Number: ${env.BUILD_NUMBER}
    🌿 Branch: ${env.GIT_BRANCH}
    🔗 Build URL: ${env.BUILD_URL}
    🕒 Timestamp: ${new Date()}
    ⏱ Duration: ${currentBuild.durationString}

    ❌ Status: FAILURE

    Please check the Jenkins console output for more details and to investigate the cause of the failure.
    """
        }
    }
}
