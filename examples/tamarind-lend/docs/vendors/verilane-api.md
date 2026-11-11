# Verilane API v2: integration notes

Kept by the mobile and KYC teams.

- Base URL: `https://api.verilane.example/v2`
- Authentication: `X-Api-Key` header. Keys are issued per customer account: one sandbox key and one live key. A live key can call every endpoint for that account.
- `POST /ocr` takes document images and returns name, date of birth, address and document number.
- `POST /liveness` takes selfie frames and returns a pass or fail and the best frame.
- `GET /verifications/{reference}` returns a past verification: the extracted fields and links to the stored images. References are sequential per account.
- Verilane keeps images for 30 days unless the customer deletes them sooner.
- The app calls `/ocr` and `/liveness` directly from the phone to save a round trip; the backend calls them for document re-checks.
- Key rotation: through the Verilane dashboard; the old key stops working at once.
