# 🚀 MNNIT Athletics Club (MAC) Backend Deployment Guide

This guide provides step-by-step instructions on how to deploy the **MAC Server** to **Render.com**. 

---

## 🛠️ Option 1: Automated Deployment using Render Blueprints (Recommended)

Render Blueprints allow you to deploy the server automatically using the predefined [render.yaml](file:///Users/vivekkumar/mnnit_athletics_club/render.yaml) file at the root of the repository. This is the fastest and most secure method.

### Steps to Deploy:
1. Sign up or log into [Render.com](https://render.com/).
2. In the Render Dashboard, click the **New +** button in the top-right corner and select **Blueprint**.
3. Connect your GitHub repository containing the MAC codebase.
4. Render will automatically parse [render.yaml](file:///Users/vivekkumar/mnnit_athletics_club/render.yaml) and prompt you for the required environment variables.
5. Provide the configuration values (see the [Environment Variables Setup](#-environment-variables-setup) section below).
6. Click **Apply** to start the deployment.

---

## 📝 Option 2: Manual Deployment on Render

If you prefer to configure the service manually on the Render Dashboard:

1. Click **New +** and select **Web Service**.
2. Connect your GitHub repository.
3. Configure the service with the following details:
   - **Name**: `mnnit-athletics-club-server`
   - **Language**: `Node`
   - **Branch**: `main` or `dev` (depending on your default branch)
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Expand the **Advanced** section to add the Environment Variables manually (see below).
5. Click **Create Web Service**.

---

## 🔑 Environment Variables Setup

Whether using Blueprints or Manual deployment, you must supply the following environment variables to Render:

| Variable Name | Required? | Source & Description |
| :--- | :--- | :--- |
| `PORT` | Yes (Auto) | Set to `10000` (Render's default port; handled automatically by Blueprints). |
| `MONGO_URI` | **Yes** | Your MongoDB connection string. We recommend a free **MongoDB Atlas** cluster. |
| `JWT_SECRET` | Yes (Auto) | Secret key for signing JSON Web Tokens. Auto-generated securely by the Blueprint! |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | Cloudinary Cloud Name (for storing event and achievements images). |
| `CLOUDINARY_API_KEY` | **Yes** | Cloudinary API Key. |
| `CLOUDINARY_API_SECRET` | **Yes** | Cloudinary API Secret. |
| `SMTP_HOST` | Yes | SMTP Host for email delivery. Defaults to `smtp.gmail.com`. |
| `SMTP_PORT` | Yes | SMTP Port. Defaults to `587`. |
| `SMTP_USER` | **Yes** | Your SMTP email address (e.g., `your_email@gmail.com`). |
| `SMTP_PASS` | **Yes** | SMTP Password. If using Gmail, this **must** be an **App Password** (not your login password). |
| `MAIL_FROM` | **Yes** | The sender name and email in standard format: `MAC MNNIT <your_email@gmail.com>`. |
| `CLIENT_URL` | **Yes** | The production URL of your deployed Vite frontend (e.g., `https://mnnit-athletics.vercel.app`). |

---

## 🎒 How to Set Up External Services

### 1. MongoDB Database (MongoDB Atlas)
1. Register a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster and choose the **M0 Free Tier**.
3. Under **Network Access**, add `0.0.0.0/0` to allow connections from Render.
4. Under **Database Access**, create a user with a secure password.
5. Click **Connect** > **Drivers** > Select **Node.js** to get your connection string. It will look like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mac_db?retryWrites=true&w=majority`
6. Replace `<username>` and `<password>` with your database user credentials.

### 2. Cloudinary (Image Hosting)
1. Sign up for a free account at [Cloudinary](https://cloudinary.com/).
2. On your Cloudinary Dashboard, copy your **Cloud Name**, **API Key**, and **API Secret**.
3. Paste these values into the corresponding variables on Render.

### 3. SMTP & Gmail App Password
1. Go to your Google Account settings -> Security.
2. Ensure **2-Step Verification** is enabled.
3. Search for **App Passwords** in the search bar.
4. Select app: *Other (Custom name)*, name it `MAC Server`, and click *Generate*.
5. Copy the 16-character code generated and use it as `SMTP_PASS`.

---

## 🌐 Linking the Vite Frontend (Client)

Once your Render Web Service is successfully deployed, it will be assigned a URL like:
`https://mnnit-athletics-club-server.onrender.com`

You must connect the frontend to this live backend URL:

1. Locate the `client` directory in this project.
2. Edit or create the `.env` file inside the `client` folder.
3. Set the `VITE_API_URL` to point to your new backend server API:
   ```env
   VITE_API_URL=https://mnnit-athletics-club-server.onrender.com/api/v1
   ```
4. Build and deploy your Vite client (e.g., to Vercel, Netlify, or Render static site) using this environment variable.

---

## 🔍 Verification & Health Check

After deployment completes:
- Visit `https://mnnit-athletics-club-server.onrender.com/api/health` in your browser.
- It should return:
  ```json
  {
    "status": "ok",
    "message": "MAC Server is running"
  }
  ```
- Check the **Logs** tab in Render dashboard to ensure MongoDB successfully connected (`MongoDB Connected` message) and that no runtime errors occurred.
