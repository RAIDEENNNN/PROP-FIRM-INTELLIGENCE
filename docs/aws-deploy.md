# AWS deployment plan

Recommended MVP AWS setup:

1. Containerize the app with the included `Dockerfile`.
2. Push the image to Amazon ECR.
3. Run it on AWS App Runner or ECS Fargate.
4. Use Route 53 for the domain.
5. Use AWS Certificate Manager for HTTPS.
6. Move storage from `data/db.json` to DynamoDB or RDS PostgreSQL before serious traffic.
7. Store payout proof files in S3.
8. Put CloudFront in front of the app when traffic grows.

## App Runner path

App Runner is the fastest AWS route for this MVP because it can run the Node backend and serve the front-end from one container.

Production environment variables to add later:

```text
PORT=3000
DATABASE_URL=
S3_BUCKET=
AFFILIATE_SECRET=
ADMIN_JWT_SECRET=
```

## Important note

The current backend is intentionally file-based so it runs immediately without installing dependencies. Before launch, replace `data/db.json` with a managed database.
