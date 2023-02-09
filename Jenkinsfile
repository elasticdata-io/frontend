pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    some-label: some-label-value
spec:
  volumes:
  - name: dockersock
    hostPath:
      path: /var/run/docker.sock
  - name: kubeconfig
    hostPath:
      path: /opt/kubernetes/storage/.kube
  containers:
  - name: k8s-helm
    image: lachlanevenson/k8s-helm:v3.6.0
    command:
    - cat
    tty: true
    volumeMounts:
      - name: kubeconfig
        mountPath: "/opt/.kube"
  - name: docker
    image: docker
    volumeMounts:
      - name: dockersock
        mountPath: "/var/run/docker.sock"
    command:
    - cat
    tty: true
'''
        }
    }
    environment {
        DOCKER_TAG = ''
    }
    stages {
        stage('docker build & push') {
            steps {
                // checkout scm
                container('docker') {
                    script{
                        def now = new Date()
                        env.dateFormatted = now.format("yyyy-MM-dd'T'HH:mm:ss'Z'")
                    }
                    sh 'docker login -u bombascter -p "!Prisoner31!"'
                    sh 'docker build -f install/Dockerfile -t bombascter/scraper-frontend:${GIT_COMMIT} .'
                    sh 'docker push bombascter/scraper-frontend:${GIT_COMMIT}'
                }
            }
        }
        stage('helm') {
            steps {
                container('k8s-helm') {
                    sh "helm upgrade \
                        -f install/helm/frontend/values-production.yaml \
                        --install frontend \
                        --namespace app \
                        --set image.repository=bombascter/scraper-frontend \
                        --set image.tag=${GIT_COMMIT} \
                        install/helm/frontend"
                }
            }
        }
    }
}
