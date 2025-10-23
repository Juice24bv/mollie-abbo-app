import { useState } from 'react';

const pakketten = [
  { id: 'FRUITFULL_COMBI', name: 'FRUITFULL COMBI', price: 18.84, statiegeld: 0.9 },
  { id: 'HEALTHY_CHOICE', name: 'HEALTHY CHOICE', price: 18.84, statiegeld: 0 },
  { id: 'RAINBOW_MIX', name: 'RAINBOW MIX', price: 18.84, statiegeld: 0.75 },
  { id: 'STRONG_PACKAGE', name: 'STRONG PACKAGE', price: 18.84, statiegeld: 0.75 },
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

  const subtotal = selected.reduce((acc, p) => acc + p.price, 0);
  const statiegeld = selected.reduce((acc, p) => acc + p.statiegeld, 0);
  const verzendkosten = subtotal < 75 ? 6.95 : 0;
  const totaal = subtotal + statiegeld + verzendkosten;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name || selected.length === 0 || !akkoord) {
      alert('Vul alle velden in en geef akkoord voor automatische incasso.');
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
                  <p className="text-gray-600">Prijs: €{pakket.price.toFixed(2)}</p>
                  <p className="text-gray-500 text-sm">Statiegeld: €{pakket.statiegeld.toFixed(2)}</p>
                </label>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>Subtotaal: €{subtotal.toFixed(2)}</p>
            <p>Statiegeld: €{statiegeld.toFixed(2)}</p>
            {verzendkosten > 0 && <p>Verzendkosten: €{verzendkosten.toFixed(2)}</p>}
            <p className="text-lg font-bold mt-2">Totaal: €{totaal.toFixed(2)}</p>
          </div>

          <label className="flex items-start space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={akkoord}
              onChange={(e) => setAkkoord(e.target.checked)}
              className="mt-1"
            />
            <span>
              Door deze betaling te doen, geef je <strong>Juice24 b.v.</strong> toestemming om
              toekomstige betalingen automatisch via SEPA-incasso af te schrijven. Je kunt deze
              toestemming op elk moment intrekken. (IP en tijd worden geregistreerd)
            </span>
          </label>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full"
            disabled={!email || !name || selected.length === 0 || !akkoord}
          >
            Afrekenen
          </button>
        </form>
      </div>
    </div>
  );
}
