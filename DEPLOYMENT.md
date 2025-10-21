# GitHub Actions Deployment to AWS App Runner

This repository is configured for automatic deployment to AWS App Runner using GitHub Actions with containerized deployment. Every push to the `main` branch will trigger a build and deployment process to a fully managed container service.

## 🚀 Quick Start

1. **Set up AWS credentials** (run once)
2. **Create ECR repository** (run once)  
3. **Configure GitHub secrets** (run once)
4. **Push to main branch** (triggers deployment)

## 📋 Prerequisites

- AWS Account with appropriate permissions
- GitHub repository with admin access
- AWS CLI installed (for initial setup)
- Docker installed locally (for testing)

## 🔧 AWS Setup

### 1. Create ECR Repository

Create an Amazon ECR repository to store your Docker images:

```bash
# Configure AWS CLI
aws configure

# Create ECR repository
aws ecr create-repository \
    --repository-name colchester-plumber \
    --region us-east-1

# Get the repository URI (save this for later)
aws ecr describe-repositories \
    --repository-names colchester-plumber \
    --query 'repositories[0].repositoryUri' \
    --output text
```

### 2. Create IAM User for GitHub Actions

Create an IAM user with the necessary permissions:

```bash
# Create IAM user
aws iam create-user --user-name github-actions-apprunner

# Create and attach policy
cat > apprunner-policy.json << 'EOL'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:PutImage"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "apprunner:CreateService",
                "apprunner:UpdateService",
                "apprunner:DescribeService",
                "apprunner:ListServices",
                "apprunner:TagResource"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:PassRole"
            ],
            "Resource": "arn:aws:iam::*:role/AppRunnerECRAccessRole"
        }
    ]
}
EOL

aws iam create-policy \
    --policy-name AppRunnerDeploymentPolicy \
    --policy-document file://apprunner-policy.json

aws iam attach-user-policy \
    --user-name github-actions-apprunner \
    --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/AppRunnerDeploymentPolicy

# Create access keys
aws iam create-access-key --user-name github-actions-apprunner
```

### 3. Create App Runner ECR Access Role

App Runner needs a role to access ECR:

```bash
# Create trust policy
cat > trust-policy.json << 'EOL'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "build.apprunner.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOL

# Create the role
aws iam create-role \
    --role-name AppRunnerECRAccessRole \
    --assume-role-policy-document file://trust-policy.json

# Attach the managed policy
aws iam attach-role-policy \
    --role-name AppRunnerECRAccessRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess
```

## 🔐 GitHub Repository Configuration

### Required Secrets

Go to your GitHub repository → Settings → Secrets and Variables → Actions, and add these secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | Access key from IAM user | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Secret key from IAM user | `wJalrXUt...` |

### Environment Variables (Optional)

You can also configure these in the workflow file:

- `AWS_REGION` - AWS region (default: us-east-1)
- `ECR_REPOSITORY` - ECR repository name (default: colchester-plumber)
- `APP_RUNNER_SERVICE` - App Runner service name (default: colchester-plumber-service)

## 🔄 Deployment Process

### Automatic Deployment

The deployment happens automatically when you:
1. Push code to the `main` branch
2. Create a pull request to `main` (build only, no deployment)

### Manual Deployment

You can also trigger deployment manually:
1. Go to Actions tab in your GitHub repository
2. Select "Deploy to AWS App Runner" workflow
3. Click "Run workflow"

### Build Process

The GitHub Actions workflow:
1. **Builds** the React app using Docker multi-stage build
2. **Pushes** the Docker image to Amazon ECR
3. **Creates/Updates** the App Runner service
4. **Waits** for deployment to complete
5. **Provides** the service URL

## 🌐 Domain Configuration

### Custom Domain Setup

After deployment, you can add a custom domain:

1. **In AWS Console:**
   - Go to App Runner → Your service
   - Click "Custom domains" tab
   - Add your domain name
   - Configure DNS records as shown

2. **DNS Configuration:**
   ```
   CNAME: www.your-domain.com → your-apprunner-url.region.awsapprunner.com
   ALIAS: your-domain.com → your-apprunner-url.region.awsapprunner.com
   ```

### SSL Certificate

App Runner automatically provides SSL certificates for custom domains.

## 📁 Project Structure

