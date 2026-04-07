import { useState } from 'react'

const STAGES = [
  { id: 'dns', label: 'DNS Lookup', group: 'Network' },
  { id: 'tcp', label: 'TCP Handshake', group: 'Network' },
  { id: 'tls', label: 'TLS / HTTPS', group: 'Network' },
  { id: 'http', label: 'HTTP Request', group: 'Network' },
  { id: 'html', label: 'HTML Parsing', group: 'Parsing' },
  { id: 'dom', label: 'DOM Tree', group: 'Parsing' },
  { id: 'css', label: 'CSS / CSSOM', group: 'Parsing' },
  { id: 'render', label: 'Render Tree', group: 'Rendering' },
  { id: 'layout', label: 'Layout', group: 'Rendering' },
  { id: 'paint', label: 'Paint', group: 'Rendering' },
  { id: 'js', label: 'JavaScript', group: 'Rendering' },
]

const STAGE_INFO = {
  tcp: {
    title: 'TCP Handshake',
    description: 'بعد ما عرفنا الـ IP، المتصفح بيفتح اتصال TCP بـ 3 خطوات: SYN ← SYN-ACK ← ACK',
    steps: ['SYN — المتصفح بيطلب اتصال', 'SYN-ACK — السيرفر بيوافق', 'ACK — الاتصال مفتوح!'],
    time: '~30ms'
  },
  tls: {
    title: 'TLS / HTTPS',
    description: 'المتصفح والسيرفر بيتفقوا على تشفير الاتصال عشان ما يقدر أحد يتجسس',
    steps: ['ClientHello — المتصفح بيبعث cipher suites', 'ServerHello + Certificate', 'Key Exchange — مفتاح التشفير', 'Finished — الاتصال مشفر!'],
    time: '~55ms'
  },
  html: {
    title: 'HTML Parsing',
    description: 'المتصفح بيحول HTML من نص لـ tokens ثم لشجرة DOM',
    steps: ['Bytes → Characters', 'Characters → Tokens', 'Tokens → Nodes', 'Nodes → DOM Tree'],
    time: '~35ms'
  },
  dom: {
    title: 'DOM Tree',
    description: 'شجرة كائنات تمثل كل عنصر في الصفحة — JavaScript بتقرأها وتعدل عليها',
    steps: ['Document (root)', '→ html', '→→ head + body', '→→→ كل العناصر'],
    time: '~10ms'
  },
  css: {
    title: 'CSS / CSSOM',
    description: 'المتصفح بيقرأ CSS ويبني CSSOM — بيطابق كل rule مع عناصر DOM',
    steps: ['تحميل ملفات CSS', 'Parse → Rules', 'حساب Specificity', 'بناء CSSOM'],
    time: '~20ms'
  },
  render: {
    title: 'Render Tree',
    description: 'دمج DOM + CSSOM — بس العناصر المرئية (display:none مش موجودة)',
    steps: ['ابدأ من root', 'تجاهل display:none', 'ضيف computed styles', 'Render Tree جاهز'],
    time: '~8ms'
  },
  layout: {
    title: 'Layout / Reflow',
    description: 'حساب مكان وحجم كل عنصر بالبكسل بالضبط',
    steps: ['احسب عرض كل عنصر', 'احسب ارتفاعه', 'حدد x,y position', 'Layout كامل'],
    time: '~18ms'
  },
  paint: {
    title: 'Paint & Composite',
    description: 'رسم البكسلات فعلياً — كل layer على حدة ثم GPU يجمعها',
    steps: ['إنشاء layers', 'رسم backgrounds', 'رسم text وصور', 'GPU Composite'],
    time: '~12ms'
  },
  js: {
    title: 'JavaScript Engine',
    description: 'V8 بيشغل JS على event loop — كل شي single-threaded',
    steps: ['Parse → AST', 'Compile → Bytecode', 'JIT → Machine Code', 'Event Loop يشتغل'],
    time: '~60ms'
  },
}

function MetricCard({ label, value }) {
  return (
    <div style={{ background: '#f0f7ff', border: '1px solid #cce', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
      <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '22px', fontWeight: '500' }}>{value}</div>
    </div>
  )
}

