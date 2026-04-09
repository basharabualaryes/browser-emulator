import { useState, useRef } from "react";

const steps = [
  {
    id: "dns", name: "DNS Lookup", label: "DNS",
    dur: 45, color: "#7F77DD",
    desc: "Browser checks local cache → OS cache → Router → ISP DNS resolver → Root nameserver → TLD → Authoritative nameserver",
    details: [
      { k: "Query", v: "A record" }, { k: "Resolver", v: "ISP DNS" }, { k: "TTL", v: "300s" },
      { k: "Cache hit", v: "No" }, { k: "Hops", v: "4" }, { k: "Result", v: "resolving..." },
    ],
    logLines: (hostname, ip) => [
      `[0ms] DNS query: ${hostname} A record`,
      `[12ms] → ISP resolver cache miss`,
      `[38ms] ← ${ip} (TTL 300s)`,
    ],
    tagBg: "#EEEDFE", tagColor: "#3C3489",
  },
  {
    id: "tcp", name: "TCP Handshake", label: "TCP",
    dur: 30, color: "#1D9E75",
    desc: "SYN → SYN-ACK → ACK  |  3-way handshake establishes a reliable connection before any data is sent",
    details: [
      { k: "SYN", v: "+0ms" }, { k: "SYN-ACK", v: "+14ms" }, { k: "ACK", v: "+28ms" },
      { k: "Window", v: "65535 B" }, { k: "MSS", v: "1460 B" }, { k: "Port", v: "443" },
    ],
    logLines: (hostname, ip) => [
      `[45ms] TCP SYN → ${ip}:443`,
      `[59ms] ← SYN-ACK received`,
      `[75ms] → ACK sent — connection established`,
    ],
    tagBg: "#E1F5EE", tagColor: "#085041",
  },
  {
    id: "tls", name: "TLS Handshake", label: "TLS",
    dur: 55, color: "#BA7517",
    desc: "Client Hello → Server Hello + Certificate → Key Exchange → Finished  |  Negotiates encryption using ECDHE, then switches to AES-256-GCM",
    details: [
      { k: "Version", v: "TLS 1.3" }, { k: "Cipher", v: "AES-256-GCM" }, { k: "Key Exch", v: "ECDHE" },
      { k: "Cert issuer", v: "DigiCert" }, { k: "OCSP", v: "Valid" }, { k: "Resumed", v: "No" },
    ],
    logLines: () => [
      `[75ms] TLS ClientHello (TLS 1.3)`,
      `[92ms] ← ServerHello + Certificate`,
      `[110ms] Verifying cert chain...`,
      `[130ms] ← Finished — AES-256-GCM active`,
    ],
    tagBg: "#FAEEDA", tagColor: "#633806",
  },
  {
    id: "http", name: "HTTP Request", label: "HTTP",
    dur: 80, color: "#185FA5",
    desc: "GET / HTTP/2  |  Browser sends headers (Host, Accept, User-Agent, Cookies). Server responds with 200 OK and streams the HTML body.",
    details: [
      { k: "Method", v: "GET /" }, { k: "Protocol", v: "HTTP/2" }, { k: "Status", v: "200 OK" },
      { k: "Content-Type", v: "text/html" }, { k: "Size", v: "14.2 KB" }, { k: "Encoding", v: "gzip" },
    ],
    logLines: (hostname) => [
      `[130ms] → GET / HTTP/2`,
      `[145ms]   Host: ${hostname}`,
      `[185ms] ← 200 OK (14.2 KB gzip)`,
      `[210ms]   Content-Type: text/html; charset=UTF-8`,
    ],
    tagBg: "#E6F1FB", tagColor: "#0C447C",
  },
  {
    id: "parse", name: "Parse HTML / DOM", label: "PARSE",
    dur: 60, color: "#993C1D",
    desc: "HTML parser reads bytes → tokens → nodes → DOM tree. CSS parser builds CSSOM. JS blocks parsing if render-blocking scripts are found.",
    details: [
      { k: "Nodes", v: "847" }, { k: "Scripts", v: "3 found" }, { k: "Stylesheets", v: "2 found" },
      { k: "Images", v: "6 found" }, { k: "Blocking", v: "1 script" }, { k: "DOMState", v: "loading" },
    ],
    logLines: () => [
      `[210ms] HTML tokenizer started`,
      `[230ms] Render-blocking script found`,
      `[240ms] Preload scanner: 6 resources queued`,
      `[270ms] DOMContentLoaded fired`,
    ],
    tagBg: "#FAECE7", tagColor: "#4A1B0C",
  },
  {
    id: "assets", name: "Fetch Assets", label: "ASSETS",
    dur: 120, color: "#993556",
    desc: "Browser opens parallel HTTP/2 streams for CSS, JS, images, fonts. Multiplexing allows all assets on one TCP connection. Critical assets are prioritised.",
    details: [
      { k: "CSS", v: "2 files (48KB)" }, { k: "JS", v: "3 files (210KB)" }, { k: "Images", v: "6 files (380KB)" },
      { k: "Fonts", v: "2 files (60KB)" }, { k: "Total", v: "698 KB" }, { k: "Cached", v: "3 hits" },
    ],
    logLines: () => [
      `[270ms] Fetching 13 sub-resources...`,
      `[280ms] style.css 200 (48KB, cached)`,
      `[300ms] app.js 200 (210KB)`,
      `[350ms] hero.jpg 200 (380KB)`,
      `[390ms] All assets loaded`,
    ],
    tagBg: "#FBEAF0", tagColor: "#4B1528",
  },
  {
    id: "render", name: "Render Pipeline", label: "RENDER",
    dur: 40, color: "#3B6D11",
    desc: "DOM + CSSOM → Render Tree → Layout (px positions) → Paint (rasterize pixels) → Composite (GPU layers merge) → Frame on screen",
    details: [
      { k: "Render Tree", v: "612 nodes" }, { k: "Layout", v: "18ms" }, { k: "Paint", v: "9ms" },
      { k: "Composite", v: "4ms" }, { k: "FPS", v: "60" }, { k: "LCP", v: "410ms" },
    ],
    logLines: () => [
      `[390ms] Render tree built (612 nodes)`,
      `[408ms] Layout pass complete`,
      `[417ms] Paint complete`,
      `[421ms] Composite — frame on screen!`,
      `[430ms] load event fired`,
    ],
    tagBg: "#EAF3DE", tagColor: "#173404",
  },
];

