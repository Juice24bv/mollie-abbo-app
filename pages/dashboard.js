export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold text-center">Kies je abonnement</h1>

        <div>
          <label className="block mb-1 font-medium">Naam</label>
          <input type="text" name="name" required className="w-full border px-3 py-2 rounded-md" />
        </div>

        <div>
          <label className="block mb-1 font-medium">E-mailadres</label>
          <input type="email" name="email" required className="w-full border px-3 py-2 rounded-md" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Producten</label>
          <select name="producten" className="w-full border px-3 py-2 rounded-md">
            <option value="FRUITFULL_COMBI">Fruitfull Combi</option>
            <option value="HEALTHY_CHOICE">Healthy Choice</option>
            <option value="RAINBOW_MIX">Rainbow Mix</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Start betaling
        </button>
      </form>
    </div>
  );
}
