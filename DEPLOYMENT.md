# AWS Amplify Gen2 Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Setup ✅
- [ ] AWS Account with appropriate permissions
- [ ] AWS Amplify CLI installed (`npm install -g @aws-amplify/cli`)
- [ ] Node.js >= 20.20.0
- [ ] npm >= 10.8.0

### 2. Configuration ✅
- [ ] Copy `.env.example` to `.env.local`
- [ ] Update all AWS credentials in `.env.local`
- [ ] Verify `amplify_outputs.json` contains correct AWS resources
- [ ] Cognito User Pool ID configured
- [ ] AppSync GraphQL endpoint configured
- [ ] S3 bucket configured for storage

### 3. OAuth Setup (Optional)
- [ ] Google OAuth credentials configured in Cognito
- [ ] GitHub OAuth credentials configured in Cognito
- [ ] Redirect URLs updated in Cognito for production domain

### 4. Build Verification ✅
```bash
# Install dependencies
npm ci

# Run linting
npm run lint

# Build for production
npm run build

# Verify build output in ./dist
```

## Deployment Steps

### Step 1: Initialize Amplify (if not done)
```bash
npx ampx init

# When prompted:
# - Select "AWS account"
# - Choose your AWS region (ap-south-1)
# - Provide AWS credentials
```

### Step 2: Deploy Backend
```bash
npx ampx pipeline-deploy --branch main --app-id <your-amplify-app-id>
```

### Step 3: Build Frontend
```bash
npm run build
```

### Step 4: Deploy to AWS Amplify
```bash
# If you haven't connected to Amplify yet:
npx ampx sandbox --outputs-out amplify_outputs.json

# Or push existing changes:
npx ampx push
```

### Step 5: Monitor Deployment
```bash
# Check deployment status in Amplify Console
# https://us-east-1.console.aws.amazon.com/amplify/
```

## Environment Variables for Production

Update these in AWS Amplify Console (Environment variables section):

```
VITE_AWS_REGION=ap-south-1
VITE_USER_POOL_ID=<from-amplify-outputs>
VITE_USER_POOL_CLIENT_ID=<from-amplify-outputs>
VITE_IDENTITY_POOL_ID=<from-amplify-outputs>
VITE_APPSYNC_URL=<from-amplify-outputs>
VITE_REDIRECT_SIGN_IN=https://your-domain.com/auth/callback
VITE_REDIRECT_SIGN_OUT=https://your-domain.com/auth/logout
VITE_ENABLE_DEMO_MODE=false
```

## Important Notes

### Authentication
- The app uses AWS Cognito for authentication
- User Pool is configured in `ap-south-1`
- Identity Pool for unauthenticated access is enabled
- Password policy: Minimum 8 chars, uppercase, lowercase, numbers, symbols

### Database
- AWS AppSync provides GraphQL endpoint
- DynamoDB tables auto-created from Amplify Data schema
- On-demand billing (pay per request)
- Default authorization: Cognito User Pools
- Secondary authorization: AWS IAM

### Storage
- S3 bucket configured for file uploads
- Profile pictures: Authenticated users read/write
- Attachments: Authenticated users read/write

### Security Recommendations
1. **Never commit credentials to Git**
   - `.env.local` and `.env` files are gitignored
   - Use AWS Amplify Console for production secrets

2. **Enable MFA in Cognito** (Production)
   - Require MFA for admin users
   - Optional MFA for regular users

3. **Configure CORS** for API calls
   - Set proper CORS headers in AppSync

4. **Use HTTPS only** in production
   - AWS Amplify automatically provisions SSL/TLS

5. **Enable CloudFront** for CDN distribution
   - Faster content delivery globally
   - DDoS protection included

## Build Output

After running `npm run build`:

```
dist/
├── index.html          # Main entry point
├── assets/
│   ├── *.js           # JavaScript bundles (minified)
│   ├── *.css          # CSS bundles (minified)
│   └── *.svg          # SVG assets
└── vite.svg           # Vite logo
```

These files are automatically deployed to AWS Amplify Hosting.

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm ci
npm run build
```

### Environment Variable Issues
- Ensure all required variables are set
- Check variable names (should match VITE_ prefix)
- Verify no typos in variable names

### Cognito Authentication Failures
- Verify User Pool ID in amplify_outputs.json
- Check Cognito console for user creation
- Ensure redirect URLs match deployed domain

### AppSync Connection Issues
- Verify GraphQL endpoint URL
- Check network connectivity
- Review AppSync logs in CloudWatch

### S3 Upload Failures
- Verify bucket exists and is accessible
- Check IAM permissions for authenticated role
- Review CORS configuration

## Performance Optimization

### Already Implemented
✅ Code splitting with Vite
✅ Tree shaking for unused code
✅ CSS minification
✅ JavaScript minification
✅ Asset optimization

### Additional Recommendations
1. **Enable CloudFront** for static assets
2. **Configure caching** in Amplify
3. **Use Lambda@Edge** for dynamic routing
4. **Implement CDN** for global distribution

## Monitoring & Debugging

### CloudWatch Logs
- AppSync API logs
- Lambda execution logs
- Authentication events

### Amplify Analytics
- Deploy frequency
- Performance metrics
- Error tracking

### X-Ray (Optional)
- Trace API requests
- Debug performance issues
- Visualize service dependencies

## Post-Deployment

### Verification Steps
1. [ ] Homepage loads correctly
2. [ ] Authentication flow works
3. [ ] Google/GitHub OAuth (if configured)
4. [ ] Data persistence in DynamoDB
5. [ ] File uploads to S3
6. [ ] Real-time updates work
7. [ ] Analytics tracking active

### Monitoring
- Set up CloudWatch alarms
- Configure SNS notifications
- Monitor error rates
- Track user activity

## Rollback Procedure

If deployment fails:
```bash
# Revert to previous deployment
# In Amplify Console:
# 1. Go to Deployments
# 2. Select previous successful deployment
# 3. Click "Redeploy"
```

## Support & Documentation

- [AWS Amplify Documentation](https://docs.amplify.aws)
- [AWS Amplify Gen2 Guide](https://docs.amplify.aws/react/start/quickstart/)
- [Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [AppSync Documentation](https://docs.aws.amazon.com/appsync/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)

## Useful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview build locally
npm run preview

# Lint code
npm run lint

# Amplify commands
npx ampx init                           # Initialize Amplify
npx ampx sandbox --outputs-out outputs.json  # Start sandbox
npx ampx push                           # Push changes to AWS
npx ampx pull                           # Pull remote configuration
npx ampx pipeline-deploy                # Deploy via pipeline
```