const SPEED = 4;
const byteMap = { http: 14, parse: 48, assets: 698 };

const styles = {
  wrap: { padding: "20px", backgroundColor: "#f4f4f4", minHeight: "100vh", fontFamily: "monospace" },
  card: { maxWidth: "900px", margin: "0 auto", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "12px", overflow: "hidden" },
  header: { padding: "20px", borderBottom: "1px solid #eee", background: "#fafafa" },
  title: { fontSize: "18px", fontWeight: "600", marginBottom: "4px", color: "#111" },
  subtitle: { fontSize: "12px", color: "#888" },
  urlRow: { display: "flex", gap: "10px", marginTop: "14px" },
  input: { flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", fontSize: "13px", fontFamily: "monospace", outline: "none" },
  runBtn: (disabled) => ({ padding: "10px 24px", borderRadius: "8px", border: "none", background: disabled ? "#ccc" : "#111", color: "#fff", cursor: disabled ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "monospace", fontWeight: "600" }),
  metrics: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "#eee", borderBottom: "1px solid #eee" },
  metric: { background: "#fff", padding: "14px 18px" },
  metricLabel: { fontSize: "10px", color: "#999", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" },
  metricVal: (color) => ({ fontSize: "20px", fontWeight: "600", color: color || "#111", fontFamily: "monospace" }),
  body: { display: "flex", minHeight: "500px" },
  timeline: { flex: 1, padding: "16px 0", borderRight: "1px solid #eee" },
  stepRow: { display: "flex", alignItems: "stretch", minHeight: "60px" },
  stepLeft: { width: "150px", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-start", padding: "8px 14px 8px 0", textAlign: "right", paddingTop: "14px" },
  stepName: { fontSize: "12px", fontWeight: "600", color: "#222" },
  stepTime: { fontSize: "11px", color: "#aaa", marginTop: "2px" },
  stepCenter: { width: "28px", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" },
  dot: (state) => ({
    width: "12px", height: "12px", borderRadius: "50%", marginTop: "18px", flexShrink: 0, zIndex: 1,
    border: state === "idle" ? "2px solid #ddd" : "2px solid " + (state === "running" ? "#EF9F27" : "#1D9E75"),
    background: state === "idle" ? "#fff" : state === "running" ? "#EF9F27" : "#1D9E75",
    boxShadow: state === "running" ? "0 0 0 4px rgba(239,159,39,0.2)" : state === "done" ? "0 0 0 3px rgba(29,158,117,0.15)" : "none",
    transition: "all 0.3s",
  }),
  line: (done) => ({ width: "2px", background: done ? "#1D9E75" : "#eee", flex: 1, margin: "0 auto", transition: "background 0.5s" }),
  stepRight: { flex: 1, padding: "8px 16px 12px" },
  tag: (bg, color) => ({ display: "inline-block", fontSize: "10px", padding: "2px 8px", borderRadius: "99px", fontWeight: "600", background: bg, color: color, marginBottom: "6px", marginTop: "10px" }),
  desc: { fontSize: "12px", color: "#555", lineHeight: "1.6", marginBottom: "8px" },
  detailGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px", marginBottom: "8px" },
  detailCell: { background: "#f8f8f8", borderRadius: "6px", padding: "6px 10px" },
  detailKey: { fontSize: "9px", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em" },
  detailVal: { fontSize: "11px", color: "#222", fontFamily: "monospace", marginTop: "2px" },
  barBg: { height: "5px", background: "#f0f0f0", borderRadius: "3px", overflow: "hidden" },
  logPanel: { width: "280px", background: "#0d1117", padding: "14px", overflowY: "auto", maxHeight: "600px" },
  logTitle: { fontSize: "10px", color: "#6e7681", letterSpacing: "0.08em", marginBottom: "10px", textTransform: "uppercase" },
  logLine: { fontSize: "11px", fontFamily: "monospace", lineHeight: "1.7", color: "#8b949e" },
};

function BarFill({ color, active }) {
  const [width, setWidth] = useState(0);
  if (active && width === 0) setTimeout(() => setWidth(100), 50);
  if (!active && width !== 0) setWidth(0);
  return <div style={{ height: "100%", width: width + "%", background: color, borderRadius: "3px", transition: "width 0.8s ease" }} />;
}

export default function App() {
  const [url, setUrl] = useState("https://google.com");
  const [running, setRunning] = useState(false);
  const [stepStates, setStepStates] = useState(steps.map(() => "idle"));
  const [lineDone, setLineDone] = useState(steps.map(() => false));
  const [stepTimes, setStepTimes] = useState(steps.map(() => "—"));
  const [activeSteps, setActiveSteps] = useState(steps.map(() => false));
  const [barActive, setBarActive] = useState(steps.map(() => false));
  const [stepDetails, setStepDetails] = useState(steps.map(s => s.details));
  const [logLines, setLogLines] = useState([{ text: "[ready] Enter a URL and press RUN", color: "#6e7681" }]);
  const [metrics, setMetrics] = useState({ time: "0 ms", ip: "—", proto: "—", bytes: "0 KB" });
  const timers = useRef([]);

  const addLog = (lines, color = "#8b949e") => {
    setLogLines(prev => [...prev, ...lines.map(text => ({ text, color }))]);
  };

  const runSim = async () => {
    if (running) return;
    setRunning(true);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStepStates(steps.map(() => "idle"));
    setLineDone(steps.map(() => false));
    setStepTimes(steps.map(() => "—"));
    setActiveSteps(steps.map(() => false));
    setBarActive(steps.map(() => false));
    setStepDetails(steps.map(s => s.details));

    const rawUrl = url || "https://google.com";
    const fullUrl = rawUrl.startsWith("http") ? rawUrl : "https://" + rawUrl;
    let hostname = rawUrl;
    try { hostname = new URL(fullUrl).hostname; } catch {}

    setLogLines([{ text: `[0ms] Navigating to ${fullUrl}`, color: "#58a6ff" }]);
    setMetrics({ time: "0 ms", ip: "resolving...", proto: "—", bytes: "0 KB" });

    // Real DNS lookup using Google's DNS over HTTPS API
    let resolvedIp = "Could not resolve";
    try {
      const res = await fetch(`https://dns.google/resolve?name=${hostname}&type=A`);
      const data = await res.json();
      resolvedIp = data.Answer?.[0]?.data || "Not found";
    } catch {
      resolvedIp = "DNS failed";
    }

    // Update DNS step Result cell with the real IP
    setStepDetails(prev => prev.map((details, i) =>
      i === 0
        ? details.map(d => d.k === "Result" ? { ...d, v: resolvedIp } : d)
        : details
    ));

    let elapsed = 0;
    let totalBytes = 0;

    steps.forEach((s, i) => {
      const startAt = elapsed;
      elapsed += s.dur;
      const endAt = elapsed;

      timers.current.push(setTimeout(() => {
        setStepStates(prev => prev.map((v, j) => j === i ? "running" : v));
        setActiveSteps(prev => prev.map((v, j) => j === i ? true : v));
        setBarActive(prev => prev.map((v, j) => j === i ? true : v));
        setStepTimes(prev => prev.map((v, j) => j === i ? `+${startAt}ms` : v));
        addLog(s.logLines(hostname, resolvedIp), "#8b949e");
        if (i === 0) setMetrics(m => ({ ...m, ip: resolvedIp }));
        if (i === 2) setMetrics(m => ({ ...m, proto: "TLS 1.3 / H2" }));
      }, startAt * SPEED));

      timers.current.push(setTimeout(() => {
        setStepStates(prev => prev.map((v, j) => j === i ? "done" : v));
        setLineDone(prev => prev.map((v, j) => j === i ? true : v));
        totalBytes += byteMap[s.id] || 0;
        setMetrics(m => ({ ...m, time: endAt + " ms", bytes: totalBytes + " KB" }));
        if (i === steps.length - 1) {
          setRunning(false);
          addLog([`[${endAt}ms] ✓ Page fully loaded in ${endAt}ms`], "#3fb950");
        }
      }, endAt * SPEED));
    });
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.title}>Browser Request Lifecycle</div>
          <div style={styles.subtitle}>Real-time emulation of what happens when you visit a URL</div>
          <div style={styles.urlRow}>
            <input
              style={styles.input}
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && runSim()}
              placeholder="https://google.com"
            />
            <button style={styles.runBtn(running)} onClick={runSim} disabled={running}>
              {running ? "RUNNING..." : "RUN"}
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div style={styles.metrics}>
          {[
            { label: "Total Time", val: metrics.time, color: "#185FA5" },
            { label: "IP Address", val: metrics.ip, color: "#222" },
            { label: "Protocol", val: metrics.proto, color: "#1D9E75" },
            { label: "Transferred", val: metrics.bytes, color: "#BA7517" },
          ].map(m => (
            <div key={m.label} style={styles.metric}>
              <div style={styles.metricLabel}>{m.label}</div>
              <div style={styles.metricVal(m.color)}>{m.val}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={styles.body}>

          {/* Timeline */}
          <div style={styles.timeline}>
            {steps.map((s, i) => (
              <div key={s.id} style={styles.stepRow}>
                <div style={styles.stepLeft}>
                  <div style={styles.stepName}>{s.name}</div>
                  <div style={styles.stepTime}>{stepTimes[i]}</div>
                </div>
                <div style={styles.stepCenter}>
                  <div style={styles.dot(stepStates[i])} />
                  {i < steps.length - 1 && <div style={styles.line(lineDone[i])} />}
                </div>
                <div style={styles.stepRight}>
                  <div style={styles.tag(s.tagBg, s.tagColor)}>{s.label}</div>
                  {activeSteps[i] && (
                    <>
                      <div style={styles.desc}>{s.desc}</div>
                      <div style={styles.detailGrid}>
                        {stepDetails[i].map(d => (
                          <div key={d.k} style={styles.detailCell}>
                            <div style={styles.detailKey}>{d.k}</div>
                            <div style={styles.detailVal}>{d.v}</div>
                          </div>
                        ))}
                      </div>
                      <div style={styles.barBg}>
                        <BarFill color={s.color} active={barActive[i]} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Log Panel */}
          <div style={styles.logPanel}>
            <div style={styles.logTitle}>Network Log</div>
            {logLines.map((l, i) => (
              <div key={i} style={{ ...styles.logLine, color: l.color }}>{l.text}</div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
