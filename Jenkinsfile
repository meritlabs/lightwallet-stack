
pipeline {
	agent any

	stages {
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
    stage('Unit Tests') {
      steps {
        sh 'cd packages/lightwallet && npm test'
      }
    }
    stage('E2E Tests') {
      steps {
        sh 'BUILD_ID=dontKillMe cd packages/lightwallet/desktop && npm start &'
        sh 'wget --retry-connrefused --no-check-certificate -T 30 http://localhost:8888'
        sh 'cd packages/lightwallet && npm run e2e'
      }
    }
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
    stage('Test Wallets') {
      parallel {
        stage('Test MLW') {
          steps {
            sh 'cd packages/lightwallet && npm run test'
          }
        }
        stage('Test DLW') {
          steps {
            sh 'cd packages/lightwallet/desktop && npm run test'
          }
        }
      }
    }
  }
}
