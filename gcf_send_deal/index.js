require('dotenv').config();
const {Firestore} = require('@google-cloud/firestore');
const sgMail = require('@sendgrid/mail');

exports.sendEmailToSubscribers = async (event, context) => {
  console.log(`Function triggered by event on: ${context.resource}`);
  console.log(`Event type: ${context.eventType}`);

  try {
    const newDeal = event.value.fields;
    const headline = newDeal.headline.stringValue;

    // Check if locations exist and have the expected structure
    let locations = [];
    if (newDeal.locations && newDeal.locations.arrayValue && newDeal.locations.arrayValue.values) {
      locations = newDeal.locations.arrayValue.values.map(loc => loc.stringValue);
    } else {
      console.log('Locations data is missing or not in the expected format.');
    }

    console.log("Headline:", headline);
    console.log("Locations:", locations);

    // Connect to the Firestore database
    const db = new Firestore({
      projectId: "sp24-41200-sfalabba-traveldeal"
    });

    // Reference to the "subscribers" collection
    const subscribersRef = db.collection('subscribers');

    const querySnapshot = await subscribersRef
      .where('watch_regions', 'array-contains-any', locations)
      .get();

    console.log(`Number of subscribers for the deal: ${querySnapshot.size}`);

    if (querySnapshot.empty) {
      console.log('No matching subscribers found.');
      return;
    }

    // Set up SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Iterate through the matching subscribers and send email notifications
    for (const doc of querySnapshot.docs) {
      const subscriber = doc.data();
      const subscriberEmail = subscriber.email_address;

      // Compose the email message
      const msg = {
        to: subscriberEmail,
        from: process.env.SENDGRID_SENDER,
        subject: `New Deal Alert Stefany Alabbadi: ${headline}`,
        text: `Hey, check out this new deal: ${headline} in ${locations.join(', ')}.`,
        html: `<strong>Hey, check out this new deal:</strong> ${headline} in <em>${locations.join(', ')}</em>.`
      };

      try {
        await sgMail.send(msg);
        console.log(`Email notification sent to ${subscriberEmail}`);
      } catch (error) {
        console.error(`Error sending email to ${subscriberEmail}:`, error);
      }
    }
  } catch (error) {
    console.error('Error querying Firestore or sending email:', error);
    console.log(`Error details: ${error.message}`);
  }
};
