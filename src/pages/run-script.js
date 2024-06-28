import { useState } from 'react';

export default function RunScript() {
  const [log, setLog] = useState('');
  const [loading, setLoading] = useState(false);

  const runScript = async () => {
    setLoading(true);
    setLog('');

    try {
      const response = await fetch('/api/run-script');
      const data = await response.json();

      if (response.ok) {
        setLog(data.output);
      } else {
        setLog(`Error: ${data.error}`);
      }
    } catch (error) {
      setLog(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={runScript} disabled={loading} style={{ padding: '10px', fontSize: '16px' }}>
        {loading ? 'Running...' : 'Run Script'}
      </button>
      <pre style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>{log}</pre>
    </div>
  );
}
