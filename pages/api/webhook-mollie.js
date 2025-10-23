import mollieClient from '@mollie/api-client';
const mollie = mollieClient({ apiKey: process.env.MOLLIE_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const paymentId = req.body.id;
  if (!paymentId) return res.status(400).end();

  try {
    const payment = await mollie.payments.get(paymentId);

    console.log('✅ Webhook ontvangen voor betaling:', payment.id);
    console.log('Metadata:', payment.metadata);

    if (payment.status === 'paid' && payment.sequenceType === 'first') {
      const { producten, email, name, totaal } = payment.metadata || {};

      if (!producten || !email || !totaal) {
        console.warn('⚠️ Onvolledige metadata, betaling ID:', payment.id);
        return res.status(200).end(); // Exit zonder fout
      }

      await mollie.customers_subscriptions.create({
        customerId: payment.customerId,
        amount: {
          currency: 'EUR',
          value: parseFloat(totaal).toFixed(2),
        },
        interval: '1 month',
        description: `Abonnement: ${producten.map(p => p.name).join(', ')}`,
        webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook-mollie`,
        metadata: { email, producten },
      });

      console.log('✅ Subscription succesvol aangemaakt voor', email);
    }

    res.status(200).end();
  } catch (err) {
    console.error('❌ Webhook fout:', err);
    res.status(500).end();
  }
}
