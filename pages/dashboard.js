import mollieClient from '@mollie/api-client';
const mollie = mollieClient({ apiKey: process.env.MOLLIE_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, producten } = req.body;

  if (!name || !email || !producten || !Array.isArray(producten) || producten.length === 0) {
    return res.status(400).json({ error: 'Ongeldige of ontbrekende invoer' });
  }

  // Prijs per product (bijv. €18,84) — aangepast aan jouw producten
  const prijsPerStuk = 18.84;

  const totaal = prijsPerStuk * producten.length;

  try {
    const customer = await mollie.customers.create({ name, email });

    const payment = await mollie.payments.create({
      amount: {
        currency: 'EUR',
        value: totaal.toFixed(2)
      },
      customerId: customer.id,
      sequenceType: 'first',
      method: 'ideal',
      description: `Abonnement: ${producten.join(', ')}`,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/confirmed`,
      webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook-mollie`,
      metadata: {
        producten: producten.map(p => ({
          id: p,
          name: p,
          price: prijsPerStuk,
          quantity: 1
        })),
        email,
        name,
        totaal
      }
    });

    res.status(200).json({ checkoutUrl: payment.getCheckoutUrl() });
  } catch (error) {
    console.error('Mollie API fout:', error);
    res.status(500).json({ error: 'Fout bij aanmaken betaling' });
  }
}
