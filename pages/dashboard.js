export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Abonnement afsluiten</h1>
        <form className="space-y-6" method="POST" action="/api/checkout">
          <div>
            <label className="block text-sm font-medium text-gray-700">Naam</label>
            <input name="name" type="text" required className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mailadres</label>
            <input name="email" type="email" required className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kies je pakket</label>
            <select name="pakket" required className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-200">
              <option value="">-- Selecteer --</option>
              <option value="FRUITFULL_COMBI">FRUITFULL COMBI</option>
              <option value="HEALTHY_CHOICE">HEALTHY CHOICE</option>
              <option value="RAINBOW_MIX">RAINBOW MIX</option>
              <option value="VITAMINEBOOST">VITAMINEBOOST</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
            Abonnement starten
          </button>
        </form>
      </div>
    </div>
  );
}
