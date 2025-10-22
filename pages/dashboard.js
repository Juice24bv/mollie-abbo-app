import { useState } from 'react';

const PRODUCTEN = [
  { id: 'FRUITFULL_COMBI', name: 'FRUITFULL COMBI', price: 18.84 },
  { id: 'HEALTHY_CHOICE', name: 'HEALTHY CHOICE', price: 18.84 },
  { id: 'RAINBOW_MIX', name: 'RAINBOW MIX', price: 18.84 },
  { id: 'STRONG_PACKAGE', name: 'STRONG PACKAGE', price: 18.84 }
];

export default function AbonnementFormulier() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [geselecteerd, setGeselecteerd] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSelectie = (id) => {
    setGeselecteerd((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const startBetaling = async () => {
    const geselecteerdeProducten = PRODUCTEN.filter((p) => geselecteerd.includes(p.id));
    const totaal = geselecteerdeProducten.reduce((sum, p) => sum + p.price, 0);

    const productenPayload = geselecteerdeProducten.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: 1
    }));

    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, producten: productenPayload, totaal })
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert('Fout bij starten betaling');
      }
    } catch (error) {
      console.error('Betalingsfout:', error);
      alert('Er ging iets mis bij het starten van de betaling.');
    } finally {
      setLoading(false);
    }
  };

  const totaal = PRODUCTEN.reduce((sum, p) =>
    geselecteerd.includes(p.id) ? sum + p.price : sum, 0);

  return (
    <div className="max-w-md mx-auto p-6 border rounded-xl shadow-xl">
      <h1 className="text-xl font-bold mb-4">Stel je abonnement samen</h1>

      <label className="block mb-2">Naam</label>
      <input
        type="text"
        className="border p-2 w-full mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Jouw naam"
      />

      <label className="block mb-2">E-mail</label>
      <input
        type="email"
        className="border p-2 w-full mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@example.com"
      />

      <label className="block mb-2">Selecteer pakketten</label>
      <div className="mb-4">
        {PRODUCTEN.map((product) => (
          <label key={product.id} className="block mb-2 cursor-pointer">
            <input
              type="checkbox"
              className="mr-2"
              checked={geselecteerd.includes(product.id)}
              onChange={() => toggleSelectie(product.id)}
            />
            {product.name} – €{product.price.toFixed(2)}
          </label>
        ))}
      </div>

      <div className="font-semibold mb-4">Totaal: €{totaal.toFixed(2)}</div>

      <button
        onClick={startBetaling}
        className="bg-black text-white px-4 py-2 w-full"
        disabled={loading || !email || !name || geselecteerd.length === 0}
      >
        {loading ? 'Verwerken...' : 'Start met iDEAL betaling'}
      </button>
    </div>
  );
}