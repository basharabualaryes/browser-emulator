# Browser Engine Emulator 

A professional, real-time browser engine emulator built with **React 19** and **Vite**. This tool analyzes the critical rendering path of any URL, providing a step-by-step breakdown of how modern browsers process web requests.

##  Key Features (Real-time Analysis)
Unlike static diagrams, this emulator performs live operations:
- **Live DNS Resolution:** Fetches real IP addresses using the Google DNS API.
- **Network Simulation:** Mimics the 3-way TCP Handshake and TLS 1.3 negotiation.
- **Rendering Pipeline:** Visualizes the transition from HTML parsing to the final Paint.
- **Latency Emulation:** Uses asynchronous processing to show the time-cost of each phase.

## Tech Stack
- **React 19** (Latest version for optimal performance)
- **Vite** (Next-generation frontend tooling)
- **Google DNS API** (For live domain resolution)
- **Clean UI Design** (Focusing on professional data visualization)

## The Pipeline Breakdown
1. **DNS Lookup:** Resolves the hostname to an IPv4 address.
2. **Connection:** Simulates the TCP connection and secure handshake.
3. **Request/Response:** Emulates the HTTP lifecycle (Headers & Status Codes).
4. **DOM/CSSOM:** Explains the construction of the Document Object Model.
5. **Layout & Paint:** Calculating geometry and rendering pixels.

##  Getting Started
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
