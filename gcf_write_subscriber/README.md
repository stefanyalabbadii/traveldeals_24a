# GCF: Add Subscriber to Firestore

This is a Google Cloud Function triggered by a PubSub message to the topic `travel_deals_signup`. It will write a new subscriber to the `subscribers` collection in your default Firestore database.

## Deployment Command
**Ensure you have an active Google Cloud Project**
```
gcloud functions deploy write_subscriber \
--entry-point addSubscriberToFirestore \
--runtime nodejs18 \
--trigger-event=providers/cloud.pubsub/eventTypes/topic.publish \
--trigger-topic=travel_deals_signup
```
```
gcloud functions deploy addSubscriberToFirestore \
    --runtime nodejs18 \      
    --trigger-topic addSubscriberToFirestore \
    --entry-point addSubscriberToFirestore \
    --region us-central1 \
    --project sp24-41200-sfalabba-traveldeal \ 
```
