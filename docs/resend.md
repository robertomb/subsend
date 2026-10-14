# Resend setup and operations

This project runs Resend **headless**: every account task (domains, API keys, segments, contacts, broadcasts, webhooks, metrics) is done from the terminal or by an agent, not by clicking around the dashboard. The dashboard is only for looking.

That follows Resend's [Headless Dashboard Initiative](https://resend.com/blog/headless-dashboard-initiative): everything the dashboard can do is also available through the API, the CLI and the MCP server.

## The four interfaces

| Interface | What it's for here | Auth |
| --- | --- | --- |
| **Node SDK** (`resend` package) | Runtime code: subscribe and confirm routes, `pnpm send`, inbound forwarding. | `RESEND_API_KEY` in `.env.local` and on your host |
| **Resend CLI** (`resend`) | Account setup and one-off operations from the terminal. Use `--json` when an agent runs it. | `resend login` (stores a profile) or `RESEND_API_KEY` |
| **Resend MCP server** | Lets an AI agent inspect and manage the account in conversation. | OAuth (`https://mcp.resend.com/mcp`) |
| **Agent skills** | Teach agents Resend's recommended patterns. Already in `.claude/skills/`. | None |

### Install

```bash
brew install resend/cli/resend   # or: npm install -g resend-cli
resend login                     # opens the browser; check with: resend whoami
```

For Resend Inboxes (beta), you currently need the preview CLI: `npm install -g resend-cli@preview`.

The agent skills are pinned in `skills-lock.json`. To reinstall or update them:

```bash
npx skills add resend/resend-skills -s resend -s resend-cli -s react-email -s email-best-practices -s agent-email-inbox -a claude-code -y
```

MCP for Claude Code: `claude plugin install resend@claude-plugins-official`, then `/mcp` and choose **resend**.

## Setup checklist

Replace `example.com` with your domain. Sending from a subdomain (here `news.`) keeps your newsletter's reputation separate from your regular email.

| # | Step | How |
| --- | --- | --- |
| 1 | Add the sending domain | `resend domains create --name news.example.com --receiving` |
| 2 | Add its DNS records | Every record from `resend domains get <id>`, plus a DMARC policy at `_dmarc.example.com` (start with `v=DMARC1; p=none;`) |
| 3 | Verify the domain | `resend domains verify <id>`, then `resend domains get <id>` until it's `verified` |
| 4 | Create the subscriber segment | `resend segments create --name "Subscribers"`, then save the id as `RESEND_SEGMENT_ID` |
| 5 | Create the app's API key | `resend api-keys create --name "Website" --permission full_access` (see "API key" below), saved as `RESEND_API_KEY` |
| 6 | Fill in the env vars | Copy `.env.example` to `.env.local`, then add the same values on your host |
| 7 | Test | `pnpm send hello-world --test`, then subscribe on your site with a real address and confirm |
| 8 | Incoming mail (optional) | See "Incoming mail" below |

## DNS on Cloudflare

If your DNS is on Cloudflare, create a scoped API token (*Zone → DNS → Edit*, limited to your zone) once in the dashboard, store it as `CLOUDFLARE_API_TOKEN` in `.env.local` (never on your host, never committed), and add records through the API:

```bash
# zone id
curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" "https://api.cloudflare.com/client/v4/zones?name=example.com"
# one record per entry in `resend domains get <id>`
curl -s -X POST -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  --data '{"type":"TXT","name":"…","content":"…","ttl":1}'
```

Email records must never be proxied. Leave `"proxied"` unset or `false`.

## API key

The app needs a `full_access` key: the confirm route creates contacts, and `pnpm send` lists and creates broadcasts. `sending_access` keys (which can be limited to one domain) can only send email.

A full-access key can touch everything on the Resend account. If the account also runs other projects, consider a separate Resend team for the newsletter.

## Incoming mail

Replies and mail to your addresses can be handled in two independent ways. Choose in `site.config.ts` → `inbound`: one, both, or neither.

- **Resend Inboxes (beta).** A full inbox with threads, replies and labels, in the dashboard, CLI (`resend inboxes …`) or MCP. No code involved:
  ```bash
  resend inboxes create --email_address you@example.com --name "You" --friendly_name "Your Name"
  resend inboxes threads list --inbox_id <id>
  ```
- **Webhook forwarding.** `src/app/api/inbound/route.ts` forwards each received email, untouched, to `INBOX_FORWARD_TO`. Set `inbound.forwarding = true`, list your domains in `inbound.domains`, then register the webhook and save its signing secret as `RESEND_WEBHOOK_SECRET`:
  ```bash
  resend webhooks create --endpoint https://example.com/api/inbound --events email.received
  ```
  The webhook fires for **every** receiving domain on the account. The route only forwards mail for `inbound.domains` and ignores everything else. Keep that list tight.

Receiving only works on **fully verified** domains. With only the MX record published, mail is accepted but never shows up. To receive at your root domain (like `you@example.com`), add the root to Resend too and publish all of its records.

## Headless gaps

- `resend domains create` / `update` can't turn **sending** off for a domain. Leaving out the sending records doesn't help: the domain then never verifies, and receiving stops working.

## Everyday operations

```bash
resend whoami                                  # which account/profile is active
resend domains list --json
resend segments list --json
resend contacts list --json                    # subscribers
resend broadcasts list --json                  # sent issues (named "post:<slug>")
resend broadcasts cancel <id>                  # stop a scheduled or in-progress send
resend emails metrics                          # deliverability and engagement
```

Sending an issue stays in the repo, because it renders the post with React Email and writes `sentAt` back into the Markdown:

```bash
pnpm send <slug> --test
pnpm send <slug>
```

## How the code uses Resend

| Where | Resend feature |
| --- | --- |
| `src/app/api/subscribe/route.ts` | Transactional email: the double opt-in confirmation (React Email `ConfirmEmail`). |
| `src/app/api/confirm/route.ts` | Contacts and Segments: creates the contact in `RESEND_SEGMENT_ID`, or resubscribes an existing one. |
| `scripts/send.ts` | Broadcasts: one per post, named `post:<slug>`, sent to the segment. Refuses duplicates. |
| `src/emails/NewsletterEmail.tsx` | The `{{{RESEND_UNSUBSCRIBE_URL}}}` placeholder that Resend fills per recipient. |
| `src/app/api/inbound/route.ts` | Optional: `email.received` webhooks and `emails.receiving.forward`. |

## Rules for agents

- Use the CLI, MCP or API for account changes. If something can't be done headlessly, add it to "Headless gaps".
- Run the CLI with `--json` (or `-q`) and rely on exit codes.
- Anything that emails subscribers (a live broadcast) needs the owner's explicit yes. Test sends go only to `NEWSLETTER_TEST_TO`.
- Never print or commit API keys. Pipe them straight into `.env.local` or your host's env vars.
