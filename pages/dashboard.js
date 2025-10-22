import { useState } from 'react';

export default function Dashboard() {
  const [formData, setFormData] = useState({ name: '', email: '', producten: [], totaal: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.checkoutUrl) window.location.href = data.checkoutUrl;
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Naam" onChange={e => setFormData({ ...formData, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setFormData({ ...formData, email: e.target.value })} />
      <button type="submit">Start betaling</button>
    </form>
  );
}
