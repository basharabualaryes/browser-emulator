# Browser Emulator 🌐

A browser emulator built with React that analyzes any URL and shows exactly what happens behind the scenes — from DNS lookup to page rendering.

## Live Demo
Run locally on `http://localhost:5173`

## What it does
Enter any URL and see:
- **DNS Lookup** — resolves the domain to a real IP address
- **TCP Handshake** — explains the 3-way connection process
- **TLS / HTTPS** — shows how encryption is established
- **HTTP Request** — displays request and response headers
- **HTML Parsing** — tokenization and DOM construction
- **DOM Tree** — node structure of the page
- **CSS / CSSOM** — stylesheet parsing and rule matching
- **Render Tree** — combining DOM + CSSOM
- **Layout** — calculating element positions
- **Paint & Composite** — drawing pixels on screen
- **JavaScript Engine** — V8 event loop explained

## Tech Stack
- React 18
- Vite
- Google DNS API (`dns.google/resolve`)

## Getting Started
```bash
npm install
npm run dev
```

## Author
Bashar Abu Alaryes
