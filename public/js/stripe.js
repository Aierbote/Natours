/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51Paf8EHkMupqreso7gTbWBTw6HfkGouzIkviV611JS1pt7F2X0DuOiCJNnKtDzvBRWiU4e86nOP5z1hp3R1OJuxW008nix8yzO',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get Checkout Session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create Checkout Form + Charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
