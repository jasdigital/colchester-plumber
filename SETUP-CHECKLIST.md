# 🚀 App Runner Deployment Setup Checklist

Use this checklist to ensure your GitHub Actions deployment to AWS App Runner is properly configured.

## ☐ AWS Account Setup

- [ ] AWS Account created and configured
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] Appropriate IAM permissions for ECR and App Runner
- [ ] ECR repository created for container images
- [ ] App Runner ECR access role created

## ☐ AWS Resources

- [ ] ECR repository created: `aws ecr create-repository --repository-name colchester-plumber`
- [ ] IAM user created for GitHub Actions with required policies
- [ ] Access keys generated for GitHub Actions user
- [ ] AppRunnerECRAccessRole created and configured

## ☐ Local Development

- [ ] Docker installed and working
- [ ] Container builds successfully: `docker build -t colchester-plumber .`
- [ ] Container runs locally: `docker run -p 8080:8080 colchester-plumber`
- [ ] Health endpoint working: `curl http://localhost:8080/health`
- [ ] React app loads correctly in container

## ☐ GitHub Repository

- [ ] Repository created/exists on GitHub
- [ ] Code pushed to repository
- [ ] GitHub Actions workflow file present (`.github/workflows/deploy.yml`)
- [ ] Dockerfile and nginx.conf configured correctly

## ☐ GitHub Secrets

Go to: Repository → Settings → Secrets and Variables → Actions

- [ ] `AWS_ACCESS_KEY_ID` - IAM user access key
- [ ] `AWS_SECRET_ACCESS_KEY` - IAM user secret key

## ☐ Container Configuration

- [ ] Dockerfile creates optimized multi-stage build
- [ ] Nginx configuration handles SPA routing
- [ ] Health check endpoint configured (`/health`)
- [ ] Port 8080 exposed and configured
- [ ] .dockerignore file excludes unnecessary files

## ☐ Domain Configuration (Optional)

- [ ] Domain name registered
- [ ] Custom domain added to App Runner service
- [ ] DNS CNAME record: `www.your-domain.com` → `your-service.region.awsapprunner.com`
- [ ] DNS ALIAS record: `your-domain.com` → `your-service.region.awsapprunner.com`
- [ ] SSL certificate automatically provisioned by App Runner

## ☐ Testing

- [ ] Push to main branch triggers GitHub Actions
- [ ] Container builds successfully in CI
- [ ] ECR push completes successfully
- [ ] App Runner service creates/updates successfully
- [ ] Website accessible via App Runner URL
- [ ] Website accessible via custom domain (if configured)
- [ ] Health checks passing

## ☐ Final Steps

- [ ] Test React router navigation
- [ ] Verify all static assets load correctly
- [ ] Check mobile responsiveness
- [ ] Monitor App Runner metrics in AWS Console
- [ ] Set up CloudWatch log monitoring
- [ ] Test auto-scaling behavior

---

## 🔧 Quick Commands Reference

### Local Testing
```bash
# Build and test container locally
docker build -t colchester-plumber .
docker run -p 8080:8080 colchester-plumber

# Test endpoints
curl http://localhost:8080
curl http://localhost:8080/health
```

### AWS Commands
```bash
# Check ECR repository
aws ecr describe-repositories --repository-names colchester-plumber

# List App Runner services
aws apprunner list-services

# Get service details
aws apprunner describe-service --service-arn SERVICE_ARN

# View service logs
aws logs filter-log-events --log-group-name /aws/apprunner/SERVICE_NAME
```

### GitHub Actions Debugging
```bash
# Check repository secrets
# Go to GitHub repo → Settings → Secrets and Variables → Actions

# Manually trigger workflow
# Go to GitHub repo → Actions → Deploy to AWS App Runner → Run workflow
```

## 📱 Expected AWS Costs

### App Runner Pricing (us-east-1)
- **vCPU**: $0.064 per vCPU hour
- **Memory**: $0.007 per GB hour
- **Requests**: $0.0000025 per request

### Example Monthly Costs (24/7 operation)
- **0.25 vCPU + 0.5 GB RAM**: ~$25-30/month
- **Plus**: Request charges based on traffic
- **ECR Storage**: ~$0.10 per GB per month

### Cost Optimization Tips
- Use minimum resources initially (0.25 vCPU, 0.5 GB)
- App Runner scales to zero when no traffic
- Monitor usage in AWS Cost Explorer

## 📊 Monitoring Setup

### CloudWatch Dashboards
- [ ] App Runner service metrics dashboard created
- [ ] Log insights queries configured
- [ ] Alarms set for error rates and response times

### Health Monitoring
- [ ] Health check endpoint responding correctly
- [ ] App Runner health checks configured (10s interval)
- [ ] Custom health metrics tracked if needed

## 🔒 Security Checklist

- [ ] IAM permissions follow least privilege principle
- [ ] GitHub secrets are properly secured
- [ ] Container base images are regularly updated
- [ ] HTTPS enforced (automatic with App Runner)
- [ ] No sensitive data in container images
- [ ] Environment variables used for configuration

## � Support Contacts

- **GitHub Actions Issues**: Check repository Actions tab
- **App Runner Issues**: AWS Console → App Runner → Service logs
- **Container Issues**: Test locally with Docker
- **Domain Issues**: Check DNS propagation and App Runner custom domains

---

## 🚨 Troubleshooting Common Issues

### Container Build Fails
1. Test build locally: `docker build -t test .`
2. Check Dockerfile syntax
3. Verify all required files are present
4. Check .dockerignore isn't excluding needed files

### ECR Push Fails
1. Verify AWS credentials: `aws sts get-caller-identity`
2. Check ECR repository exists
3. Verify IAM permissions for ECR

### App Runner Deployment Fails
1. Check service logs in CloudWatch
2. Verify container exposes port 8080
3. Check health endpoint returns 200
4. Verify App Runner ECR access role exists

### Website Not Loading
1. Check App Runner service status
2. Verify health checks are passing
3. Test container locally on port 8080
4. Check nginx configuration for SPA routing

---

**Last Updated**: $(date)
**Setup Status**: ⏳ In Progress / ✅ Complete
**Service URL**: _Will be provided after deployment_