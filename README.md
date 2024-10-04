
# Wecycle Development Environment Setup

This document outlines the steps to set up the development environment for Wecycle, including installing Node.js, running the development servers, and accessing the admin portal.

---

## Prerequisite

Before proceeding with the installation, ensure that the following prerequisites are met:

1. **Node.js**: Make sure you have Node.js installed on your machine. You can download the latest version of Node.js [here](https://nodejs.org/).
   
   To verify the installation, run the following command in your terminal:
   ```bash
   node -v
   ```

   You should see the installed version of Node.js.

2. **npm (Node Package Manager)**: npm is installed automatically with Node.js. Verify it by running:
   ```bash
   npm -v
   ```

3. **Nx CLI**: Nx is a smart, fast, and extensible build system with first-class monorepo support. You need it installed globally to run the development commands.
   
   To install Nx CLI, run the following command:
   ```bash
   npm install -g nx
   ```

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
