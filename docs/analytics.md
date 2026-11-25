# SJQ analytics

GA4 account: SJQ Lab (417423252). Property: sjqlab.top (565759478).
Web stream: 16409255624. Measurement ID: G-478KL1B433.
Dashboard: https://analytics.google.com/analytics/web/#/a417423252p565759478/reports/intelligenthome
Reporting timezone: Sydney. Reporting currency: CNY (current product prices).

`assets/i18n.js` loads `analytics.js` on each existing page. Analytics is consent-gated and production-only. Enhanced measurement, optional account data sharing, advertising personalisation and Google Signals are disabled. No form values or report contents are sent. Page URLs exclude query strings and fragments. Referrers are reduced to origin. Source parameters accept only tiktok, douyin, share_card, instagram and youtube. Campaigns accept product labels or `video_` followed by up to 32 lowercase alphanumeric, underscore or hyphen characters.

Events:

| Event | Meaning |
| --- | --- |
| page_view | A page view, after consent |
| calculator_complete | A successful height calculation |
| report_offer_click | A non-blocked report CTA click |
| report_checkout_click | Clicking the outbound Stripe payment button, NOT payment success |
| share_card_download | Download requested |
| share_card_share | Device share action completed |
| share_link_copy | Calculator link copied |

Action events are deduplicated per page load and product. For rates, use distinct users in the same period and matching product cohort, not event counts divided by page views. Repeated visits and multiple devices mean a GA user is not necessarily a unique person.

## Metrics and limits

- Checkout-intent rate: distinct users clicking the Stripe button / distinct users visiting the corresponding calculator during the same period. Use a funnel exploration to enforce entry and step order.
- Paid purchase rate: distinct verified buyers from that visitor cohort / its distinct measured visitors. This is NOT implemented yet. Stripe webhooks, an order store and consent-aware attribution are still needed.
- A `payment=success` URL or a browser-local unlock is NOT payment verification. Never emit `purchase` from either. No purchase event is emitted by this client.
- No historical data can be recovered for dates before installation. Consent choices and blockers limit coverage. Test visits after deployment appear in data.
- Local preview never sends to Google. On production, allow analytics and verify page_view and calculator_complete in GA4 Realtime.

Example campaign URL: https://sjqlab.top/pages/height-prediction.html?utm_source=tiktok&utm_medium=social&utm_campaign=video_height01

Report recovery across devices is not implemented by this integration. It needs server-side order verification, retained report data (with permission), and an authenticated retrieval method such as an email sign-in link.
