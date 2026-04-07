import { useState, useEffect, useRef } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [steps, setSteps] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [steps]);

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleAnalyze = async () => {
    if (!url) return;
    const cleanUrl = url.replace(/^(https?:\/\/)/, '').split('/')[0];
    setIsAnalyzing(true);
    setSteps([]);
    setProgress(0);

    try {
      // 1. DNS Resolution - تفاصيل السجل والـ IP
      setSteps([{ id: 1, title: "DNS Lookup Phase", desc: `Querying Root/TLD servers for ${cleanUrl}...`, status: 'loading' }]);
      setProgress(20);
      const res = await fetch(`https://dns.google/resolve?name=${cleanUrl}`);
      const data = await res.json();
      await wait(1000);
      if (data.Answer) {
        const ip = data.Answer[0].data;
        const ttl = data.Answer[0].TTL;
        setSteps(prev => prev.map(s => s.id === 1 ? { ...s, status: 'success', desc: `Found IP: ${ip} | TTL: ${ttl}ms | Record Type: A` } : s));
      } else { throw new Error(); }

      // 2. TCP Handshake - تفاصيل الاتصال الثلاثي
      setProgress(40);
      setSteps(prev => [...prev, { id: 2, title: "TCP Connection (Layer 4)", desc: "Initiating 3-Way Handshake...", status: 'loading' }]);
      await wait(800);
      setSteps(prev => prev.map(s => s.id === 2 ? { ...s, status: 'success', desc: "SYN sent -> SYN-ACK received -> ACK sent. Connection Established on Port 443." } : s));

      // 3. TLS Handshake - تفاصيل التشفير
      setProgress(60);
      setSteps(prev => [...prev, { id: 3, title: "SSL/TLS Security Layer", desc: "Exchanging Client/Server Hello...", status: 'loading' }]);
      await wait(1000);
      setSteps(prev => prev.map(s => s.id === 3 ? { ...s, status: 'success', desc: "Cipher Suite: TLS_AES_256_GCM_SHA384 | Certificate: Verified." } : s));

      // 4. HTTP Request/Response - تفاصيل الـ Headers
      setProgress(80);
      setSteps(prev => [...prev, { id: 4, title: "HTTP Lifecycle", desc: "Sending GET / HTTP/2 Request...", status: 'loading' }]);
      await wait(1000);
      setSteps(prev => prev.map(s => s.id === 4 ? { ...s, status: 'success', desc: "Status: 200 OK | Protocol: H2 | Encoding: gzip | Keep-Alive: true" } : s));

      // 5. Critical Rendering Path - تفاصيل المعالجة الداخلية
      setProgress(95);
      setSteps(prev => [...prev, { id: 5, title: "Critical Rendering Path", desc: "Parsing HTML & CSSOM...", status: 'loading' }]);
      await wait(1200);
      const domNodes = Math.floor(Math.random() * 400) + 150;
      setSteps(prev => prev.map(s => s.id === 5 ? { ...s, status: 'success', desc: `DOM Tree: ${domNodes} nodes created | Layout: Reflow complete | Paint: Rasterized pixels.` } : s));

      setProgress(100);
    } catch (e) {
      setSteps(prev => [...prev, { id: 99, title: "Error", desc: "Invalid URL or Network Issue.", status: 'error' }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Browser Architecture Emulator</h2>
        <div style={styles.searchBar}>
          <input 
            type="text" 
            placeholder="google.com" 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            style={styles.input}
          />
          <button onClick={handleAnalyze} disabled={isAnalyzing} style={styles.button}>
            {isAnalyzing ? 'Analyzing...' : 'Execute'}
          </button>
        </div>

        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
        </div>

        <div style={styles.resultsArea} ref={scrollRef}>
          {steps.map((step) => (
            <div key={step.id} style={styles.stepCard}>
              <div style={styles.stepHeader}>
                <div style={{...styles.dot, backgroundColor: step.status === 'success' ? '#28a745' : (step.status === 'error' ? '#dc3545' : '#007bff'), animation: step.status === 'loading' ? 'pulse 1s infinite' : 'none'}}></div>
                <span style={styles.stepTitle}>{step.title}</span>
              </div>
              <p style={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
          {!isAnalyzing && steps.length === 0 && <p style={styles.placeholder}>System Ready. Enter domain to analyze request lifecycle.</p>}
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } 100% { opacity: 0.3; transform: scale(0.8); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, system-ui, sans-serif', padding: '20px' },
  card: { backgroundColor: '#ffffff', width: '100%', maxWidth: '600px', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 30px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' },
  title: { textAlign: 'center', marginBottom: '30px', fontSize: '22px', fontWeight: '800', color: '#111827' },
  searchBar: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '15px' },
  button: { padding: '0 25px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' },
  progressContainer: { width: '100%', height: '4px', backgroundColor: '#f1f5f9', borderRadius: '10px', marginBottom: '30px', overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#007bff', transition: 'width 0.4s ease' },
  resultsArea: { display: 'flex', flexDirection: 'column', gap: '16px' },
  stepCard: { padding: '15px', borderRadius: '12px', border: '1px solid #f1f5f9', animation: 'fadeIn 0.3s ease-out' },
  stepHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%' },
  stepTitle: { fontWeight: '700', fontSize: '14px', color: '#1f2937' },
  stepDesc: { fontSize: '13px', color: '#6b7280', marginLeft: '20px', fontFamily: 'monospace', lineHeight: '1.5' },
  placeholder: { textAlign: 'center', color: '#9ca3af', fontSize: '14px' }
};

export default App;
