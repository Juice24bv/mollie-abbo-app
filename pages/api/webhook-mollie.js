import mollieClient from '@mollie/api-client';

const mollie = mollieClient({ apiKey: process.env.MOLLIE_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const paymentId = req.body.id;

  if (!paymentId) {
    console.error('Webhook ontvangen zonder payment ID');
    return res.status(400).end();
  }

  try {
    const payment = await mollie.payments.get(paymentId);

    console.log('✅ Webhook ontvangen voor betaling:', payment.id);
    console.log('Metadata:', payment.metadata);

    if (payment.isPaid() && payment.sequenceType === 'first') {
      const { producten, email, name, totaal } = payment.metadata || {};

      if (!producten || !email || !name || !totaal) {
        console.warn('❌ Onvolledige metadata bij betaling:', payment.id);
        return res.status(400).end();
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7); // start over 7 dagen

      await mollie.customers_subscriptions.create({
        customerId: payment.customerId,
        amount: {
          currency: 'EUR',
          value: parseFloat(totaal).toFixed(2),
        },
        interval: '1 month',
        startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD
        description: `Abonnement: ${producten.map(p => p.name).join(', ')}`,
        webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook-mollie`,
        metadata: { email, name, producten },
      });

      console.log('✅ Abonnement aangemaakt met startdatum:', startDate.toISOString().split('T')[0]);
    } else {
      console.log('ℹ️ Geen abonnement aangemaakt — betaling niet betaald of geen eerste betaling');
    }

    res.status(200).end();
  } catch (error) {
    console.error('❌ Webhook fout:', error);
    res.status(500).end();
  }
}
