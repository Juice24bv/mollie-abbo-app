import { useState } from 'react';

const pakketten = [
  { id: 'FRUITFULL_COMBI', name: 'FRUITFULL COMBI', price: 18.84 },
  { id: 'HEALTHY_CHOICE', name: 'HEALTHY CHOICE', price: 18.84 },
  { id: 'RAINBOW_MIX', name: 'RAINBOW MIX', price: 18.84 },
  { id: 'STRONG_PACKAGE', name: 'STRONG PACKAGE', price: 18.84 },
];

const STATIEGELD = 0.90;
const VERZENDKOSTEN = 6.95;
const GRATIS_VERZENDEN_VANAF = 75;

export default function Dashboard() {
  const [selected, setSelected] = useState([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [akkoord, setAkkoord] = useState(false);

  const toggleSelect = (pakket) => {
    setSelected((prev) =>
      prev.some(p => p.id === pakket.id)
        ? prev.filter(p => p.id !== pakket.id)
        : [...prev, pakket]
    );
  };

  const subtotal = selected.reduce((sum, p) => sum + p.price, 0);
  const statiegeld = selected.length * STATIEGELD;
  const verzendkosten = subtotal < GRATIS_VERZENDEN_VANAF && selected.length > 0 ? VERZENDKOSTEN : 0;
  const totaal = (subtotal + statiegeld + verzendkosten).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name || selected.length === 0 || !akkoord) {
      alert('Vul alles in en vink het akkoord aan.');
      return;
    }

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, producten: selected, totaal: parseFloat(totaal) }),
    });

    const data = await res.json();
    if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    else alert('Fout bij starten betaling');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Abonnement afsluiten</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Naam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="E-mailadres"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <p className="font-medium text-gray-700 mb-2">Kies je pakket(ten):</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pakketten.map((pakket) => {
                const isSelected = selected.some(p => p.id === pakket.id);
                return (
                  <label
                    key={pakket.id}
                    className={`flex items-start border rounded-xl p-4 cursor-pointer transition hover:shadow gap-3 ${
                      isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(pakket)}
                      className="mt-1 w-5 h-5"
                    />
                    <div>
                      <h2 className="text-lg font-semibold">{pakket.name}</h2>
                      <p className="text-gray-600">€{pakket.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">+ €{STATIEGELD.toFixed(2)} statiegeld</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={akkoord}
              onChange={(e) => setAkkoord(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm text-gray-700">
              Ik ga akkoord met automatische incasso (IP en tijd worden geregistreerd)
            </span>
          </label>

          <div className="text-right text-sm text-gray-600">
            <p>Subtotaal: €{subtotal.toFixed(2)}</p>
            <p>Statiegeld: €{statiegeld.toFixed(2)}</p>
            <p>Verzendkosten: €{verzendkosten.toFixed(2)}</p>
            <p className="font-bold text-lg">Totaal: €{totaal}</p>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              disabled={!email || !name || selected.length === 0 || !akkoord}
            >
              Afrekenen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
