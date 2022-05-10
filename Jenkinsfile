#!groovy
import groovy.json.JsonOutput
import groovy.json.JsonSlurper

def label = "frontend-${UUID.randomUUID().toString()}"
podTemplate(label: label, yaml: """
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
"""
)
	{
		node(label) {
			properties([disableConcurrentBuilds()])

			stage('checkout') {

				checkout scm

				container('docker') {
                    env.DOCKER_TAG = "${BRANCH_NAME}_${BUILD_NUMBER}"
                    stage('build application') {
						sh 'docker login  \
							-u ${DOCKER_CONTAINER_LOGIN}  \
							-p ${DOCKER_CONTAINER_PASSWORD}'
						sh 'docker build -f install/Dockerfile -t  ${DOCKER_CONTAINER_PREFIX}/scraper-frontend:${DOCKER_TAG} .'
                    }
                    stage('publish application') {
                        sh 'docker push ${DOCKER_CONTAINER_PREFIX}/scraper-frontend:${DOCKER_TAG}'
                    }
				}

				container('k8s-helm') {
					stage('helm upgrade') {
						sh "helm upgrade \
                            -f install/helm/frontend/values-production.yaml \
							--install frontend \
							--namespace app \
							--set image.repository=${DOCKER_CONTAINER_PREFIX}/scraper-frontend \
							--set image.tag=${DOCKER_TAG} \
							install/helm/frontend"
					}
				}
			}
		}
	}
