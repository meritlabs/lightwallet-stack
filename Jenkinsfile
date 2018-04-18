
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
    stage('Build Wallets') {
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
  }
}
