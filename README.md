
# Wecycle Development Environment Setup

This document outlines the steps to set up the development environment for Wecycle, including installing Node.js, running the development servers, and accessing the admin portal.

---

## Prerequisite

Before proceeding with the installation, ensure that the following prerequisites are met:

1. **Node.js (^18.16.0)**: Verify installation with `node -v`.
2. **npm (Node Package Manager)**: Verify installation with `npm -v`.
3. **Nx CLI (Optional)**: Install globally using `npm install -g nx`.

---


## Step 1: Install Node Modules

Once Node.js and Nx CLI are installed, navigate to the root directory of the project and install the necessary node modules:

```bash
npm install
```

This will install all the dependencies required for the project.

---

## Step 2: Running the Development Servers

Now that all dependencies are installed, you can run the development servers for the web, admin, and API services. Use the following commands in separate terminals for each service.

### Web Server

To start the development server for the Wecycle web app, run:

```bash
npx nx run wecycle-web:serve --configuration=development
```

### Admin Server

To start the development server for the Wecycle admin portal, run:

```bash
npx nx run wecycle-admin:serve --configuration=development
```

### API Server

To start the development server for the Wecycle API, run:

```bash
npx nx run wecycle-api:serve --configuration=development
```

---

## Step 3: Admin Portal Credentials

Once the admin server is running, you can log in to the admin portal using the following credentials:

- **Username**: `dev@getwecycle.com`
- **Password**: `123456789`

Make sure to change the password for production use.

---

## Conclusion

Now, you should have all three services (web, admin, and API) running in development mode. You can access each service on their respective URLs, and manage the system through the admin portal.
