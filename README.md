# Browser Architecture Emulator  (Technical Deep-Dive)

A high-fidelity browser engine emulator built with **React 19** and **Vite**. This tool provides a step-by-step, real-time visualization of the **Critical Rendering Path** and the **OSI Model Layers** involved in a web request.

##  Project Scope (The "In-Depth" Process)
This emulator doesn't just show text; it simulates the internal mechanics of a browser:

1. **DNS Resolution (Layer 7):** Real-time fetching of **A Records**, **IP Addresses**, and **TTL** values using the Google DNS API.
2. **TCP Handshake (Layer 4):** Visualizing the `SYN` -> `SYN-ACK` -> `ACK` three-way handshake protocol.
3. **SSL/TLS Negotiation:** Simulating secure handshakes, cipher suites (AES_256_GCM), and TLS 1.3 protocols.
4. **HTTP Lifecycle:** Emulating the Request/Response cycle, including **H2 (HTTP/2)** protocols, Status Codes (200 OK), and headers.
5. **Rendering Engine (The Critical Path):** Detailed breakdown of parsing HTML into **DOM Nodes**, calculating **Layout (Reflow)**, and **Rasterizing (Painting)** pixels.

##  Technical Highlights
- **Asynchronous Execution:** Built using a custom async event-loop to mimic network latency.
- **Real Data Integration:** Live API calls to ensure the DNS phase is 100% accurate.
- **State Management:** Efficient UI updates using React 19 hooks for a seamless "pulse" animation during processing.
- **Minimalist UX:** A clean, professional white-label interface focusing on data accuracy.

##  Installation & Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
