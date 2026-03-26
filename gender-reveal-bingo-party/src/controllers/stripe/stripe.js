
import { createGameForUserId } from '../../models/games/games.js';
import { requireLogin } from "../../middleware/auth.js";

import express from 'express';
import Stripe from 'stripe';

const stripeKey = process.env.NODE_ENV.includes('dev')
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY;

const priceId = process.env.NODE_ENV.includes('dev')
    ? process.env.STRIPE_TEST_PRICE_ID
    : process.env.STRIPE_PRICE_ID;

const stripeWebhookSecret = process.env.NODE_ENV.includes('dev')
    ? process.env.STRIPE_WEBHOOK_SECRET
    : process.env.STRIPE_TEST_WEBHOOK_SECRET;

const baseURL = process.env.BASE_URL;

const stripe = new Stripe(stripeKey);

const router = express.Router();

// Logic: Create Checkout Session
export const handleCreateCheckout = async (req, res) => {

    console.log('\nCreating Stripe checkout session!');

    try {
        const userId = req.session.user.id;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'payment',
            success_url: `${baseURL}/purchase-game/purchase-confirmation`,
            cancel_url: `${baseURL}/my-games`,
            metadata: { userId }
        });
        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const handleStripeWebhook = async (req, res) => {

    // CLI command: stripe listen --forward-to http://127.0.0.1:3000/purchase-game/webhook
    console.log('\nReceived POST request from Stripe!');

    const sig = req.headers['stripe-signature'];
    let event;

    // 1. Verify the request is actually from Stripe
    try {
        // We use req.rawBody because stripe.webhooks.constructEvent 
        // REQUIRES the raw buffer, not the parsed JSON object.
        const payload = req.rawBody || req.body;

        if (!payload || (Buffer.isBuffer(payload) === false && typeof payload !== 'string')) {
            throw new Error('Raw body not found. Check your middleware configuration in server.js.');
        }

        event = stripe.webhooks.constructEvent(
            payload,
            sig,
            stripeWebhookSecret
        );
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        // Log this specifically to see if it's a "No raw body" issue or a "Wrong Secret" issue
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 2. Handle the specific event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const userId = session.metadata.userId;
            const sessionId = session.id;

            console.log(`  Processing fulfillment for user ID: ${userId}...`);

            try {
                await createGameForUserId(userId, sessionId);
                console.log('  Game created successfully in database!');
            } catch (dbError) {
                console.error('  Database insertion failed:', dbError);
                // Return a 500 so Stripe knows to retry this specific event later
                return res.status(500).send('  Internal Server Error');
            }
            break;

        default:
            console.log(`  Unhandled event type ${event.type}`);
    }

    // 4. Always respond with a 200 to acknowledge receipt
    res.status(200).json({ received: true });
};

const purchaseConfirmationPage = async (req, res, next) => {
    res.render('purchase/purchase-confirmation', {
        title: 'Purchase Confirmation | Gender Reveal Bingo Party'
    });
}

// Map the functions to the routes
router.post('/create-checkout-session', requireLogin, express.json(), handleCreateCheckout);
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
router.get('/purchase-confirmation', requireLogin, purchaseConfirmationPage);

export default router;
