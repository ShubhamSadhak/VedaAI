# VedaAI — AI-Powered Educator Dashboard & Analytics Suite

VedaAI is an elegant, enterprise-ready full-stack educator automation engine and curriculum constructor custom-tailored for CBSE and global schools. The portal helps teachers instantly formulate high-quality lesson matrices, align study standards, compile rubric matrices, and manage real-time active pedagogical flows.

---

## 🏗️ Architecture Overview

VedaAI leverages a state-of-the-art distributed web architecture to split heavy generative workloads from the primary presentation layer. Below is the blueprint of the enterprise production design using your designated data tech stack:

```
                            ┌──────────────────────────────────────┐
                            │      Next.js + TypeScript SPA        │
                            │      (Tailwind / Motion / Lucide)    │
                            └───────┬──────────────────────▲───────┘
                                    │                      │
                          HTTP APIs │                      │ WebSockets (WS)
                      (Payload/Auth)│                      │ (Real-time events)
                                    ▼                      │
                            ┌──────────────────────────────┴───────┐
                            │    Node.js + Express API Server      │
                            │        (Central Control Node)        │
                            └───────┬──────────────────────▲───────┘
                                    │                      │
                     Enqueue Task   │                      │ Poll / Process
                     (JSON Payload) │                      │ Event Cycles
                                    ▼                      │
                        ┌──────────────────────┐   ┌───────┴───────┐
                        │        BullMQ        │──▶│     Redis     │
                        │    (Job Queue RX)    │   │ (Memory/State)│
                        └───────────┬──────────┘   └───────────────┘
                                    │
                                    ▼
                        ┌──────────────────────┐
                        │   Asynchronous Node  │
                        │   Worker / Generator │
                        └───────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
               ┌──────────────────┐  ┌──────────────────┐
               │   MongoDB Atlas  │  │    Gemini API    │
               │  (Primary Store) │  │  (Cognitive AI)  │
               └──────────────────┘  └──────────────────┘
```

### 1. Frontend: Next.js + TypeScript (Zustand & WebSockets)
*   **Next.js & TypeScript:** Establishes compile-time type-safety for educational parameters (e.g., matching evaluation types, specific rubrics, grade boundaries, and school demographics).
*   **State Management (Zustand / Redux):**
    *   **Zustand** is selected as the lightweight, non-boilerplate reactive store for tracking live active workloads, managing selected assignment tabs, and storing school-specific configurations (Delhi Public School, Bokaro Steel City model).
    *   **Redux Toolkit** is fully supported as an alternative for global, multi-layered state requirements if complex corporate access roles (Super-admin, principal view, teacher workspace) are introduced.
*   **WebSocket Interface:** Spawns a dedicated, persistent full-duplex socket channel. This receives incoming generation status signals so the progress indicators can render smooth, responsive step-by-step visual increments without polling.

---

### 2. Backend: Node.js + Express
*   **API Layer:** Acts as the primary orchestrator. Express handles incoming HTTP requests (auth validation, asset metadata requests, assignment list updates) with modular controller lines.
*   **Middleware:** Manages CORS limits, parses JSON payloads smoothly, and initiates high-speed socket channels mapped directly onto the master HTTP listener.

---

### 3. Distributed Queue Layer: Redis + BullMQ
*   **BullMQ (Distributed Job Queue):**
    *   To keep the main web process highly responsive under heavy traffic, generation jobs are offloaded to **BullMQ**.
    *   Each generation task forms a separate BullMQ job state, keeping track of retries, timeouts, and multi-stage status indicators.
*   **Redis Storage Cache:**
    *   Serves as the high-speed backend data store for **BullMQ**.
    *   Tracks fast-changing event queues, caches popular study templates, handles web session keys, and records active WebSocket client subscription keys.

---

### 4. Persistence Layer: MongoDB (Atlas)
*   **MongoDB:**
    *   Utilized as the schema-flexible document-oriented database.
    *   Documents assignments, rubrics, school profiles, and teacher accounts.
    *   A sample record structured in Mongo:
        ```json
        {
          "_id": "64593fcc158bfbb98d4aef12",
          "title": "Quantum Physics & Wave Mechanics Assignment",
          "subject": "Physics",
          "classSection": "Grade XII - CBSE Science",
          "questions": [
            { "type": "MCQ", "text": "What is the de Broglie wavelength formula?", "points": 1 },
            { "type": "Short Answer", "text": "State Heisenberg's Uncertainty Principle.", "points": 3 }
          ],
          "rubrics": {
            "critical_thinking": ["Excellent conceptual grasp...", "Partial understanding..."],
            "mathematical_rigor": ["Errors in derivation steps...", "Absolute alignment..."]
          },
          "school": "Delhi Public School, Bokaro Steel City",
          "createdAt": "2026-05-27T08:35:00Z"
        }
        ```

---

## 🧠 Functional Approach

1.  **Strict Isolation of AI Tasks (Non-blocking UI):** 
    Unlike simple prototypes that freeze the client thread, VedaAI processes and structures drafts as non-blocking background threads. When the teacher clicks **"Create Assignment"**, the main Express route registers the schema target in **MongoDB**, pushes the task to **BullMQ**, and returns `202 Accepted` immediately.
2.  **State-Authoritative Event Worker:**
    The workspace worker picks the job from **BullMQ**, executes the complex generative cycles using the server-secure Google Gemini model SDK, writes the finished content directly back to **MongoDB**, and broadcasts the active success event to the user's browser via **WebSockets**.
3.  **CBSE Curricular Calibration:**
    The core generation prompt pipelines integrate standard evaluation guidelines, mapping questions according to Remembering, Understanding, Applying, Analyzing, and Evaluating (Bloom's Taxonomy) criteria.

---

## 🚀 How to Run & Deploy (Production Instructions)

Follow these clear directives to deploy your application to platforms like **Render**, **Heroku**, **AWS**, or **Docker/Kubernetes containers**.

### 🔌 Required Production Environment Variables
Configure these coordinates on your hosting provider prior to turning on your container:
```env
PORT=3000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/vedaai_db
REDIS_URL=redis://:authpassword@redis-server-endpoint:6379
GEMINI_API_KEY=AIzaSy...Your_Gemini_Secure_Key
```

---

### Method A: Build and Run on Render or Heroku (Direct Web Services)

This environment is optimized for hosted Node.js processes connected to managed Redis and MongoDB databases.

1.  **Build Command:**
    ```bash
    npm install; npm run build
    ```
2.  **Start Command:**
    ```bash
    npm run start
    ```
3.  Ensure your environment variables are carefully declared in the **Render / Heroku Environmental Settings UI**.

---

### Method B: Containerized Docker Deployment (Recommended for AWS ECS / Cloud Run / GCP)

Write a simple configuration using this optimized container model:

```dockerfile
# Use a secure, small Node image
FROM node:22-alpine

WORKDIR /app

# Install standard packages
COPY package*.json ./
RUN npm ci

# Copy sources and trigger compilations
COPY . .
RUN npm run build

# Strip dev-dependencies to save container payload size
RUN npm prune --production

ENV NODE_ENV=production
EXPOSE 3000

# Start server node from compiled common JS source
CMD ["npm", "start"]
```

Build and run your container image online:
```bash
docker build -t vedaai-app:latest .
docker run -p 3000:3000 \
  -e MONGO_URI="mongodb://localhost:27017/veda" \
  -e REDIS_URL="redis://localhost:6379" \
  -e GEMINI_API_KEY="AIzaSy..." \
  vedaai-app:latest
```
