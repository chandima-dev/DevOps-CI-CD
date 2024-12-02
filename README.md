# CI/CD Pipeline for Microservice Deployment to GKE

This repository demonstrates a CI/CD pipeline for deploying a microservice to a Google Kubernetes Engine (GKE) cluster using GitHub Actions and ArgoCD. The pipeline performs the following tasks:

1. **Linting and Testing**  
   Ensures code quality with linting and automated testing.

2. **Building and Pushing Docker Image**  
   Builds a Docker image and pushes it to Google Container Registry (GCR).

3. **Deploying to GKE using ArgoCD**  
   Syncs and deploys the latest image to a GKE cluster through ArgoCD.

---

## **Workflow Overview**

The pipeline is defined in `.github/workflows/ci-cd.yml` with three main jobs:

### 1. **Lint and Test**
- Runs `npm lint` to check for code quality issues.
- Runs `npm test` to validate the application through automated tests.

### 2. **Build and Push**
- Authenticates with GCR using a service account key stored in GitHub Secrets.
- Builds and tags a Docker image.
- Pushes the image to GCR.

### 3. **Deploy**
- Installs the ArgoCD CLI.
- Logs into ArgoCD using credentials stored in GitHub Secrets.
- Syncs the application with the GKE cluster.

---

## **Setup Instructions**

### 1. **Prerequisites**
- A GKE cluster with ArgoCD installed.
- Google Cloud SDK installed and configured locally.
- The following GitHub Secrets configured:
  - `GCP_SA_KEY`: Service account key JSON for GCP.
  - `GCP_PROJECT_ID`: The ID of your GCP project.
  - `ARGOCD_PASSWORD`: Password for ArgoCD admin.

### 2. **Configure ArgoCD**
- Install ArgoCD in your GKE cluster:
  ```bash
  kubectl create namespace argocd
  kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

---

# Scanning Docker Images with Trivy in GitHub Actions

In this section, we will walk through the process of scanning Docker images for vulnerabilities using **Trivy** as part of your **GitHub Actions** pipeline. Trivy is an open-source vulnerability scanner for containers and other artifacts. We will install Trivy in the pipeline and scan the Docker image after building it.

## Steps

1. **Install Trivy**: We'll begin by installing Trivy in the pipeline.
2. **Scan the Docker Image**: After building the Docker image, we'll use Trivy to scan it for vulnerabilities.
3. **Push the Docker Image**: If the image is free from critical vulnerabilities, it will be pushed to the container registry.

## Sample GitHub Actions Workflow

Below is a complete GitHub Actions workflow configuration that builds a Docker image, scans it with Trivy, and pushes it to a container registry (e.g., Google Container Registry).

```yaml
name: CI/CD Pipeline for Node.js Microservice

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Authenticate with GCP
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Configure Docker to use GCR
        run: gcloud auth configure-docker

      - name: Build and Tag Docker Image
        run: |
          docker build -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/node-microservice:${{ github.sha }} \
            -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/node-microservice:latest .

      - name: Install Trivy
        run: |
          curl -s https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh

      - name: Scan Docker Image for Vulnerabilities
        run: |
          trivy image --severity HIGH,CRITICAL gcr.io/${{ secrets.GCP_PROJECT_ID }}/node-microservice:${{ github.sha }}

      - name: Push Docker Image to GCR
        run: docker push gcr.io/${{ secrets.GCP_PROJECT_ID }}/node-microservice:${{ github.sha }}
```

### Explanation of Workflow

1. **Checkout Code**: The first step is to check out the code from the repository so we can build the Docker image.
   
2. **Authenticate with GCP**: The next step authenticates with Google Cloud Platform (GCP) to enable us to push the image to Google Container Registry (GCR).

3. **Build and Tag Docker Image**: In this step, we build the Docker image and tag it with both the commit SHA and `latest` tag.

4. **Install Trivy**: Here, we install Trivy using the official installation script. The script downloads and installs the latest version of Trivy.

   ```bash
   curl -s https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh
   ```

5. **Scan Docker Image for Vulnerabilities**: We then scan the Docker image for vulnerabilities using the `trivy image` command. The `--severity HIGH,CRITICAL` flag ensures that only high and critical vulnerabilities are reported.

   ```bash
   trivy image --severity HIGH,CRITICAL gcr.io/${{ secrets.GCP_PROJECT_ID }}/node-microservice:${{ github.sha }}
   ```

   - This will list any vulnerabilities found in the Docker image with the severity levels `HIGH` and `CRITICAL`.

6. **Push Docker Image to GCR**: If the image passes the vulnerability scan, it is pushed to the Google Container Registry using the `docker push` command.

## Trivy Command Explained

The core command used for scanning the Docker image is:

```bash
trivy image --severity HIGH,CRITICAL gcr.io/${{ secrets.GCP_PROJECT_ID }}/node-microservice:${{ github.sha }}
```

### Options:
- `image`: This tells Trivy to scan a Docker image.
- `--severity HIGH,CRITICAL`: Filters vulnerabilities based on severity (HIGH and CRITICAL in this case).
- `gcr.io/${{ secrets.GCP_PROJECT_ID }}/node-microservice:${{ github.sha }}`: The Docker image location and tag. This uses the GitHub `GCP_PROJECT_ID` secret for the project and the commit SHA as the image tag.

## Conclusion

By adding these steps to your GitHub Actions pipeline, you can ensure that your Docker images are scanned for vulnerabilities before they are pushed to a container registry. This enhances the security of your CI/CD pipeline by identifying potential issues early in the process.

--- 

This should provide a comprehensive, clear explanation of how to integrate **Trivy** into your pipeline for Docker image scanning with all necessary code snippets.
