# Vercel Deployment Guide

This guide explains how to deploy the MERN Ticketing System to Vercel's Free Tier using our hybrid approach.

## Prerequisites

1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
2.  **MongoDB Atlas**: Create a free Cluster at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas).
    *   **Network Access**: Allow access from anywhere (`0.0.0.0/0`) since Vercel IPs are dynamic.
    *   **Get Connection String**: Drivers -> Node.js -> Copy connection string (SRV).
        *   Example: `mongodb+srv://user:pass@cluster0.abcde.mongodb.net/ticketing?retryWrites=true&w=majority`
3.  **Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com/).
    *   From Dashboard, copy: `Cloud Name`, `API Key`, `API Secret`.

## Setup Steps

### 1. Push to GitHub/GitLab
Ensure your latest code (including `vercel.json`) is pushed to your git repository.

### 2. Import Project in Vercel
1.  Go to Vercel Dashboard -> **Add New...** -> **Project**.
2.  Select your repository.
3.  **Framework Preset**: Select `Vite` (it should auto-detect).
4.  **Root Directory**: Keep as `./` (Root).

### 3. Configure Environment Variables
Expand the **Environment Variables** section and add the following:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Recommended for prod. |
| `MONGO_URI` | `mongodb+srv://...` | Your Atlas connection string. |
| `JWT_SECRET` | `some_secure_string` | Secret for tokens. |
| `STORAGE_PROVIDER` | `cloudinary` | Tells backend to use Cloudinary. |
| `CLOUDINARY_CLOUD_NAME` | `...` | From Cloudinary Dashboard. |
| `CLOUDINARY_API_KEY` | `...` | From Cloudinary Dashboard. |
| `CLOUDINARY_API_SECRET` | `...` | From Cloudinary Dashboard. |

### 4. Deploy
Click **Deploy**.
*   Vercel will build the frontend (Vite).
*   Vercel will build the backend (Serverless Functions).

### 5. Verification
Once deployed, visit the URL.
*   **Test Login/Register**: Should work (data saved to Atlas).
*   **upload Ticket**: Create a ticket with an attachment. It should save to Cloudinary and return successfully.

## Troubleshooting

*   **Database Error**: Check `MONGO_URI` in Vercel env vars. Ensure "Network Access" in Atlas allows `0.0.0.0/0`.
*   **Upload Error**: Check Cloudinary keys. Ensure `STORAGE_PROVIDER` is exactly `cloudinary`.
