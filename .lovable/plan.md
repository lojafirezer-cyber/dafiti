

# Fix BlackCat API Key (401 Error)

## Problem
The `create-payment` backend function returns a 401 "Invalid API key" error because the stored `BLACKCAT_API_KEY` secret has an incorrect value.

## Solution
1. Update the `BLACKCAT_API_KEY` secret with the correct **Private Key**: `sk_nuSulU54aOeREJxNdpGd0KFW4TKs5yUkEgqkU_bN_x4znZC4`
2. Redeploy the `create-payment` and `check-payment-status` backend functions so they pick up the new key

## Technical Details
- The edge function sends the key via the `X-API-Key` header to `https://api.blackcatpagamentos.online/api/sales/create-sale`
- The **Private Key** (prefix `sk_`) is the correct one for server-side API calls
- The **Public Key** (prefix `apk_`) is not needed for this integration
- No code changes are required -- only the secret value needs updating