```
colchester-plumber/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions workflow
├── src/                        # React application source
├── dist/                       # Built files (created by Vite)
├── Dockerfile                  # Container configuration
├── nginx.conf                  # Nginx configuration for container
├── apprunner.yaml             # App Runner service configuration
├── .dockerignore              # Docker build exclusions
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
└── README.md                  # This file
```

## 🔍 Troubleshooting

### Common Issues

#### ❌ ECR Authentication Failed
```bash
# Ensure AWS credentials are correct
aws sts get-caller-identity

# Check ECR repository exists
aws ecr describe-repositories --repository-names colchester-plumber
```

#### ❌ App Runner Service Creation Failed
- Verify IAM permissions include App Runner actions
- Check that ECR access role exists
- Ensure Docker image builds successfully locally

#### ❌ Docker Build Failures
- Test build locally: `docker build -t colchester-plumber .`
- Check Dockerfile syntax
- Verify all required files are included (not in .dockerignore)

#### ❌ Service Health Check Failures
- Verify nginx configuration is correct
- Check that port 8080 is exposed
- Test health endpoint: `curl http://localhost:8080/health`

### Debugging Commands

```bash
# Test Docker build locally
docker build -t colchester-plumber .
docker run -p 8080:8080 colchester-plumber

# Check App Runner service status
aws apprunner describe-service --service-arn SERVICE_ARN

# View App Runner logs
aws logs filter-log-events \
    --log-group-name /aws/apprunner/colchester-plumber-service \
    --start-time $(date -d '1 hour ago' +%s)000

# Test ECR access
aws ecr get-login-password | docker login --username AWS --password-stdin ECR_URI
```

## 🔄 Local Development

### Testing the Container Locally

```bash
# Build the Docker image
docker build -t colchester-plumber .

# Run the container
docker run -p 8080:8080 colchester-plumber

# Test the application
curl http://localhost:8080
curl http://localhost:8080/health
```

### Development Workflow

```bash
# Standard development
yarn dev

# Test production build
yarn build
yarn preview

# Test Docker build
docker build -t colchester-plumber . && docker run -p 8080:8080 colchester-plumber
```

## 📊 Monitoring and Scaling

### App Runner Features

- **Automatic Scaling**: Scales from 0 to 25 instances based on traffic
- **Health Checks**: Built-in health monitoring with custom endpoint
- **Load Balancing**: Automatic load distribution
- **Zero Downtime Deployments**: Rolling updates with no service interruption

### Monitoring

```bash
# View service metrics
aws apprunner describe-service --service-arn SERVICE_ARN

# Check recent deployments
aws apprunner list-operations --service-arn SERVICE_ARN

# View application logs
aws logs describe-log-groups --log-group-name-prefix "/aws/apprunner"
```

### Cost Optimization

- **CPU/Memory**: Start with 0.25 vCPU, 0.5 GB RAM
- **Auto Scaling**: Configure min/max instances based on traffic
- **Monitoring**: Use CloudWatch to track usage and costs

## 🔒 Security Best Practices

1. **IAM Roles**: Use minimal required permissions
2. **Container Security**: Regular base image updates
3. **HTTPS**: App Runner provides automatic HTTPS
4. **Environment Variables**: Store secrets in GitHub secrets
5. **Network**: App Runner runs in managed VPC with security groups

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Check App Runner service logs in CloudWatch
4. Verify all AWS resources exist and have correct permissions

## 🚀 Advanced Configuration

### Environment Variables

Add environment variables to the App Runner service:

```bash
aws apprunner update-service \
    --service-arn SERVICE_ARN \
    --source-configuration '{
        "ImageRepository": {
            "ImageConfiguration": {
                "RuntimeEnvironmentVariables": {
                    "NODE_ENV": "production",
                    "CUSTOM_VAR": "value"
                }
            }
        }
    }'
```

### Custom Scaling

Configure scaling parameters:

```bash
aws apprunner update-service \
    --service-arn SERVICE_ARN \
    --auto-scaling-configuration-arn AUTO_SCALING_CONFIG_ARN
```

### VPC Connector

For database or private resource access:

```bash
aws apprunner create-vpc-connector \
    --vpc-connector-name colchester-plumber-vpc \
    --subnets subnet-xxx subnet-yyy \
    --security-groups sg-xxx
```