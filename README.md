# 🚀 Real-Time Collaborative Code Editor

<div align="center">

## ⚡ Scalable Real-Time Collaborative Coding Platform

A browser-based collaborative code editor where multiple users can code together simultaneously in real time.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Partykit](https://img.shields.io/badge/PartyKit-FF4D4D?style=for-the-badge)
![WebSockets](https://img.shields.io/badge/WebSockets-000000?style=for-the-badge&logo=socketdotio&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)

</div>

---

# 📌 Problem Statement

## Scalable Real-Time Collaborative Code Editor

Create a browser-based collaborative code editor where multiple users can type simultaneously.

### Requirements

- Implement **WebSockets** for real-time communication
- Use **TypeScript** and **React**
- Handle concurrent edits using:
  - **Operational Transformation (OT)** or
  - **CRDTs (Conflict-Free Replicated Data Types)**
- Include a **basic syntax highlighter**
- Ensure scalability and smooth collaboration

---

# ✨ Overview

This project is a modern collaborative coding platform inspired by professional tools like VS Code Live Share and CodeSandbox.

The editor uses **PartyKit** for scalable real-time WebSocket communication and collaborative synchronization between connected users.

Users can:
- 👨‍💻 Write code together in real time
- ⚡ See live updates instantly
- 🔄 Synchronize edits without conflicts
- 🎨 Experience syntax highlighting
- 🌐 Collaborate directly from the browser

---

# 💡 Why We Built This

Modern development teams collaborate remotely more than ever, but existing tools are often fragmented, complex, or not optimized for real-time coding workflows.

We wanted to build a lightweight, scalable, and intelligent collaborative coding platform focused on synchronization, developer experience, and seamless teamwork.

---

# 🔥 Features

- ⚡ Real-time collaborative editing
- ⚡ Low latency realtime synchronization
- 👥 Multi-user support
- 🧠 AI-powered code quality suggestions
- 🖱️ Live cursor tracking
- 🔌 PartyKit + WebSocket communication
- 🧠 OT/CRDT-based conflict resolution
- 🎨 Syntax highlighting
- 🖥️ Modern IDE-style UI
- 📁 Sidebar and editor layout
- 🌙 Clean light theme
- 📱 Responsive design

---

# 🎥 Demo
<img width="1140" height="518" alt="Untitled design" src="https://github.com/user-attachments/assets/e56ea81e-6913-4739-99fe-b6cbc6e5cb02" />

---

# 📸 Screenshots
## Landing Page
<img width="1613" height="859" alt="Screenshot 2026-05-14 215528" src="https://github.com/user-attachments/assets/e3bb094a-666b-47cb-a215-7f3760a37fbe" />

## Collaborative editing
<img width="1919" height="792" alt="Screenshot 2026-05-14 220017" src="https://github.com/user-attachments/assets/24260e88-ab19-4428-bcba-bd9d0958191d" />

## AI Suggestions
<img width="1919" height="861" alt="Screenshot 2026-05-14 220221" src="https://github.com/user-attachments/assets/645eca28-3983-436d-a48b-03bda7f5a7ac" />

---
# 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React | Frontend UI |
| TypeScript | Type Safety |
| Next.js | Framework |
| PartyKit | Real-Time Infrastructure |
| WebSockets | Live Communication |
| Tailwind CSS | Styling |
| ShadCN UI | UI Components |
| CodeMirror Editor | Code Editor |
| Node.js | Backend Runtime |

---

# 🧠 Architecture

```text
          ┌──────────────────┐
          │    Client A      │
          └────────┬─────────┘
                   │
                   │ PartyKit WebSocket
                   │
          ┌────────▼─────────┐
          │    PartyKit      │
          │      Server      │
          └────────┬─────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────┐   ┌────────▼───────┐
│    Client B     │   │    Client C    │
└─────────────────┘   └────────────────┘
```

---

# ⚙️ How It Works

1. Users join a collaborative coding room
2. PartyKit establishes persistent WebSocket connections
3. Code changes are broadcast instantly to all clients
4. OT/CRDT algorithms resolve concurrent editing conflicts
5. Every connected user stays synchronized in real time

---

# 🚀 Future Enhancements

- 🎥 Voice/video collaboration
- ☁️ Cloud project storage
- 🔐 Authentication system
- 💻 Multi-language code execution
- 📂 Shared terminal support

---

# 📂 Folder Structure

```bash
realtime-code-editor/
│
├── app/
├── components/
├── hooks/
├── lib/
├── partykit/
├── public/
├── styles/
└── package.json
```

---

# 🧪 Installation

```bash
# Clone repository
git clone https://github.com/Ganesh07A/realtime-code-editor.git

# Navigate into project
cd realtime-code-editor

# Install dependencies
npm install

# Run development server
npm run dev
```

---

# 🎯 Goals

- Learn scalable real-time systems
- Explore distributed synchronization
- Understand OT & CRDT architectures
- Build professional collaborative developer tools
- Improve frontend and backend architecture skills

---

# 📜 License

Built as a hackathon project focused on scalable collaborative systems and intelligent developer tooling.

---

<div align="center">

# 👨‍💻 Team SHRIVOX

Built during the hackathon by passionate developers focused on real-time systems and collaborative developer tools.

</div>
