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

  const pakketTotaal = selected.reduce((acc, p) => acc + p.price, 0);
  const statiegeld = selected.length * 0.90;
  const verzendkosten = pakketTotaal < 75 && selected.length > 0 ? 6.95 : 0;
  const totaal = pakketTotaal + statiegeld + verzendkosten;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name || selected.length === 0 || !akkoord) {
      alert('Vul alles in en vink akkoord aan.');
      return;
    }

    const metadata = {
      producten: selected,
      email,
      name,
      totaal,
      akkoord: true,
      ip: window.location.hostname,
      timestamp: new Date().toISOString()
    };

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metadata),
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
                  className={`border rounded-xl p-4 cursor-pointer transition hover:shadow ${selected.some(p => p.id === pakket.id) ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}`}
                >
                  <h2 className="text-lg font-semibold">{pakket.name}</h2>
                  <p className="text-gray-600">€{pakket.price.toFixed(2)}</p>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-start space-x-2">
            <input
              type="checkbox"
              className="mt-1"
              checked={akkoord}
              onChange={(e) => setAkkoord(e.target.checked)}
            />
            <span className="text-sm text-gray-700">
              Ik geef <strong>Juice24 B.V.</strong> toestemming om maandelijks af te schrijven via SEPA-incasso.
              Mijn IP-adres en akkoord worden vastgelegd.
            </span>
          </label>

          <div className="text-sm text-gray-600 space-y-1">
            <p>Subtotaal pakketten: €{pakketTotaal.toFixed(2)}</p>
            <p>Statiegeld: €{statiegeld.toFixed(2)}</p>
            {verzendkosten > 0 && <p>Verzendkosten: €{verzendkosten.toFixed(2)}</p>}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-lg font-semibold">Totaal: €{totaal.toFixed(2)}</span>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
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
