# VedaAI — AI-Powered Educator Dashboard

VedaAI is an elegant, full-stack educator automation suite and curriculum generator designed specifically for CBSE and international curricula, as featured here with a high-contrast custom layout customized for **Delhi Public School, Bokaro Steel City**.

It assists teachers in drafting high-quality assignments, generating CBSE-aligned evaluation rubrics, structuring syllabus lesson plans, and retrieving active automated pedagogical feedback in real-time.

---

## 🏗️ Architecture Overview

VedaAI implements a **Full-Stack Mono-Repo Architecture** combining a snappy client-side interface with a fast, Event-driven Express + WebSocket background compilation worker.

```
                  ┌──────────────────────┐
                  │   React client SPA   │
                  │   (Vite / Tailwind)  │
                  └──────────┬───────────┘
                             │
               HTTP APIs     │   WebSockets (WS)
              (JSON payload) │   (Real-time State / Progress)
                             ▼
                  ┌──────────────────────┐
                  │    Express Server    │
                  │     (server.ts)      │
                  └─────┬──────────┬─────┘
                        │          │
         Gemini API     │          │  Local FS Write
     (@google/genai v2) │          │  (JSON Db Engine)
                        ▼          ▼
                  ┌──────────┐  ┌──────────┐
                  │  Gemini  │  │  data/   │
                  │ Models   │  │  Store   │
                  └──────────┘  └──────────┘
```

### 1. Front-End Architecture
- **Framework & Build System:** React 19 bootstrapped with Vite for instant builds and super high performance.
- **State Management:** **Zustand** is utilized for reactive, light-weight local state holding lists of curated assignments, active wizards, and toolkit prompts.
- **Micro-Animations:** Driven via **Motion** (`motion/react`) to build fluid, physical slide-ins, and high-contrast tab state transitions.
- **Visual Design System:** Adheres to mobile-first container constraints, featuring deep charcoal displays, warm peach or glowing sunset-gradient button controls, and a detailed monkey mascot for a personalized touch.

### 2. Back-End Server Architecture
- **Framework & Socket Layer:** Serves via **Express** coupled with a secondary native **WebSocket** server (`ws`) mapped on top of a unified HTTP socket on port `3000`.
- **Database Engine:** Uses a lightweight JSON file database (`/data/assignments.json`) handled by `server/db.ts` to seamlessly write and preserve user creations without memory leak risks.
- **Task & Generation Pipeline:** An event-driven memory queue (`server/queue.ts`) runs multi-threaded compilations and streams step-by-step progress metrics (such as "In queue", "Designing question matrices", "CBSE evaluation alignment") back to the client over WS.

### 3. Google Gemini Integration
- **Client Library:** Employs the official modern `@google/genai` TypeScript SDK on the server-side to guarantee that API keys remain hidden from the browser.
- **Robust Fallback Engine:** If no `GEMINI_API_KEY` is declared, the server automatically switches to elegant static curated outlines mimicking high-fidelity curricular blueprints (CBSE syllabus, CBSE lesson matrices, 10-Question bank, rubrics) so that offline evaluation or demonstration is unbroken.

---

## 🎯 Approach

1. **Craftsmanship over Design Defaults:** Rather than introducing purple-heavy pre-configured templates, the UI centers around custom cards, standard charcoal UI elements (`#1c1c1e`), and highly polished icons imported from `lucide-react`.
2. **Pedagogical Relevance:** Built intentionally for teachers. The Create Assignment form breaks out structure parameters into question quantities (`Multiple Choice`, `Short Answer`, `Long Essay`), CBSE standard rubrics, and grade boundaries rather than generic unstructured chats.
3. **Native ESM to CommonJS Compiling:** To guarantee optimal server start times regardless of strict module resolution changes on newer Node.js runs, the build system leverages `esbuild` to compile the entire typescript backend down into a single standalone output: `dist/server.cjs`.

---

## 🚀 How to Deploy This Application (Production Guide)

Since VedaAI utilizes a custom Express server handling real-time WebSockets and file writes, it should be deployed to a **stateful or containerized server host** (such as Google Cloud Run, Heroku, AWS ECS, or any VPS like DigitalOcean/AWS EC2) rather than static-only host engines like Vercel or Netlify.

### 🔌 Environment Variables
Define these variables prior to starting your server:
- `PORT` (Defaults to `3000`. Managed internally by network reverse proxies in Docker environments).
- `GEMINI_API_KEY` (Optional. Provide your Google Gemini API key to activate full-fidelity real-time AI creation).

---

### Method A: Deployed on Container Engines (Cloud Run, ECS, Kubernetes)
This is the recommended approach for autoscaling enterprise setups.

1. **Docker File Setup:** Use or create a `Dockerfile` at the root of your project:
   ```dockerfile
   FROM node:22-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm ci

   COPY . .
   RUN npm run build

   ENV NODE_ENV=production
   EXPOSE 3000

   CMD ["npm", "start"]
   ```

2. **Build and Deploy Actions (e.g. Google Cloud Run):**
   ```bash
   # Build the container image
   gcloud builds submit --tag gcr.io/your-project-id/vedaai

   # Deploy to Cloud Run with persistent local-mount or high-speed memory config
   gcloud run deploy vedaai \
     --image gcr.io/your-project-id/vedaai \
     --platform managed \
     --allow-unauthenticated \
     --port 3000 \
     --set-env-vars GEMINI_API_KEY="your-gemini-key-here"
   ```

---

### Method B: Deployed on a Virtual Private Server (VPS / EC2 / DigitalOcean)
For running on basic Ubuntu or Debian systems with continuous process management.

1. **System Dependencies:**
   Ensure Node.js 22 LTS or newer and git is installed on your server.

2. **Clone and Install:**
   ```bash
   git clone https://github.com/your-username/VedaAI.git
   cd VedaAI
   npm install
   ```

3. **Build the Application:**
   This bundles the frontend web files and compiles the Express server:
   ```bash
   npm run build
   ```

4. **Continuous Execution using PM2:**
   Use PM2 to monitor the server, auto-crash-reboot, and preserve active ports.
   ```bash
   # Install PM2 globally
   npm install -g pm2

   # Configure your environment variables
   export GEMINI_API_KEY="AIzaSy..."
   export NODE_ENV="production"

   # Launch server
   pm2 start dist/server.cjs --name "VedaAI-Dashboard"

   # Ensure it boots up on VPS startup
   pm2 startup
   pm2 save
   ```

5. **Nginx Reverse Proxy:**
   Set up Nginx to handle external HTTPS and proxy traffic through to port `3000`:
   ```nginx
   server {
       listen 80;
       server_name vedaai.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

### Method C: Local Deployment
To run VedaAI locally for testing or development:

1. Clone the repository and install dependency packages:
   ```bash
   npm install
   ```
2. Build the applet assets in production terms:
   ```bash
   npm run build
   ```
3. Boot the production server locally:
   ```bash
   npm run start
   ```
4. Access the portal instantly in your browser at `http://localhost:3000`!
