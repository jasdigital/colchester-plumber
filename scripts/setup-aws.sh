#!/bin/bash

# AWS App Runner Setup Script for Colchester Plumber
# This script creates the necessary AWS resources for App Runner deployment

set -e  # Exit on any error

# Configuration
REPOSITORY_NAME="colchester-plumber"
IAM_USER_NAME="github-actions-apprunner"
POLICY_NAME="AppRunnerDeploymentPolicy"
ROLE_NAME="AppRunnerECRAccessRole"
AWS_REGION="us-east-1"

echo "🚀 Setting up AWS resources for Colchester Plumber App Runner deployment..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✅ AWS Account ID: $ACCOUNT_ID"

# Create ECR repository
echo "📦 Creating ECR repository..."
if aws ecr describe-repositories --repository-names $REPOSITORY_NAME --region $AWS_REGION > /dev/null 2>&1; then
    echo "✅ ECR repository '$REPOSITORY_NAME' already exists"
else
    aws ecr create-repository \
        --repository-name $REPOSITORY_NAME \
        --region $AWS_REGION \
        --image-scanning-configuration scanOnPush=true
    echo "✅ ECR repository '$REPOSITORY_NAME' created"
fi

# Get ECR repository URI
ECR_URI=$(aws ecr describe-repositories --repository-names $REPOSITORY_NAME --region $AWS_REGION --query 'repositories[0].repositoryUri' --output text)
echo "📝 ECR Repository URI: $ECR_URI"

# Create IAM policy for GitHub Actions
echo "🔐 Creating IAM policy for GitHub Actions..."
cat > /tmp/apprunner-policy.json << EOL
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
            "Resource": "arn:aws:iam::$ACCOUNT_ID:role/$ROLE_NAME"
        }
    ]
}
EOL

# Create IAM policy
if aws iam get-policy --policy-arn "arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME" > /dev/null 2>&1; then
    echo "✅ IAM policy '$POLICY_NAME' already exists"
else
    aws iam create-policy \
        --policy-name $POLICY_NAME \
        --policy-document file:///tmp/apprunner-policy.json
    echo "✅ IAM policy '$POLICY_NAME' created"
fi

# Create IAM user for GitHub Actions
echo "👤 Creating IAM user for GitHub Actions..."
if aws iam get-user --user-name $IAM_USER_NAME > /dev/null 2>&1; then
    echo "✅ IAM user '$IAM_USER_NAME' already exists"
else
    aws iam create-user --user-name $IAM_USER_NAME
    echo "✅ IAM user '$IAM_USER_NAME' created"
fi

# Attach policy to user
aws iam attach-user-policy \
    --user-name $IAM_USER_NAME \
    --policy-arn "arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME"
echo "✅ Policy attached to user"

# Create access keys for GitHub Actions
echo "🔑 Creating access keys..."
if aws iam list-access-keys --user-name $IAM_USER_NAME --query 'AccessKeyMetadata[0].AccessKeyId' --output text | grep -q "AKIA"; then
    echo "⚠️  Access keys already exist for user. Skipping creation."
    echo "   If you need new keys, delete existing ones first:"
    echo "   aws iam list-access-keys --user-name $IAM_USER_NAME"
    echo "   aws iam delete-access-key --user-name $IAM_USER_NAME --access-key-id KEY_ID"
else
    KEYS_OUTPUT=$(aws iam create-access-key --user-name $IAM_USER_NAME)
    ACCESS_KEY_ID=$(echo $KEYS_OUTPUT | jq -r '.AccessKey.AccessKeyId')
    SECRET_ACCESS_KEY=$(echo $KEYS_OUTPUT | jq -r '.AccessKey.SecretAccessKey')
    
    echo "✅ Access keys created!"
    echo ""
    echo "🔐 GitHub Secrets to configure:"
    echo "   AWS_ACCESS_KEY_ID: $ACCESS_KEY_ID"
    echo "   AWS_SECRET_ACCESS_KEY: $SECRET_ACCESS_KEY"
    echo ""
    echo "⚠️  IMPORTANT: Save these credentials securely. They won't be shown again!"
fi

# Create App Runner ECR access role
echo "🛡️  Creating App Runner ECR access role..."
cat > /tmp/trust-policy.json << EOL
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

if aws iam get-role --role-name $ROLE_NAME > /dev/null 2>&1; then
    echo "✅ IAM role '$ROLE_NAME' already exists"
else
    aws iam create-role \
        --role-name $ROLE_NAME \
        --assume-role-policy-document file:///tmp/trust-policy.json
    echo "✅ IAM role '$ROLE_NAME' created"
fi

# Attach the managed policy to the role
aws iam attach-role-policy \
    --role-name $ROLE_NAME \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess
echo "✅ ECR access policy attached to role"

# Clean up temporary files
rm -f /tmp/apprunner-policy.json /tmp/trust-policy.json

echo ""
echo "🎉 AWS setup completed successfully!"
echo ""
echo "📋 Summary of created resources:"
echo "   - ECR Repository: $ECR_URI"
echo "   - IAM User: $IAM_USER_NAME"
echo "   - IAM Policy: $POLICY_NAME"
echo "   - IAM Role: $ROLE_NAME"
echo ""
echo "🔧 Next steps:"
echo "   1. Configure GitHub repository secrets:"
echo "      - AWS_ACCESS_KEY_ID"
echo "      - AWS_SECRET_ACCESS_KEY"
echo ""
echo "   2. Update the GitHub Actions workflow if needed:"
echo "      - AWS_REGION: $AWS_REGION"
echo "      - ECR_REPOSITORY: $REPOSITORY_NAME"
echo ""
echo "   3. Push code to main branch to trigger deployment"
echo ""
echo "📝 Configuration values for GitHub Actions:"
echo "   AWS_REGION=$AWS_REGION"
echo "   ECR_REPOSITORY=$REPOSITORY_NAME"
echo "   APP_RUNNER_SERVICE=colchester-plumber-service"
echo ""
echo "🔗 Useful AWS Console links:"
echo "   - ECR: https://$AWS_REGION.console.aws.amazon.com/ecr/repositories"
echo "   - App Runner: https://$AWS_REGION.console.aws.amazon.com/apprunner/home"
echo "   - IAM: https://console.aws.amazon.com/iam/home"