function App() {
  const [url, setUrl] = useState('')
  const [active, setActive] = useState('dns')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  async function analyze() {
    if (!url) return
    setLoading(true)
    setResults(null)

    let hostname = url
    if (!hostname.startsWith('http')) hostname = 'https://' + hostname
    const host = new URL(hostname).hostname
    const start = Date.now()

    try {
      const dnsRes = await fetch(`https://dns.google/resolve?name=${host}&type=A`)
      const dnsData = await dnsRes.json()
      const ip = dnsData.Answer?.[0]?.data || 'Not found'
      const ttl = dnsData.Answer?.[0]?.TTL || 0
      const dnsTime = Date.now() - start

      setResults({ host, ip, ttl, dnsTime })
      setActive('dns')
    } catch (e) {
      setResults({ error: 'فشل التحليل — تحقق من الـ URL' })
    }

    setLoading(false)
  }

  function renderContent() {
    if (loading) return <p style={{ color: '#888', fontSize: '14px' }}>جاري التحليل...</p>
    if (!results) return <p style={{ color: '#888', fontSize: '14px' }}>اكتب URL واضغط Analyze</p>
    if (results.error) return <p style={{ color: 'red' }}>{results.error}</p>

    if (active === 'dns') {
      return (
        <div>
          <MetricCard label="IP Address" value={results.ip} />
          <MetricCard label="TTL (Time to Live)" value={`${results.ttl}s`} />
          <MetricCard label="وقت الاستجابة" value={`${results.dnsTime}ms`} />
          <div style={{ background: '#f0fff4', border: '1px solid #9f9', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#555' }}>
            ✓ تم تحويل <strong>{results.host}</strong> إلى IP بنجاح عبر Google DNS
          </div>
        </div>
      )
    }

    if (active === 'http') {
      return (
        <div>
          <MetricCard label="الموقع" value={results.host} />
          <MetricCard label="IP" value={results.ip} />
          <div style={{ background: '#1e1e1e', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '12px', color: '#d4d4d4', lineHeight: '1.8' }}>
            <div style={{ color: '#608b4e' }}>// HTTP Request</div>
            <div><span style={{ color: '#569cd6' }}>GET</span> / HTTP/2</div>
            <div><span style={{ color: '#9cdcfe' }}>Host:</span> {results.host}</div>
            <div><span style={{ color: '#9cdcfe' }}>Accept:</span> text/html</div>
            <div><span style={{ color: '#9cdcfe' }}>User-Agent:</span> Mozilla/5.0</div>
            <br />
            <div style={{ color: '#608b4e' }}>// HTTP Response</div>
            <div><span style={{ color: '#4ec9b0' }}>200 OK</span></div>
            <div><span style={{ color: '#9cdcfe' }}>Content-Type:</span> text/html; charset=UTF-8</div>
            <div><span style={{ color: '#9cdcfe' }}>Server:</span> {results.host.includes('github') ? 'GitHub.com' : 'nginx'}</div>
          </div>
        </div>
      )
    }

    const info = STAGE_INFO[active]
    if (info) {
      return (
        <div>
          <div style={{ background: '#f0f7ff', border: '1px solid #cce', borderRadius: '8px', padding: '16px', marginBottom: '12px', fontSize: '13px', color: '#444', lineHeight: '1.7' }}>
            {info.description}
          </div>
          <MetricCard label="الوقت التقريبي" value={info.time} />
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            {info.steps.map((step, i) => (
              <div key={i} style={{ padding: '10px 14px', borderBottom: i < info.steps.length - 1 ? '1px solid #eee' : 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#007acc', color: 'white', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                {step}
              </div>
            ))}
          </div>
        </div>
      )
    }

    return <p style={{ color: '#888', fontSize: '14px' }}>اضغط Analyze أولاً</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '12px 20px', borderBottom: '1px solid #ddd', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '16px', fontWeight: '500' }}>Browser Emulator</span>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && analyze()}
          placeholder="https://example.com"
          style={{ flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #ddd', fontSize: '14px' }}
        />
        <button
          onClick={analyze}
          disabled={loading}
          style={{ padding: '8px 20px', borderRadius: '20px', background: loading ? '#aaa' : '#007acc', color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px' }}
        >
          {loading ? 'جاري...' : 'Analyze'}
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: '200px', borderRight: '1px solid #ddd', padding: '10px 0', background: '#f5f5f5', overflowY: 'auto' }}>
          {['Network', 'Parsing', 'Rendering'].map(group => (
            <div key={group}>
              <div style={{ fontSize: '10px', color: '#999', padding: '8px 12px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{group}</div>
              {STAGES.filter(s => s.group === group).map(stage => (
                <button
                  key={stage.id}
                  onClick={() => setActive(stage.id)}
                  style={{
                    display: 'block', width: '100%', padding: '8px 12px',
                    background: active === stage.id ? '#fff' : 'transparent',
                    border: 'none',
                    borderLeft: active === stage.id ? '3px solid #007acc' : '3px solid transparent',
                    cursor: 'pointer', fontSize: '12px',
                    color: active === stage.id ? '#000' : '#555',
                    textAlign: 'left', fontWeight: active === stage.id ? '500' : '400'
                  }}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>
            {STAGES.find(s => s.id === active)?.label}
          </h2>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default App