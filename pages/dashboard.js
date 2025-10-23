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
  const [akkoord, setAkkoord] = useState(false);

  const toggleSelect = (pakket) => {
    setSelected((prev) =>
      prev.some(p => p.id === pakket.id)
        ? prev.filter(p => p.id !== pakket.id)
        : [...prev, pakket]
    );
  };

  const statiegeld = selected.length * 0.90;
  const subtotal = selected.reduce((sum, p) => sum + p.price, 0);
  const verzending = subtotal < 75 && subtotal > 0 ? 6.95 : 0;
  const totaal = subtotal + statiegeld + verzending;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name || selected.length === 0 || !akkoord) {
      alert('Vul alles in en ga akkoord met automatische incasso.');
      return;
    }

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

          <div className="space-y-4">
            <p className="font-medium text-gray-700">Kies je pakket(ten):</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pakketten.map((pakket) => (
                <label
                  key={pakket.id}
                  onClick={() => toggleSelect(pakket)}
                  className={`border rounded-xl p-4 cursor-pointer transition hover:shadow ${
                    selected.some(p => p.id === pakket.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <h2 className="text-lg font-semibold">{pakket.name}</h2>
                  <p className="text-gray-600">€{pakket.price.toFixed(2)}</p>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-2 bg-gray-50 border rounded-lg p-3">
            <input
              type="checkbox"
              checked={akkoord}
              onChange={(e) => setAkkoord(e.target.checked)}
              className="mt-1 w-5 h-5 flex-shrink-0"
            />
            <span className="text-sm text-gray-700 leading-snug">
              Door deze betaling te doen, geef je <strong>Juice24 B.V.</strong> toestemming om toekomstige betalingen automatisch via SEPA-incasso af te schrijven.
              Je kunt deze toestemming op elk moment intrekken.
            </span>
          </label>

          <div className="text-sm text-gray-500 space-y-1">
            <p>Producten: €{subtotal.toFixed(2)}</p>
            <p>Statiegeld: €{statiegeld.toFixed(2)}</p>
            {verzending > 0 && <p>Verzendkosten: €{verzending.toFixed(2)}</p>}
            <p className="text-lg font-semibold text-gray-800">Totaal: €{totaal.toFixed(2)}</p>
          </div>

          <div className="flex justify-end">
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
