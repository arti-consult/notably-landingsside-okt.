# Fireflies.ai: research for «Fireflies.ai vs Notably»

Researched 8 November 2026. Everything below comes from Fireflies' own pages unless it is marked **[sekundærkilde]**.

## 1. Produkt, målgruppe og selskap
- Fireflies calls itself «The #1 AI Assistant For Your Meetings». It is moving from a pure notetaker toward an AI assistant for the whole workday: meetings, email, Slack and «240+ tools». Source: https://fireflies.ai/
- Target audience: broad and international. It names sales, recruiting, marketing, user research, engineering, finance, healthcare, media and venture capital, with a clear pull toward enterprise buyers (CIO, admin). The site says it is used by «75% of Fortune 500», which is the vendor's own claim. Source: https://fireflies.ai/
- Company: Fireflies.ai Corp. (that is the seller name in the App Store), USA. Founded 2016 by Krish Ramineni (CEO) and Sam Udotong (CTO). Reached a $1B valuation in June 2025 through a secondary tender offer. **[sekundærkilde]** https://peopleofcolorintech.com/articles/ai-meeting-assistant-gains-unicorn-status-with-1b-valuation/ and https://clay.com/dossier/firefliesai-funding
- Headquarters: sources disagree. San Francisco is best supported; one source gives Pleasanton, CA or Miami. **[sekundærkilde]** https://siliconvalleyinvestclub.com/ar/companies/fireflies/

## 2. Hvordan møter fanges opp
- **Meeting bot:** it joins meetings from the calendar or on invitation. Source: https://fireflies.ai/
- **Without a bot:** you can record through the Chrome extension on every plan. This is a row in the plan comparison table. Source: https://fireflies.ai/pricing
- **Desktop app:** the homepage mentions a «desktop app for calls». A third party lists Windows and macOS (Apple Silicon) **[sekundærkilde]**: https://sourceforge.net/app/fireflies-ai-notetaker/android/
- **Mobile app for iOS and Android:** it records in-person meetings, interviews and similar conversations. Sources: https://guide.fireflies.ai/articles/8937818258-learn-about-fireflies-mobile-app, https://apps.apple.com/app/id6463164203 and https://fireflies.ai/pricing
  - According to Fireflies' launch announcement, in-person recordings made in the app get unlimited free transcription: https://www.newswire.com/news/fireflies-ai-launches-mobile-app-bringing-its-ai-notetaker-to-in-22171301
  - The App Store description also mentions «Fireflies Talk», a dictation feature in «90+ languages».
- **File upload:** MP3, MP4, WAV and M4A, on every plan. Sources: https://fireflies.ai/ and https://fireflies.ai/pricing
- **Other ways in:** dialer integrations (Aircall, RingCentral) and an API. Source: https://fireflies.ai/
- **Recording limit per meeting:** Free 2 hours, Pro 2 hours, Business 3 hours, Enterprise 4 hours. Source: https://fireflies.ai/pricing

## 3. Plattformer
- Zoom, Google Meet and Microsoft Teams are named on the homepage. The plan comparison says «Record Zoom, Gmeet, MS teams, 10+». The App Store description also lists Webex, RingCentral and Aircall. Sources: https://fireflies.ai/pricing and https://apps.apple.com/app/id6463164203

## 4. Referat og funksjoner
Source for the feature list: https://fireflies.ai/ and https://fireflies.ai/pricing
- **AI summaries:** overview, bullet points, action items and custom notes. «Limited» on Free, «Unlimited» on paid plans.
- **Task detection:** «Key topics and task detection», «Tasks» and «Question detection» are on Pro and above.
- **Decisions:** I found no separate decisions section. Treat as unknown.
- **Templates:** custom notes and «AI Skills» (200+, for example follow-up emails, CRM updates and candidate scoring). Some of these use AI credits.
- **Speaker recognition and analysis:** speaker talk-time analytics, sentiment analysis and topic trackers are on Pro and above. Full «Conversation intelligence» is Business and above.
- **Asking questions:**
  - «AskFred» is an AI assistant: limited on Free, included on paid plans.
  - «Global search» is on every plan; «Smart search» is Pro and above.
  - There is also a personal assistant with a daily digest and meeting prep, which uses AI credits.
