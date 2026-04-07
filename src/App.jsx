import React, { useState, useEffect } from 'react';

export default function App() {
  const [url, setUrl] = useState('');
  const [ms, setMs] = useState(0); 
  const [isRunning, setIsRunning] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [logs, setLogs] = useState([]);

  const pipeline = [
    { time: 600,  layer: "SYSTEM", action: "KERNEL_SOCKET_INIT", ip: "192.168.1.45", ttl: "64", ssl: "WAITING", mac: "00:E0:4C:68", detail: "Allocating TCP/IP buffers and initializing physical interface descriptors.", color: "#3b82f6" },
    { time: 1600, layer: "NETWORK", action: "DNS_RESOLUTION", ip: "8.8.4.4", ttl: "54", ssl: "UDP_SECURE", mac: "GATEWAY_DEFAULT", detail: "Resolving host via Google DNS. TTL indicates 10 network hops to target.", color: "#2563eb" },
    { time: 2600, layer: "TRANSPORT", action: "TCP_HANDSHAKE", ip: "142.251.40.174", ttl: "128", ssl: "TCP_SYN", mac: "NODE_REMOTE_01", detail: "Synchronizing sequence numbers. Establishing bi-directional flow control.", color: "#1d4ed8" },
    { time: 3600, layer: "SECURITY", action: "SSL_CERT_VALIDATE", ip: "142.251.40.174", ttl: "128", ssl: "TLS_1.3_X25519", mac: "SHA256_VERIFIED", detail: "Handshaking encryption keys. Cipher Suite: AES_256_GCM_SHA384.", color: "#7c3aed" },
    { time: 4600, layer: "SESSION", action: "HTTP_STREAMING", ip: "INBOUND_STREAM", ttl: "52", ssl: "TLS_ACTIVE", mac: "PKT_CAPTURE_ON", detail: "Receiving raw binary frames. Parsing HTTP/2 pseudo-headers and payload.", color: "#059669" },
    { time: 5600, layer: "ENGINE", action: "DOM_PARSING", ip: "V8_HEAP_ACTIVE", ttl: "N/A", ssl: "N/A", mac: "DOM_TREE_GEN", detail: "Converting byte stream into memory-resident Node objects and Tree structure.", color: "#d97706" },
    { time: 6600, layer: "GRAPHICS", action: "GPU_COMPOSITING", ip: "VRAM_BUFFER", ttl: "N/A", ssl: "VSYNC_READY", mac: "RASTER_THREAD", detail: "Merging layers on hardware. Committing final frame to front display buffer.", color: "#0891b2" }
  ];

  const startAnalysis = () => {
    if (!url || isRunning) return;
    setIsRunning(true); setMs(0); setLogs([]); setActiveTask(null);
    let start = null;
    const animate = (now) => {
      if (!start) start = now;
      const progress = now - start;
      if (progress <= 7000) {
        setMs(progress);
        const task = [...pipeline].reverse().find(e => progress >= e.time);
        if (task && activeTask?.action !== task.action) {
          setActiveTask(task);
          setLogs(prev => [task, ...prev]);
        }
        requestAnimationFrame(animate);
      } else { setIsRunning(false); }
    };
    requestAnimationFrame(animate);
  };

  const onKey = (e) => { if (e.key === 'Enter') startAnalysis(); };

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', padding: '40px', fontFamily: '"Segoe UI", Roboto, sans-serif', color: '#1a1a1a' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
        
        {/* URL Input Bar */}
        <div style={{ padding: '25px', borderBottom: '1px solid #f5f5f5', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px', marginRight: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e5e7eb' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e5e7eb' }}></div>
          </div>
          <input 
            style={{ flex: 1, padding: '14px 20px', borderRadius: '10px', border: '1px solid #eee', background: '#f9fafb', fontSize: '14px', outline: 'none', transition: 'all 0.3s' }}
            value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={onKey} placeholder="Enter URL to trace (e.g., google.com)"
          />
          <button onClick={startAnalysis} style={{ background: '#000', color: '#fff', border: 'none', padding: '14px 35px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            {isRunning ? 'RUNNING...' : 'EXECUTE'}
          </button>
        </div>

        {/* --- THE DATA GRID (IP, TTL, SSL, MAC) --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: '#fff', borderBottom: '1px solid #f5f5f5' }}>
          {[
            { label: 'REMOTE_IP', value: activeTask?.ip || '---.---.---.---', color: '#3b82f6' },
            { label: 'PACKET_TTL', value: activeTask?.ttl || '0', color: '#1a1a1a' },
            { label: 'SSL_PROTOCOL', value: activeTask?.ssl || 'WAITING', color: '#7c3aed' },
            { label: 'MAC_ADDRESS', value: activeTask?.mac || 'IDLE', color: '#1a1a1a' }
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '20px', textAlign: 'center', borderRight: idx < 3 ? '1px solid #f5f5f5' : 'none' }}>
              <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '1px' }}>{item.label}</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Main Console Area */}
        <div style={{ display: 'flex', height: '500px' }}>
          
          <div style={{ flex: 1.5, padding: '50px', position: 'relative' }}>
            {/* Timeline Progress Bar */}
            <div style={{ height: '3px', background: '#f3f4f6', borderRadius: '2px', marginBottom: '60px' }}>
              <div style={{ height: '100%', width: `${(ms / 7000) * 100}%`, background: '#000', transition: 'width 0.1s linear' }}></div>
            </div>

            {activeTask ? (
              <div style={{ animation: 'fadeIn 0.4s' }}>
                <span style={{ color: activeTask.color, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{activeTask.layer} ACTIVE</span>
                <h1 style={{ fontSize: '55px', margin: '15px 0', fontWeight: '900', letterSpacing: '-2px', color: '#000' }}>{activeTask.action}</h1>
                <p style={{ fontSize: '18px', color: '#6b7280', lineHeight: '1.6', maxWidth: '550px' }}>{activeTask.detail}</p>
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e5e7eb', fontSize: '32px', fontWeight: '900' }}>READY</div>
            )}
          </div>

          {/* Activity Sidebar */}
          <div style={{ flex: 0.8, background: '#fafafa', borderLeft: '1px solid #f5f5f5', padding: '30px', overflowY: 'auto' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 'bold', marginBottom: '20px', letterSpacing: '1px' }}>ACTIVITY_LOG</div>
            {logs.map((log, i) => (
              <div key={i} style={{ marginBottom: '15px', paddingLeft: '12px', borderLeft: `2px solid ${log.color}`, fontSize: '12px' }}>
                <div style={{ color: '#9ca3af', fontSize: '10px' }}>{log.time}ms</div>
                <div style={{ fontWeight: 'bold', color: '#1a1a1a' }}>{log.action}</div>
                <div style={{ color: '#d1d5db' }}>SUCCESSFUL</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '15px 30px', background: '#fff', borderTop: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#d1d5db' }}>
          <span>LATENCY: {(Math.random() * 15 + 5).toFixed(2)}ms</span>
          <span>BROWSER_CORE_EMULATOR_V4</span>
        </div>
      </div>
    </div>
  );
}
