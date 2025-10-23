import { useState } from 'react';

const productenLijst = [
  { id: 'RAINBOW_MIX', name: 'Rainbow Mix', price: 18.84 },
  { id: 'FRUITFULL_COMBI', name: 'Fruitfull Combi', price: 18.84 },
  { id: 'HEALTHY_CHOICE', name: 'Healthy Choice', price: 18.84 },
  { id: 'IMMUNE_BOOST', name: 'Immune Boost', price: 18.84 },
];

export default function Dashboard() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    producten: [],
  });

  const toggleProduct = (product) => {
    const exists = formData.producten.find((p) => p.id === product.id);
    const nieuweProducten = exists
      ? formData.producten.filter((p) => p.id !== product.id)
      : [...formData.producten, product];

    setFormData({ ...formData, producten: nieuweProducten });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totaal = formData.producten.reduce(
      (acc, p) => acc + p.price * (p.quantity || 1),
      0
    );

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totaal,
        }),
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert('Fout bij aanmaken betaling.');
      }
    } catch (err) {
      console.error(err);
      alert('Er is iets misgegaan.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Abonnement kiezen</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input
          type="text"
          placeholder="Naam"
          className="w-full border p-2 rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="E-mailadres"
          className="w-full border p-2 rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <div className="space-y-2">
          {productenLijst.map((product) => (
            <label key={product.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.producten.some((p) => p.id === product.id)}
                onChange={() => toggleProduct(product)}
              />
              <span>
                {product.name} – €{product.price.toFixed(2)}
              </span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Start betaling
        </button>
      </form>
    </div>
  );
}
