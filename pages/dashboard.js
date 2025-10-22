import { useState } from 'react';

export default function Dashboard() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [producten, setProducten] = useState([]);
  const [redirect, setRedirect] = useState(null);

  const productenLijst = [
    { id: 'RAINBOW_MIX', name: 'RAINBOW MIX', price: 18.84 },
    { id: 'HEALTHY_CHOICE', name: 'HEALTHY CHOICE', price: 18.84 },
    { id: 'FRUITFULL_COMBI', name: 'FRUITFULL COMBI', price: 18.84 },
  ];

  const toggleProduct = (product) => {
    setProducten(prev =>
      prev.find(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totaal = producten.reduce((acc, p) => acc + p.price, 0);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, producten, totaal })
    });
    const data = await res.json();
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Kies je abonnement</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Naam" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        {productenLijst.map(product => (
          <div key={product.id}>
            <label>
              <input
                type="checkbox"
                checked={!!producten.find(p => p.id === product.id)}
                onChange={() => toggleProduct(product)}
              />
              {product.name} - €{product.price.toFixed(2)}
            </label>
          </div>
        ))}
        <button type="submit">Neem abonnement</button>
      </form>
    </div>
  );
}