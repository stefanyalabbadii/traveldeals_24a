const {Firestore} = require('@google-cloud/firestore');

exports.addSubscriberToFirestore = async (message, context) => {
  const firestore = new Firestore({
    projectId: 'sp24-41200-sfalabba-traveldeal'  
  });

  try {
    // Decode the incoming message data
    const incomingData = Buffer.from(message.data, 'base64').toString('utf-8');
    console.log('Incoming data:', incomingData);  // Log the incoming data

    const subscriberInfo = JSON.parse(incomingData); // Parse the incoming data

    // Prepare subscriber data
    const subscriberData = {
      email_address: String(subscriberInfo.email_address),  // Ensure email address is a string
      watch_regions: Array.isArray(subscriberInfo.watch_region) ? subscriberInfo.watch_region : [subscriberInfo.watch_region],  // Ensure watch_region is stored as an array
    };

    console.log('Subscriber data:', subscriberData);  // Log the prepared data

    // Reference to the 'subscribers' collection in Firestore
    const subscribersRef = firestore.collection('subscribers');

    // Add the subscriber data to Firestore
    const documentReference = await subscribersRef.add(subscriberData);

    console.log(`New subscriber document added with ID: ${documentReference.id}`);
  } catch (error) {
    // Handle and log errors
    console.error(`Error adding document to Firestore: ${error}`);
  }
};