- **During the meeting:** «Live Assist» gives real-time suggestions, and live transcription is on every plan.
- **Collaboration:** soundbites, comments, bookmarks and channels.
- **Video capture:** 720p on Pro and Business, 1080p on Enterprise.
- **Newer additions:** Voice Agents that run calls, an Email Assistant, and an MCP server for Claude, ChatGPT and Devin.

## 5. Norsk språk
- **Transcription:** Norwegian (code `no`) and Nynorsk (`nn`) are on the official language list. The article says Fireflies «supports transcription and summaries in 100+ languages». The list has 115 language entries including regional variants. Source: https://guide.fireflies.ai/articles/2973706448-learn-about-fireflies-supported-languages
- **Contradiction:** the pricing page says English is the primary language, that Spanish, French, Portuguese and Italian are supported, and that «100+ other languages» are in **beta**. That makes Norwegian beta-level according to the pricing page, while the help center article does not mark it as beta. Source: https://fireflies.ai/pricing
- **Mixed languages:** «Multi-Language Mode» (beta, 60+ languages in one conversation) is on Business and above only. Auto-language detection is on every plan. Sources: the pricing page and the help center article above.
- **Quality of Norwegian:** unknown. Fireflies publishes no accuracy figures for Norwegian. The 95% accuracy claim on the homepage is not broken down by language.
- **Interface:** the App Store app is listed in English only (iTunes API, `languageCodesISO2A: ["EN"]`). I found no Norwegian interface. Source: https://apps.apple.com/us/app/fireflies-ai-notetaker/id6463164203

## 6. Personvern og sikkerhet
- **Default storage:** «By default, your data is stored and processed in Fireflies' secure cloud infrastructure in the United States (AWS and GCP).» Source: https://guide.fireflies.ai/articles/9596505232
- **EU option:** only through Private Storage on Enterprise (Bring Your Own Storage on S3 or GCS). The same article says: «Your data will be stored in the EU, but processed in the US.» Processing therefore stays in the US. Source: https://guide.fireflies.ai/articles/9596505232
- **AI training:** the security page says Fireflies does not train on customer data «by default», and elsewhere says «never». The guide says it «does not share or use» customer data for training and that its vendors do not train on it. The «by default» wording is somewhat ambiguous. Sources: https://fireflies.ai/security and https://guide.fireflies.ai/articles/9596505232
- **Subprocessors:** OpenAI and ASR providers are named, with a «0-day retention» policy toward vendors. Sources: https://fireflies.ai/security and https://guide.fireflies.ai/articles/9596505232
- **GDPR and DPA:**
  - «GDPR compliance» is ticked for every plan, and the security page says «Certified for GDPR». Sources: https://fireflies.ai/security and https://fireflies.ai/pricing
  - A DPA is linked from the Security FAQ (fireflies.ai/dpa): https://fireflies.notion.site/Security-FAQs-9698e96c1fbb452abd3a493ed6d5ae81
  - A Fireflies notice says it acts as processor for Business and Enterprise customers. That implies a different role on Free and Pro, which is uncertain. Source: https://guide.fireflies.ai/articles/6892479029
- **Certifications:** SOC 2 Type II, ISO 42001 (AI governance), HIPAA (BAA on Enterprise with Private Storage) and FERPA. I found no mention of ISO 27001. Source: https://fireflies.ai/security
- **Encryption:** AES-256 at rest and TLS in transit, in a virtual private cloud. Sources: https://fireflies.ai/security and https://fireflies.ai/pricing
- **Deletion:** users can delete transcripts at any time. Bulk delete is Pro and above. Custom data retention is Enterprise only. I found no separate rule for automatic deletion of audio after processing, so treat that as unknown. Sources: https://fireflies.ai/security and https://fireflies.ai/pricing
- **Third-party view:** one third party writes that Fireflies is a poor fit for «Regulated industries requiring EU data residency». **[sekundærkilde]** https://www.waimakers.com/en/resources/ai-data-security/firefliesai

## 7. Integrasjoner
- Named integrations: HubSpot, Salesforce, Notion, Asana, Slack, Gmail, Outlook, Greenhouse and Lever, Zapier, and an MCP server. The site gives «100+ integrations» in the FAQ and «240+ tools» elsewhere. Sources: https://fireflies.ai/ and https://apps.apple.com/app/id6463164203
- The Free plan has no app or CRM integrations; Pro and above get «All». Source: https://fireflies.ai/pricing

