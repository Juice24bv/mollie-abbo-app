import { useState } from 'react';

const pakketten = [
  { id: 'FRUITFULL_COMBI', name: 'FRUITFULL COMBI', price: 18.84 },
  { id: 'HEALTHY_CHOICE', name: 'HEALTHY CHOICE', price: 18.84 },
  { id: 'RAINBOW_MIX', name: 'RAINBOW MIX', price: 18.84 },
  { id: 'FITNESS_BOX', name: 'FITNESS BOX', price: 18.84 },
];

export default function Dashboard() {
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleProduct = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const producten = pakketten.filter((p) => selected.includes(p.id));
    const totaal = producten.reduce((acc, p) => acc + p.price, 0);

    if (!name || !email || producten.length === 0) {
      alert('Vul naam, e-mailadres in en selecteer minstens één pakket.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, producten, totaal }),
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert('Fout bij aanmaken betaling');
      }
    } catch (err) {
      console.error(err);
      alert('Er is iets misgegaan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Kies je abonnement</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pakketten.map((pakket) => (
              <div
                key={pakket.id}
                onClick={() => toggleProduct(pakket.id)}
                className={`border rounded-md p-4 cursor-pointer transition ${
                  selected.includes(pakket.id)
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300'
                }`}
              >
                <div className="font-medium">{pakket.name}</div>
                <div className="text-sm text-gray-600">€ {pakket.price.toFixed(2)}</div>
                <div className="mt-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(pakket.id)}
                    onChange={() => toggleProduct(pakket.id)}
                  />{' '}
                  Selecteer
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Naam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-md p-3"
              required
            />
            <input
              type="email"
              placeholder="E-mailadres"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md p-3"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md"
          >
            {loading ? 'Bezig met verwerken...' : 'Start abonnement'}
          </button>
        </form>
      </div>
    </div>
  );
}
