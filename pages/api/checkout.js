import mollieClient from '@mollie/api-client';
const mollie = mollieClient({ apiKey: process.env.MOLLIE_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, email, producten, totaal, akkoord } = req.body;

  if (!producten || !email || !name || !totaal || !akkoord) {
    return res.status(400).json({ error: 'Ongeldige invoer of geen akkoord' });
  }

  try {
    const customer = await mollie.customers.create({ name, email });
    const payment = await mollie.payments.create({
      amount: { currency: 'EUR', value: totaal.toFixed(2) },
      customerId: customer.id,
      sequenceType: 'first',
      method: 'ideal',
      description: `Abonnement: ${producten.map(p => p.name).join(', ')}`,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/confirmed`,
      webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook-mollie`,
      metadata: {
        producten,
        email,
        name,
        totaal,
        akkoord,
        timestamp: new Date().toISOString()
      }
    });

    res.status(200).json({ checkoutUrl: payment.getCheckoutUrl() });
  } catch (error) {
    console.error('Mollie API fout:', error);
    res.status(500).json({ error: 'Mislukt bij aanmaken betaling' });
  }
}
