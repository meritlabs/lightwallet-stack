node {
  stage('Checkout') {
	  checkout scm
  }
  stage('Prepare') {
    sh 'make clean-stack && make prepare-stack'
    sh 'cp packages/lightwallet/common/environments/environment.example.ts packages/lightwallet/common/environments/environment.ts'
    sh 'cp packages/lightwallet/common/environments/environment.example.ts packages/lightwallet/common/environments/environment.dev.ts'
  }
  stage('Build Wallets') {
    parallel {
      stage('Build MLW') {
        sh 'cd packages/lightwallet && npm run build'
      }
      stage('Build DLW') {
        sh 'cd packages/lightwallet/desktop && npm run build'
      }
    }
  }
}
