# Browser Request Lifecycle Visualizer (Pro Edition)

An advanced, interactive educational tool built with **React.js** to simulate and visualize the complex journey of a web request—from the moment a URL is entered until the final frame is rendered at 60fps.

---

## Overview
This project provides a deep-dive into browser internals. Unlike simple diagrams, this is a **real-time simulator** that mimics DNS resolution, network handshakes, resource fetching priorities, JavaScript execution pipelines, and the critical rendering path.

##  Key Features

### 1. Real-Time DNS Resolution
* **Live Query:** Uses Google's DNS-over-HTTPS (DoH) to fetch actual IP addresses for any hostname entered.
* **Resolution Chain:** Visualizes the hop-by-hop process (Browser Cache → OS → ISP → Root → TLD → Authoritative NS).

### 2. Network Stack Simulation
* **TCP & TLS Handshakes:** Details the 3-way handshake and the TLS 1.3 negotiation (Cipher suites, Certificates).
* **HTTP/2 Multiplexing:** Explains how parallel streams allow fetching multiple assets without head-of-line blocking.

### 3.Engine Internals
* **V8 Pipeline:** Visualizes how JavaScript is processed (Parsing → AST → Ignition Bytecode → TurboFan JIT).
* **HTML/CSS Parsing:** Shows the creation of the DOM and CSSOM, including a visual tree representation.

### 4. Critical Rendering Path (CRP)
* **Render Pipeline:** Breaks down Style Recalculation, Layout (Reflow), Painting, and GPU Compositing.
* **Performance Metrics:** Tracks Core Web Vitals like **LCP (Largest Contentful Paint)** and **CLS (Cumulative Layout Shift)**.

---

## Tech Stack
* **Frontend:** React.js (Hooks, Functional Components)
* **Styling:** CSS-in-JS (Dynamic object-based styling)
* **Graphics:** Scalable Vector Graphics (SVG) for dynamic architectural diagrams.
* **API:** Google DNS API for real-world data fetching.
