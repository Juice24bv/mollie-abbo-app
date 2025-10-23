import { useState } from 'react';

const pakketten = [
  { id: 'FRUITFULL_COMBI', name: 'FRUITFULL COMBI', price: 18.84 },
  { id: 'HEALTHY_CHOICE', name: 'HEALTHY CHOICE', price: 18.84 },
  { id: 'RAINBOW_MIX', name: 'RAINBOW MIX', price: 18.84 },
  { id: 'STRONG_PACKAGE', name: 'STRONG PACKAGE', price: 18.84 },
];

export default function Dashboard() {
  const [selected, setSelected] = useState([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const toggleSelect = (pakket) => {
    setSelected((prev) =>
      prev.some(p => p.id === pakket.id)
        ? prev.filter(p => p.id !== pakket.id)
        : [...prev, pakket]
    );
  };

  const totaal = selected.reduce((acc, p) => acc + p.price, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name || selected.length === 0) return alert('Alles invullen svp.');

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, producten: selected, totaal }),
    });

    const data = await res.json();
    if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    else alert('Fout bij starten betaling');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Kies je abonnement</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {pakketten.map((pakket) => (
            <div
              key={pakket.id}
              onClick={() => toggleSelect(pakket)}
              className={`border rounded-xl p-4 cursor-pointer transition ${
                selected.some(p => p.id === pakket.id)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <h2 className="text-xl font-semibold">{pakket.name}</h2>
              <p className="text-gray-600">€{pakket.price.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
          <input
            type="text"
            placeholder="Naam"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="email"
            placeholder="E-mailadres"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Totaal: €{totaal.toFixed(2)}</span>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Neem abonnement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
