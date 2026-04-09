#  Browser Request Lifecycle Emulator

> A real-time visual simulation of everything that happens when you type a URL and press Enter.

---

##  What is this project?

This is a React application that simulates the full journey of a browser request — from the initial DNS lookup all the way until the page is fully rendered on screen.

Every step animates in real-time and displays:
-  Exact timing in milliseconds
-  Full technical details per step
-  A live network log

---

##  Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open your browser at
http://localhost:5173
```

---

##  The 7 Steps Simulated

| # | Step | Timing | What happens |
|---|------|--------|--------------|
| 1 | **DNS Lookup** | `0–45ms` | Translates the domain name into an IP address via DNS resolvers |
| 2 | **TCP Handshake** | `45–75ms` | Establishes a reliable connection: SYN → SYN-ACK → ACK |
| 3 | **TLS Handshake** | `75–130ms` | Encrypts the connection using TLS 1.3 and AES-256-GCM |
| 4 | **HTTP Request** | `130–210ms` | Sends GET / HTTP/2 and receives 200 OK with the HTML body |
| 5 | **Parse HTML / DOM** | `210–270ms` | Builds the DOM tree, discovers sub-resources, fires DOMContentLoaded |
| 6 | **Fetch Assets** | `270–390ms` | Downloads CSS, JS, images and fonts in parallel over HTTP/2 |
| 7 | **Render Pipeline** | `390–430ms` | Layout → Paint → Composite → frame appears on screen |

---

##  Project Structure

```
browser-emulator/
├── src/
│   ├── App.jsx          ← All logic and UI (single file)
│   ├── main.jsx         ← Entry point
│   └── index.css        ← Global styles
├── public/
├── package.json
├── vite.config.js
└── README.md
```

---

##  How App.jsx Works

### `steps[]` — Simulation data
An array that defines all 7 steps with their timing, description, colors, technical details, and log lines.

### `runSim()` — The main engine
Fires two `setTimeout` calls per step:
- **First:** when the step starts → sets state to `running` 
- **Second:** when the step ends → sets state to `done` 

React re-renders automatically on every state change, driving the animation.

### State Overview

| State | Purpose |
|-------|---------|
| `stepStates` | Tracks each step: `idle / running / done` |
| `activeSteps` | Controls whether step details are expanded |
| `barActive` | Triggers the progress bar fill animation |
| `logLines` | Accumulates live network log entries |
| `metrics` | Updates the 4 metric cards at the top |

---

##  Tech Stack

| Tool | Usage |
|------|-------|
| **React 18** | UI and state management |
| **Vite** | Dev server and build tool |
| **Inline CSS** | Styling with no external libraries |

---

##  Customization

All simulation data lives in the `steps` array at the top of `App.jsx`:

```jsx
{
  id: "dns",
  name: "DNS Lookup",
  dur: 45,          // duration in ms
  color: "#7F77DD", // progress bar color
  desc: "...",      // description shown when step activates
  details: [...],   // technical detail grid
  logLines: [...],  // log entries added to the network log
}
```

To speed up or slow down the entire animation:

```jsx
const SPEED = 4; // lower = faster, higher = slower
```

---

##  Author

**Bashar abu al arayes** ([@bashar](https://github.com/bashar)) — Built as an educational tool to understand how browsers work under the hood.
