import http from 'http';

const endpoints = [
  // AI Service (8100)
  { service: 'AI-Service', url: 'http://localhost:8100/health' },
  { service: 'AI-Service', url: 'http://localhost:8100/models/status' },
  { service: 'AI-Service', url: 'http://localhost:8100/config' },
  { service: 'AI-Service', url: 'http://localhost:8100/cameras' },

  // Node.js Backend (5000)
  { service: 'Backend', url: 'http://localhost:5000/api/health' },
  { service: 'Backend', url: 'http://localhost:5000/api/analytics/overview' },
  { service: 'Backend', url: 'http://localhost:5000/api/cameras' },
  { service: 'Backend', url: 'http://localhost:5000/api/inventory/overview' },
  { service: 'Backend', url: 'http://localhost:5000/api/queues/overview' },
  { service: 'Backend', url: 'http://localhost:5000/api/shopper/overview' },
  { service: 'Backend', url: 'http://localhost:5000/api/stores' },
  { service: 'Backend', url: 'http://localhost:5000/api/alerts' },
  { service: 'Backend', url: 'http://localhost:5000/api/integrations' },
  { service: 'Backend', url: 'http://localhost:5000/api/products' },
  { service: 'Backend', url: 'http://localhost:5000/api/planogram/overview' },
  { service: 'Backend', url: 'http://localhost:5000/api/users' },
  { service: 'Backend', url: 'http://localhost:5000/api/settings' },

  // Frontend (5173)
  { service: 'Frontend', url: 'http://localhost:5173/' },
  { service: 'Frontend-Proxy', url: 'http://localhost:5173/api/health' },
  { service: 'Frontend-Proxy', url: 'http://localhost:5173/api/analytics/overview' },
];

function check(item) {
  return new Promise((resolve) => {
    const req = http.get(item.url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          service: item.service,
          url: item.url,
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 400,
          sample: data.slice(0, 60).replace(/\s+/g, ' '),
        });
      });
    });
    req.on('error', (err) => {
      resolve({
        service: item.service,
        url: item.url,
        status: 'ERR',
        ok: false,
        sample: err.message,
      });
    });
    req.setTimeout(4000, () => {
      req.destroy();
      resolve({
        service: item.service,
        url: item.url,
        status: 'TIMEOUT',
        ok: false,
        sample: 'Timeout after 4s',
      });
    });
  });
}

async function run() {
  console.log('\n--- VERIFYING ALL CONNECTIONS ACROSS 3 TIERS ---\n');
  const results = [];
  for (const ep of endpoints) {
    const res = await check(ep);
    results.push(res);
  }
  console.table(results);
  const allOk = results.every(r => r.ok);
  console.log('\n' + (allOk ? 'ALL ENDPOINTS ARE HEALTHY AND CONNECTED!' : 'SOME ENDPOINTS FAILED!') + '\n');
}

run();
