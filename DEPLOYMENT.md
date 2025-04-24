# Deployment Guide for Claro Noire LMS

This guide provides instructions for deploying the Claro Noire LMS application to production environments.

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- A Supabase account and project
- Environment variables configured (see below)

## Environment Variables

Ensure the following environment variables are set in your deployment environment:

\`\`\`env
# Application URLs
APP_URL=https://your-domain.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Database Configuration
DATABASE_URL=your_database_url_here

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_anon_public_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret_key_here
SUPABASE_JWT_SECRET=your_jwt_secret_here

# Security
ENCRYPTION_KEY=a_long_random_string_at_least_32_characters
ENCRYPTION_IV=a_16_char_string
SECURITY_WEBHOOK_URL=your_security_webhook_url_here

# Session
SESSION_SECRET=a_long_random_string_at_least_32_characters
\`\`\`

## Deployment Steps

1. **Run the deployment check script**

   \`\`\`bash
   npx tsx scripts/deployment-check.ts
   \`\`\`

   Fix any issues reported by the script before proceeding.

2. **Build the application**

   \`\`\`bash
   npm run build
   \`\`\`

3. **Start the application**

   \`\`\`bash
   npm start
   \`\`\`

## Vercel Deployment

For Vercel deployments:

1. Connect your GitHub repository to Vercel
2. Configure the environment variables in the Vercel dashboard
3. Deploy the application

## Common Deployment Issues

### React Version Compatibility

Ensure you're using React 18.2.0 or later, but avoid experimental versions like 18.3.0 which may contain unstable features.

### Experimental React Features

Avoid using experimental React features like `useEffectEvent` which may not be supported in production environments.

### Database Initialization

Make sure to initialize the database before deploying. Use the admin dashboard to run the database initialization scripts.

### Security Headers

The application includes security headers in the middleware. Ensure these are properly configured for your production environment.

## Monitoring and Troubleshooting

- Check the `/debug` page for runtime information
- Review server logs for any errors
- Monitor the security logs for suspicious activity
\`\`\`

Let's create a simple script to check for any other potential issues:
