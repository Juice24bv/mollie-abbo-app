export default function ConfirmedPage() {
  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Bedankt voor je bestelling!</h1>
      <p className="mb-4">Je betaling is ontvangen. Je abonnement wordt verwerkt.</p>
      <a href="/dashboard" className="underline text-blue-600">Terug naar dashboard</a>
    </div>
  );
}
