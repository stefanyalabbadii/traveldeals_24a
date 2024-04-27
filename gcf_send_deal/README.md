# GCF: Email Deal to Subscriber

This is a Google Cloud Function triggered by a new document in the `deals` collection in your default Firestore database. It will query the database to find all subscribers who are watching the region in the provided deal and will email the deal to them.

## Deployment Command
**Ensure you have an active Google Cloud Project**
```
gcloud functions deploy sendDealEmails \
--runtime nodejs18 \  
--trigger-event providers/cloud.firestore/eventTypes/document.create \
--trigger-resource projects/sp24-41200-sfalabba-traveldeal/databases/(default)/documents/deals/{dealId} \

```
```
gcloud functions deploy sendDealEmails \
--entry-point sendEmailToSubscribers \
--runtime nodejs18 \
--trigger-event "providers/cloud.firestore/eventTypes/document.write" \
--trigger-resource "projects/sp24-41200-sfalabba-traveldeal/databases/(default)/documents/deals/{pushId}"
--no-gen2
```
