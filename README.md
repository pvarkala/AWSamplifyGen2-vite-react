# TodoPro - Enterprise Project Management Platform

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![AWS Amplify](https://img.shields.io/badge/AWS%20Amplify-Gen2-orange)
![License](https://img.shields.io/badge/license-MIT-green)

A modern, high-end project management platform built with React + TypeScript + Vite and AWS Amplify Gen2, featuring AI-powered insights, real-time collaboration, and enterprise-grade security.

## 🚀 Features

### Core Capabilities
- **Project Management** - Create, organize, and collaborate on projects
- **Task Management** - Comprehensive task tracking with Kanban board
- **Team Collaboration** - Real-time chat and team messaging
- **Time Tracking** - Log work hours and track project time
- **Analytics Dashboard** - Real-time metrics and reporting
- **User Profiles** - Public and private profile management
- **Calendar Integration** - Google Calendar sync
- **File Management** - S3-backed file storage and uploads

### Technical Features
✨ **Full Stack**
- Frontend: React 18 + TypeScript + Vite
- Backend: AWS Amplify Gen2 with GraphQL
- Database: Amazon DynamoDB
- Authentication: Amazon Cognito
- File Storage: Amazon S3
- Real-time: AppSync + Socket.io

🔐 **Security**
- Amazon Cognito authentication
- Row-level authorization with AppSync
- End-to-end encrypted data transmission
- Secure password policies
- Optional MFA support

⚡ **Performance**
- Vite for ultra-fast builds
- Code splitting and lazy loading
- Optimized bundle size
- CloudFront CDN ready
- Server-side pagination

🎨 **Design**
- Professional UI with Tailwind CSS
- Dark/Light mode support
- Responsive design
- Framer Motion animations
- Enterprise color scheme

## 📋 Prerequisites

- **Node.js** >= 20.20.0
- **npm** >= 10.8.0
- **AWS Account** with Amplify permissions
- **Git** for version control

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AWSamplifyGen2-vite-react
```

### 2. Install Dependencies
```bash
npm ci
```

### 3. Setup Environment Variables
```bash
cp .env.example .env.local
# Edit .env.local with your AWS configuration
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📚 Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server

# Production
npm run build            # TypeScript check + Vite build
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint (strict mode - 0 warnings)

# Amplify
npx ampx init            # Initialize Amplify
npx ampx sandbox         # Start local Amplify sandbox
npx ampx push            # Push changes to AWS
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Input, Card)
│   └── layout/          # Layout components (AppLayout, AuthLayout)
├── features/            # Feature-based pages
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard page
│   ├── projects/       # Project management
│   ├── tasks/          # Task management
│   ├── profile/        # User profile
│   └── ...             # Other features
├── store/              # Zustand state management
├── lib/                # Utility libraries
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── contexts/           # React contexts (Theme, etc.)

amplify/               # AWS Amplify configuration
├── backend.ts         # Backend definition
├── auth/              # Authentication resource
├── data/              # Data schema (GraphQL)
└── storage/           # Storage resource
```

## 🔑 Environment Variables

Required variables (see `.env.example`):

```
VITE_AWS_REGION           # AWS region (default: ap-south-1)
VITE_USER_POOL_ID         # Cognito User Pool ID
VITE_USER_POOL_CLIENT_ID  # Cognito App Client ID
VITE_IDENTITY_POOL_ID     # Cognito Identity Pool ID
VITE_APPSYNC_URL          # AppSync GraphQL endpoint
VITE_REDIRECT_SIGN_IN     # OAuth callback URL
VITE_REDIRECT_SIGN_OUT    # OAuth logout URL
```

## 🚀 Deployment

### Quick Deploy to AWS Amplify

```bash
# Build for production
npm run build

# Deploy to Amplify (after setup)
npx ampx push
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### AWS Amplify Console
1. Connect your GitHub repository
2. Set environment variables in Amplify Console
3. Trigger automatic deployments on push
4. Monitor deployments in real-time

## 🔐 Authentication Setup

### Cognito Configuration
The app uses Amazon Cognito with:
- Email-based authentication
- Optional OAuth (Google, GitHub)
- Optional MFA
- User Pool located in `ap-south-1`

### OAuth Setup (Optional)
To enable Google/GitHub login:

1. **Google OAuth**
   - Create OAuth credentials in Google Cloud Console
   - Add URLs to Cognito User Pool > App Integration > App Client Settings

2. **GitHub OAuth**
   - Create OAuth app in GitHub Settings
   - Add URLs to Cognito User Pool > App Integration > App Client Settings

## 📊 Database Schema

The application uses AWS DynamoDB with the following models:

- **User** - User profiles and preferences
- **Project** - Project management
- **Task** - Task/todo items
- **Comment** - Task and project discussions
- **Attachment** - File uploads
- **TimeEntry** - Work time tracking
- **ChatMessage** - Team messages

See `amplify/data/resource.ts` for schema details.

## 🎨 Theme System

The app includes a professional theme system with:
- Light/Dark mode
- Multiple color schemes
- Custom CSS variables
- Tailwind CSS integration

Toggle theme in the app header or settings.

## 🧪 Code Quality

### TypeScript
- Strict mode enabled
- Full type safety
- JSDoc comments for public APIs

### ESLint
- Strict configuration
- Zero warnings policy
- TypeScript plugin enabled
- React hooks validation

### Build
- TypeScript compilation check before build
- Tree shaking for unused code
- CSS minification
- JavaScript minification

## 📦 Dependencies

### Core
- **react** 18.3.1 - UI framework
- **react-router-dom** 6.28.0 - Routing
- **zustand** 5.0.12 - State management

### AWS
- **aws-amplify** 6.15.10 - AWS SDK
- **@aws-amplify/backend** 1.19.0 - Backend
- **@aws-amplify/ui-react** 6.13.2 - UI components

### UI & Styling
- **tailwindcss** 4.2.4 - Styling
- **framer-motion** 10.18.0 - Animations
- **lucide-react** 0.453.0 - Icons
- **react-hook-form** 7.74.0 - Forms
- **zod** 3.25.17 - Schema validation

### Utilities
- **date-fns** 3.6.0 - Date handling
- **recharts** 2.15.4 - Charts
- **socket.io-client** 4.7.5 - WebSocket
- **yjs** 13.6.15 - CRDT library

See `package.json` for complete list.

## 🚨 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm ci
npm run build
```

### Development Server Issues
```bash
# Kill any existing Vite processes
# Restart development server
npm run dev
```

### AWS Amplify Issues
- Verify AWS credentials
- Check region configuration
- Review Amplify Console logs
- See [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [AWS Amplify Docs](https://docs.amplify.aws)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📋 Code of Conduct

Please review our [Code of Conduct](./CODE_OF_CONDUCT.md) for community guidelines.

## 🔒 Security

For security issues, please email security@example.com instead of using the issue tracker.

See [SECURITY.md](./SECURITY.md) for more information.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 🙌 Acknowledgments

- AWS Amplify team for the excellent backend framework
- React community for the amazing ecosystem
- Tailwind CSS for the utility-first styling approach
- All contributors who have helped with this project

## 📞 Support

- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: GitHub Issues
- **AWS Support**: [AWS Support Console](https://console.aws.amazon.com/support)

## 🗺️ Roadmap

- [ ] AI-powered task suggestions
- [ ] Advanced reporting & analytics
- [ ] Mobile app (React Native)
- [ ] Slack integration
- [ ] Jira integration
- [ ] Custom workflows
- [ ] Team billing
- [ ] Advanced security features

---

**Made with ❤️ for productive teams**

Last Updated: April 29, 2026


