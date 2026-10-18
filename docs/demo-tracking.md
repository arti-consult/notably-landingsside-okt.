# Demo measurement — browser/modal only

This adds two reporting events using the existing SDK owner and current purpose-specific consent. The signup handler, `start_trial_click`, native Google Ads signup action, app `StartTrial`, consent client, attribution forwarding, provider IDs and campaign goals are unchanged.

| Trigger | GA4 (analytics consent) | Meta (advertising consent) |
| --- | --- | --- |
| A real pointer/keyboard activation that opens the demo modal | `demo_click` | `DemoClick` |
| A server-confirmed booking in that modal | `demo_booked` | `DemoBooked` |

Only bounded CTA placement (`button_id`), public `page_path` and an event ID are supplied as event parameters. The booking ID is used only for stable event identity (`demo_<UUID>`); no meeting time, customer name, email, company, agenda, join URL or management token is sent to providers. The existing SDK URL sanitization remains in force.

## Confirmation contract

Notably OS sends this message only after the booking API returns `status: 'created'`, a valid start time and the existing booking UUID, excluding honeypot responses:

```json
{
  "type": "notably:booking",
  "status": "booked",
  "start": "2026-10-20T08:00:00.000Z",
  "confirmation": { "version": 1, "id": "d7f45c9a-12a8-4d9a-9412-11b200982ee3" }
}
```

The landing validates both the exact origin `https://os.notably.no` and the currently mounted iframe window. Legacy `booked` messages still work for the modal UI, but do not create conversion events. Failed, uncertain, cancelled and bot-trap attempts do not create a confirmation. Pressing the submit button alone never counts as a booking.

Repeated confirmation messages are consumed once per booking in page memory, across modal reopenings/remounts. Consent is checked at event time. An event received without permission is not queued or replayed following a later grant. No new cookies, storage, server tracking queue or consent bridge is introduced. Provider failure must not interrupt booking.

## Scope and rollout

- This version measures modal openings and confirmations. Ctrl/Cmd/middle-click and booking in a separate tab are outside this measurement path. The modal's “Åpne i ny fane” escape link remains usable and is not counted as another modal opening.
- Both the landing change and the companion Notably OS embed change must be deployed for confirmed-booking measurement. They can be deployed in either order; the landing fails closed on older messages. No database migration or app-v2 change is needed.
- This code sends GA4 events and Meta custom events. It does **not** create Google Ads conversion actions, import GA4 events, create Meta custom conversions, or change bidding/campaign goals. Any later Ads action should use a separate demo destination and be explicitly configured as Secondary; never reuse the signup destination or automatically include it in campaign goals. GA4/Meta reporting delivery still needs verification after deployment.
- Obtain the repository's required approving review before merging. After normal deployment, use a genuine consented demo journey to verify receiver delivery and deduplication; do not submit fake meetings to production for a smoke test. Booking without consent must continue to work.
- Rollback: revert these demo-only commits through the normal release process. Existing signup/trial measurement does not depend on the added demo events.

## Verification

`npm run test:tracking` (79 tests), `npm run typecheck`, targeted lint for the modal/helper, and `npx vite build` pass. All tracking tests use mocked HTTP and jsdom without SDK resource loading; no production conversions or meetings were generated. The companion OS tests cover confirmed/failed/uncertain/cancelled/honeypot results, bounded messages and existing embed headers; its TypeScript check passes. The producer and consumer were also exercised together locally with the same message.
