import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
function App() {
  const [status, setStatus] = useState(null),
    [sample, setSample] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  async function perform(action) {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  }
  async function call(url, options) {
    setError('');
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${data.error}`);
      return data;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }
  async function refresh() {
    const result = await call('/api/status');
    if (result) setStatus(result);
    const persisted = await call('/api/sample');
    if (persisted) setSample(persisted.text);
  }
  async function increment() {
    if (await call('/api/counter', { method: 'POST' })) await refresh();
  }
  async function save() {
    await call('/api/sample', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: sample }),
    });
  }
  return (
    <main>
      <p>WEEK 1 · EXISTING WORKLOAD</p>
      <h1>Request notebook</h1>
      <p>
        This React interface calls a Node web proxy and a separate Node API. Operate the supplied app; no
        feature development is required.
      </p>
      <button disabled={busy} onClick={() => perform(refresh)}>
        Refresh API status
      </button>
      <button disabled={busy} onClick={() => perform(increment)}>
        Increment volatile counter
      </button>
      {busy && <p role="status">Waiting for the request to finish…</p>}
      {error && <p role="alert">{error}</p>}
      <pre aria-label="API status">
        {status ? JSON.stringify(status, null, 2) : 'No API status requested yet.'}
      </pre>
      <label>
        Dummy persisted sample
        <input disabled={busy} value={sample} onChange={(e) => setSample(e.target.value)} maxLength={200} />
      </label>
      <button disabled={busy} onClick={() => perform(save)}>
        Save dummy sample
      </button>
      <p>
        The counter lives in API process memory. The saved sample is a local file, not a database or backup.
        Stop/restart to test each claim.
      </p>
    </main>
  );
}
createRoot(document.getElementById('root')).render(<App />);
