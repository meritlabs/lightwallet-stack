
pipeline {
  agent any

  stages {
    stage('Notify Build Start') {
      steps {
        slackSend channel: "#engineering", message: "Build Started: ${currentBuild.fullDisplayName} (<${env.RUN_DISPLAY_URL}|BlueOcean> <${env.BUILD_URL}|Open>)"
      }
    }
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Prepare') {
      steps {
        sh 'make clean-stack && make prepare-stack'
        sh 'cp packages/lightwallet/common/environments/environment.example.ts packages/lightwallet/common/environments/environment.ts'
        sh 'cp packages/lightwallet/common/environments/environment.example.ts packages/lightwallet/common/environments/environment.dev.ts'
      }
    }
    // stage('Unit Tests') {
    //   steps {
    //     sh 'cd packages/lightwallet && npm test'
    //   }
    // }
    // stage('E2E Tests') {
    //   steps {
    //     withCredentials([
    //       string(credentialsId: 'browserstack-user', variable: 'browserstackUser'),
    //       string(credentialsId: 'browserstack-key', variable: 'browserstackKey')
    //     ]) {
    //       sh 'cd packages/lightwallet/desktop && npm start &'
    //       sh 'wget --retry-connrefused --no-check-certificate -T 30 http://localhost:8888'
    //       sh "cd packages/lightwallet && BROWSERSTACK_USER=${browserstackUser} BROWSERSTACK_KEY=${browserstackKey} npm run test:e2e"
    //     }
    //   }
    // }
    stage('Build Wallets [Dev]') {
      parallel {
        stage('Build MLW') {
          steps {
            sh 'cd packages/lightwallet && npm run build'
          }
        }
        stage('Build DLW') {
          steps {
            sh 'cd packages/lightwallet/desktop && npm run build'
          }
        }
      }
    }
    stage('Build Wallets [Production]') {
      parallel {
        stage('Build MLW') {
          steps {
            sh 'cd packages/lightwallet && npm run build -- --prod'
          }
        }
        stage('Build DLW') {
          steps {
            sh 'cd packages/lightwallet/desktop && npm run build:prod'
          }
        }
      }
    }
    // stage('Test Wallets') {
    //   parallel {
    //     stage('Test MLW') {
    //       steps {
    //         sh 'cd packages/lightwallet && npm run test'
    //       }
    //     }
    //     stage('Test DLW') {
    //       steps {
    //         sh 'cd packages/lightwallet/desktop && npm run test'
    //       }
    //     }
    //   }
    // }
  }
  post {
    always {
      sh 'make clean-stack'
    }
    success {
      slackSend color: "good", channel: "#engineering", message: "Build finished successfully: ${currentBuild.fullDisplayName} (<${env.RUN_DISPLAY_URL}|BlueOcean> <${env.BUILD_URL}|Open>)"
    }
    failure {
      slackSend color: "danger", channel: "#engineering", message: "Build failed: ${currentBuild.fullDisplayName} (<${env.RUN_DISPLAY_URL}|BlueOcean> <${env.BUILD_URL}|Open>)"
    }
  }
}
