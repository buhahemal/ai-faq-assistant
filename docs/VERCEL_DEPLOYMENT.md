# AI FAQ Assistant - Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the AI FAQ Assistant to [Vercel](https://vercel.com). Vercel is a cloud platform for static sites and Serverless Functions that fits this project's structure well.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
  - [1. `vercel.json` File](#1-verceljson-file)
  - [2. Update `package.json`](#2-update-packagejson)
- [Deployment Steps](#deployment-steps)
  - [Step 1: Install Vercel CLI](#step-1-install-vercel-cli)
  - [Step 2: Log in to Vercel](#step-2-log-in-to-vercel)
  - [Step 3: Set Environment Variables](#step-3-set-environment-variables)
  - [Step 4: Deploy](#step-4-deploy)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

- A [Vercel account](https://vercel.com/signup).
- [Node.js](https://nodejs.org/) installed on your local machine.

## ⚙️ Configuration

To ensure Vercel can correctly build and run our Express.js application, we need to make two small configurations.

### 1. `vercel.json` File

We have already created a `vercel.json` file. **It is located in the `deployment/` directory.** This file tells Vercel how to handle the project.

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
```

- **`builds`**: This tells Vercel that our `src/server.js` file is a Node.js serverless function.
- **`routes`**: This rewrites all incoming requests (`/(.*)`) to our `server.js` file, allowing our Express router to handle them.

When deploying, Vercel will automatically detect and use the `deployment/vercel.json` file.

### 2. Update `package.json`

Vercel automatically runs the `start` script after a successful build. Ensure your `package.json` has the correct start script.

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

No changes are needed here as our `start` script is already correct.

## 🚀 Deployment Steps

### Step 1: Install Vercel CLI

First, install the Vercel command-line interface (CLI) globally on your machine.

```bash
npm install -g vercel
```

### Step 2: Log in to Vercel

Log in to your Vercel account through the CLI.

```bash
vercel login
```

### Step 3: Set Environment Variables

Our application uses environment variables defined in `.env`. Vercel doesn't use the `.env` file directly. You need to add them to your Vercel project settings.

You can do this in two ways:

#### A) Using the Vercel CLI

For each variable in your `.env` or `env.example` file, run the following command. Replace `KEY` and `value` with the variable name and its value.

```bash
vercel env add KEY value
```

Example:
```bash
vercel env add PORT 3000
vercel env add NODE_ENV production
```

#### B) Using the Vercel Dashboard

1. After your first deployment, go to your project on the Vercel dashboard.
2. Navigate to the **Settings** tab.
3. Click on **Environment Variables**.
4. Add each key-value pair from your `.env` file.

**Important**: The model files from `@xenova/transformers` are downloaded and cached at runtime. Vercel's serverless functions have a temporary filesystem (`/tmp`). The model will be re-downloaded on cold starts, which may slightly increase response time for the first request.

### Step 4: Deploy

Navigate to the project's root directory in your terminal and run the deploy command.

```bash
vercel --prod
```

The Vercel CLI will guide you through the rest of the process, including setting the project name and scope. Once finished, it will provide you with the public URL for your deployed application.

That's it! Your AI FAQ Assistant should now be live on Vercel.

## 🛠️ Troubleshooting

- **502 Bad Gateway Error**: This often means the server crashed. Check the logs for your deployment in the Vercel dashboard under the **Logs** tab to diagnose the error. It's often related to a missing environment variable.
- **Cold Starts**: The first request to a new serverless instance might be slower because the environment and the AI model need to be initialized. This is normal for serverless platforms. Subsequent requests will be much faster.
- **File System**: Remember that Vercel's serverless environment has a read-only file system, except for the `/tmp` directory. Our app is designed to work with this, but it's a key consideration if you add features that write to disk. The `save-data` endpoint will not work as expected. 