## 8. Pris (USD per bruker per måned)
Source: https://fireflies.ai/pricing

| Plan | Annual billing | Monthly billing | Storage |
|---|---|---|---|
| Free | $0 | $0 | 400 min per team |
| Pro | $10 | $18 | 8,000 min per seat |
| Business | $19 | $29 | Unlimited |
| Enterprise | $39 (annual only) | not offered | Unlimited |

- **Free:** limited transcription and AI summaries, limited AskFred, 3 public channels, and no downloads or integrations.
- **Pro:** 20 AI credits.
- **Business:** priority support, team insights and multi-language mode.
- **Enterprise:**
  - SSO and SCIM
  - Private Storage
  - HIPAA
  - custom data retention
  - invoice billing
  - volume discount above 50 users through sales
- AI credits are required for AI Skills, Voice Agents and the personal assistant. I could not find the credit amounts for Business and Enterprise; they sit behind a link.
- As a rough comparison (my calculation, not a source): Business at $19–29 is about 200–310 NOK, and Notably is 399 NOK.

## 9. Styrker og svakheter
**Strengths (to present fairly):**
- Very broad feature set: conversation intelligence, Live Assist, 200+ AI Skills, Voice Agents, MCP.
- Many integrations and many platforms, including dialers.
- A free plan, and a low entry price at $10 per user per month on annual billing.
- Mobile app on both iOS and Android with free unlimited in-person transcription in the app, plus the option to record without a bot through the Chrome extension.
- SOC 2 Type II, ISO 42001 and HIPAA. Large user base and strong funding.

**Weaknesses for Norwegian businesses:**
- Data is stored and processed in the US by default. EU storage requires Enterprise and Private Storage, and even then processing stays in the US.
- Norwegian is one of 100+ languages, and the pricing page calls those languages beta. There are no Norwegian quality figures.
- The interface is in English.
- The Free plan has only 400 minutes of storage per team. Integrations and downloads require a paid plan. Several features use AI credits, which makes cost harder to predict.
- Multi-language mode is Business and above only. SSO is Enterprise only.
- The product is complex and aimed at US sales and recruiting teams.

## 10. Usikkert eller motstridende
- **Norwegian language status:** the language list has no beta label, but the pricing page says «100+ other languages in beta».
- **Number of languages:** the help center and homepage say 100+, Talk dictation says 90+, multi-language mode says 60+, and a Notta comparison says «69+» (competitor source).
- **AI training:** «by default» versus «never».
- **Headquarters:** San Francisco, Pleasanton or Miami, depending on the source.
- **DPA and processor role:** whether the DPA applies on Free and Pro is unclear.
- **Desktop app:** which plans include it, and which operating systems it supports, is only confirmed by a secondary source.
- **AI credit amounts:** unknown for Business and Enterprise.
- **Automatic deletion of audio:** unknown.
- **Decisions section in the notes:** unknown.

## LOGO
Folder: /private/tmp/claude-501/-Users-jorgen--claude-spares-spare-8BmDUC/022cad4c-d7e3-4564-bda2-3c7db7728525/scratchpad/logos/fireflies/

| File | Format | Background | Comment |
|---|---|---|---|
| icon-512.png | PNG 512x512 RGBA | Probably transparent (shows as white) | The symbol in a purple-to-pink gradient (the website icon) |
| apple-icon-180.png | PNG 180x180 RGBA | Not inspected visually | Low resolution |
| appstore-icon-1024.png | PNG 1024x1024 RGB | Light grey, about #F7F8FA | The symbol in flat pink/magenta, sized like an app icon |

- **Best choice:** /private/tmp/claude-501/-Users-jorgen--claude-spares-spare-8BmDUC/022cad4c-d7e3-4564-bda2-3c7db7728525/scratchpad/logos/fireflies/icon-512.png, a square «F» symbol made of four blocks.
- **Background caveat:** the file has an alpha channel, but PIL was not installed, so I could not confirm that the background really is transparent.
- **Flat alternative:** /private/tmp/claude-501/-Users-jorgen--claude-spares-spare-8BmDUC/022cad4c-d7e3-4564-bda2-3c7db7728525/scratchpad/logos/fireflies/appstore-icon-1024.png has a light grey background and no gradient.
- **Brand colour:** magenta/pink, about #E62A72, with a lighter pink about #FF3D7F. In the 512 icon the gradient runs into purple, about #9B4DB8.