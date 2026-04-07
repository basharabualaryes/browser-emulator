import { useState, useEffect, useRef } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [steps, setSteps] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [steps]);

  const addStep = (title, description, status = 'pending') => {
    setSteps(prev => [...prev, { title, description, status, id: Date.now() + Math.random() }]);
  };

  const updateLastStep = (status, extraInfo = '') => {
    setSteps(prev => {
      const newSteps = [...prev];
      if (newSteps.length > 0) {
        newSteps[newSteps.length - 1].status = status;
        if (extraInfo) newSteps[newSteps.length - 1].description += ` (${extraInfo})`;
      }
      return newSteps;
    });
  };

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleAnalyze = async () => {
    if (!url) return;
    const cleanUrl = url.replace(/^(https?:\/\/)/, '').split('/')[0];
    
    setIsAnalyzing(true);
    setSteps([]);

    try {
      // 1. DNS Lookup
      addStep("DNS Resolution", "Contacting DNS root servers to find IP address...");
      const dnsResponse = await fetch(`https://dns.google/resolve?name=${cleanUrl}`);
      const dnsData = await dnsResponse.json();
      await wait(1200);
      
      if (dnsData.Answer) {
        const ip = dnsData.Answer[0].data;
        updateLastStep('success', `IP: ${ip}`);
      } else {
        updateLastStep('error', 'Domain not found');
        throw new Error('DNS Failed');
      }

      // 2. TCP Handshake
      addStep("TCP Connection", "Initiating 3-way handshake (SYN, SYN-ACK, ACK)...");
      await wait(1000);
      updateLastStep('success');

      // 3. SSL/TLS
      addStep("SSL/TLS Negotiation", "Exchanging certificates and establishing secure keys...");
      await wait(1000);
      updateLastStep('success', 'TLS 1.3');

      // 4. HTTP Request
      addStep("HTTP Request", "Sending GET request and waiting for server response headers...");
      await wait(1000);
      updateLastStep('success', '200 OK');

      // 5. DOM Construction
      addStep("DOM Tree Building", "Parsing HTML bytes into tokens and nodes...");
      await wait(1200);
      updateLastStep('success');

      // 6. Rendering
      addStep("Layout & Paint", "Calculating geometry and drawing pixels to screen.");
      await wait(800);
      updateLastStep('success');

    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Browser Engine Emulator</h2>
        <p style={styles.desc}>Analyze the critical rendering path in real-time.</p>

        <div style={styles.searchBar}>
          <input 
            type="text" 
            placeholder="example.com" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={styles.input}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          />
          <button onClick={handleAnalyze} disabled={isAnalyzing} style={styles.button}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        <div style={styles.resultsArea} ref={scrollRef}>
          {steps.map((step) => (
            <div key={step.id} style={styles.stepRow}>
              <div style={{...styles.statusDot, backgroundColor: getStatusColor(step.status)}}></div>
              <div style={styles.stepText}>
                <div style={styles.stepTitle}>{step.title}</div>
                <div style={styles.stepDesc}>{step.description}</div>
              </div>
              {step.status === 'pending' && <div className="spinner" style={styles.miniSpinner}></div>}
            </div>
          ))}
          {steps.length === 0 && <div style={styles.placeholder}>Results will appear here...</div>}
        </div>
      </div>
    </div>
  );
}

const getStatusColor = (status) => {
  if (status === 'success') return '#28a745';
  if (status === 'error') return '#dc3545';
  return '#007bff';
};

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px'
  },
  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: '650px',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    border: '1px solid #eee'
  },
  title: { margin: '0 0 10px 0', fontSize: '24px', color: '#1a1a1a', textAlign: 'center' },
  desc: { margin: '0 0 30px 0', fontSize: '14px', color: '#666', textAlign: 'center' },
  searchBar: { display: 'flex', gap: '10px', marginBottom: '30px' },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
    transition: 'border 0.2s'
  },
  button: {
    padding: '0 24px',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  resultsArea: {
    borderTop: '1px solid #eee',
    paddingTop: '20px',
    maxHeight: '400px',
    overflowY: 'auto'
  },
  stepRow: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '12px 0',
    borderBottom: '1px solid #fafafa',
    animation: 'fadeIn 0.3s ease-in'
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginTop: '6px',
    marginRight: '15px',
    flexShrink: 0
  },
  stepText: { flex: 1 },
  stepTitle: { fontSize: '15px', fontWeight: '600', color: '#333', marginBottom: '2px' },
  stepDesc: { fontSize: '13px', color: '#777' },
  placeholder: { textAlign: 'center', color: '#bbb', fontSize: '14px', marginTop: '20px' },
  miniSpinner: {
    width: '14px',
    height: '14px',
    border: '2px solid #f3f3f3',
    borderTop: '2px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginLeft: '10px'
  }
};

export default App;
