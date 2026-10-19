# prank-week-bot

An anonymous relay Telegram bot for **Prank Week**. It's a copy of [angel-mortal-bot](https://github.com/chee-yew/angel-mortal-bot) with the roles renamed: the pranker is the old "angel" and the prankee is the old "mortal". The event name shown in the bot is set by `EVENT_NAME` in `wrangler.toml`.

Every participant has:
- a **Prankee**: someone they know, and secretly prank
- a **Pranker**: someone secret, who's plotting against them

The bot lets each participant chat with both through one bot. Messages are re-sent by the bot itself, so **the pranker's identity is never revealed**.

> **Status:** rebranded from the deployed, end-to-end-tested angel-mortal-bot. See [docs/PLAN.md](docs/PLAN.md) for the design decisions and build history.

## Features
- Anonymous two-way chat with your Pranker and your Prankee in **two separate tabs** inside the bot chat (`😈 Pranker: secret (pranking you)` and `🎯 Prankee: @their_username (you prank them)`), so you always know who you're talking to
- All message types: text, photos, videos, GIFs, stickers, voice notes, files, locations
- Optional **prank intensity and OUT OF BOUNDS limits** for each prankee, uploaded with the pairings, shown only to their pranker
- Telegram **Reply** works, and both sides see it threaded
- If a message can't be delivered (for example, the other person hasn't joined yet), the bot replies to that exact message with a warning
- Admin tools:
  - upload and validate the pairings list (an Excel/Sheets CSV)
  - see who hasn't joined
  - check status
  - broadcast announcements to everyone
  - pause or resume relaying
  - fix a participant's handle, or detach the wrong account
  - undo an upload

## Tech stack
| Part | Choice | Why |
|---|---|---|
| Runtime | Cloudflare Workers (free tier) | Always on, no cold starts, no credit card needed |
| Database | Cloudflare D1 (SQLite) | Free, built in, and plenty for about 60 users |
| Bot framework | [grammY](https://grammy.dev) (TypeScript) | First-class Workers support |
| Telegram delivery | Webhook | No server process to keep alive |

## Documentation
📖 **Docs website:** <https://chee-yew.github.io/prank-week-bot/> (GitHub Pages, built from `docs/`)

| Doc | For |
|---|---|
| [User Guide](docs/USER_GUIDE.md) | Participants (how to chat) and organisers (admin commands) |
| [Developer Guide](docs/DEVELOPER_GUIDE.md) | Architecture, local setup, deployment, troubleshooting |
| [Plan](docs/PLAN.md) | Design decisions and build progress |

## Quick start (deploy)
You need Node.js 22.6+, a free [Cloudflare account](https://dash.cloudflare.com/sign-up) and a bot token from [@BotFather](https://t.me/BotFather) with **Threaded Mode** turned on, so each participant gets their two tabs. The [Developer Guide](docs/DEVELOPER_GUIDE.md#deployment) has every step explained. In short:
```bash
git clone https://github.com/chee-yew/prank-week-bot.git
cd prank-week-bot
npm install
npx wrangler login
npx wrangler d1 create prank-week          # paste the id into wrangler.toml
# also in wrangler.toml: check EVENT_NAME
npx wrangler d1 execute prank-week --remote --file=schema.sql
npx wrangler secret put BOT_TOKEN
npx wrangler secret put WEBHOOK_SECRET
npx wrangler deploy
```
Then open `https://<your-worker>.workers.dev/setup?key=<WEBHOOK_SECRET>` to register the webhook. Message the bot `/myid`, run `npx wrangler secret put ADMIN_IDS` with your ID, and open `/setup` again. Finally, `/upload` the pairings.

**Running it for your own event?** See [Customising for your event](docs/DEVELOPER_GUIDE.md#customising-for-your-event) for what to rename and replace.

## Project structure
```
src/
  index.ts      Worker entry: /webhook, /setup, cron
  bot.ts        Commands, admin tools, tabs, relay logic
  db.ts         Typed D1 queries
  topics.ts     Pranker/Prankee tab names and helpers
  config.ts     ADMIN_IDS parsing
  pairings.ts   Pairing list parser + validation
test/           Node tests (npm test)
schema.sql      D1 tables
migrations/     One-off upgrades for databases created by older versions
wrangler.toml   Cloudflare config
docs/           Plan, user guide, developer guide
.github/        CI workflow, issue and PR templates
```

In the code and database, "angel" still means pranker and "mortal" means prankee (e.g. `angel_handle`, `mortal_thread_id`). Only the text people see was renamed.

## Privacy
- Real pairing lists are **never committed**: `*.csv` is git-ignored, except `pairings.example.csv`.
- The bot token, webhook secret and admin IDs are stored only as Cloudflare secrets.
- This repository is **public**. That's safe because anonymity comes from how the bot relays messages, not from hiding the code. Never commit tokens, real pairings or database exports.

## Contributing
Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) to get started, and [SECURITY.md](SECURITY.md) to report a vulnerability privately.

## License
[MIT](LICENSE)
