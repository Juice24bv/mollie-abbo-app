import mollieClient from '@mollie/api-client';

const mollie = mollieClient({ apiKey: process.env.MOLLIE_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const paymentId = req.body.id;
    console.log(`➡️ Webhook ontvangen voor betaling: ${paymentId}`);

    const payment = await mollie.payments.get(paymentId);

    console.log('Betalingsstatus:', payment.status);
    console.log('CustomerId:', payment.customerId);
    console.log('MandateId:', payment.mandateId);

    if (payment.status !== 'paid') {
      console.log('❌ Betaling niet afgerond — geen abonnement aangemaakt.');
      return res.status(200).end();
    }

    if (!payment.customerId || !payment.mandateId) {
      console.log('⚠️ Geen klant of mandate gevonden — geen abonnement aangemaakt.');
      return res.status(200).end();
    }

    const { producten, name, totaal, ip, timestamp } = payment.metadata || {};
    const klantNaam = name || 'klant';

    const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const subscription = await mollie.customers_subscriptions.create({
      customerId: payment.customerId,
      amount: {
        value: totaal.toFixed(2),
        currency: 'EUR',
      },
      interval: '7 days',
      startDate,
      description: `Abonnement voor ${klantNaam}`,
      mandateId: payment.mandateId,
      metadata: { producten, ip, timestamp }
    });

    console.log(`✅ Abonnement aangemaakt: ${subscription.id}, start op ${startDate}`);
    console.log(`📌 SEPA toestemming vastgelegd — IP: ${ip}, Tijd: ${timestamp}`);

    return res.status(200).end();
  } catch (err) {
    console.error('💥 Fout bij webhook-verwerking:', err);
    return res.status(500).end();
  }
}
