// webhook.js
import mollieClient from '@mollie/api-client';
import moment from 'moment';
import express from 'express';

const mollie = mollieClient({ apiKey: process.env.MOLLIE_API_KEY });
const app = express();
app.use(express.json());

// ✅ Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const paymentId = req.body.id;
    console.log(`➡️ Webhook ontvangen voor betaling: ${paymentId}`);

    // Altijd actuele status ophalen (webhook is niet betrouwbaar qua timing)
    const payment = await mollie.payments.get(paymentId);

    // Debug info
    console.log('Betalingsstatus:', payment.status);
    console.log('CustomerId:', payment.customerId);
    console.log('MandateId:', payment.mandateId);
    console.log('Metadata:', payment.metadata);

    // Alleen doorgaan bij succesvolle betaling
    if (payment.status !== 'paid') {
      console.log('❌ Betaling nog niet afgerond — abonnement niet aangemaakt.');
      return res.sendStatus(200);
    }

    // Controleren of klant en mandate bestaan
    if (!payment.customerId || !payment.mandateId) {
      console.log('⚠️ Geen klant of mandate gevonden — kan geen abonnement aanmaken.');
      return res.sendStatus(200);
    }

    // Metadata uitlezen
    const producten = payment.metadata?.producten || [];
    const klantEmail = payment.metadata?.email;
    const klantNaam = payment.metadata?.name;
    const totaal = payment.metadata?.totaal;

    // ✅ Maak abonnement aan met startdatum 7 dagen na vandaag
    const startDate = moment().add(7, 'days').format('YYYY-MM-DD');

    const subscription = await mollie.customers_subscriptions.create({
      customerId: payment.customerId,
      amount: {
        value: totaal.toFixed(2),
        currency: 'EUR'
      },
      interval: '7 days',
      startDate,
      description: `Abonnement voor ${klantNaam || 'klant'}`,
      mandateId: payment.mandateId,
      metadata: { producten }
    });

    console.log(`✅ Abonnement aangemaakt: ${subscription.id}, start op ${startDate}`);
    return res.sendStatus(200);
  } catch (err) {
    console.error('💥 Fout bij webhook-verwerking:', err);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Webhook-server draait op poort 3000'));
