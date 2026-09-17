# Presentations

Talks given by Seth For Privacy ([sethforprivacy.com](https://sethforprivacy.com)). Final exported decks live at the repo root; editable source for the open-slide decks lives under [`decks/`](./decks).

## Decks

| Deck | Given at | Summary |
| --- | --- | --- |
| [Building Monero's Circular Economy via Privacy Tools](<./Building%20Monero's%20Circular%20Economy%20via%20Privacy%20Tools.pdf>) | Monerotopia 2022 (online) | What circular and parallel economies are, why build them, how Monero uniquely enables them, and the privacy tools (Signal, Telegram, Matrix, Tor Browser) that pair with it. |
| [Monero + L2](<./Monero + L2.pdf>) | Monerokon 2022 (Lisbon) | "How a simple layer two can benefit Monero and its users" — why Monero needs an L2, lessons from Lightning's mistakes, and a survey of payment-channel research (PayMo, AuxChannel, MoNet, sleepy channels). |
| [Moving Past Tribalism to Freedom via Monero](<./Moving Past Tribalism to Freedom via Monero.pdf>) | Guns & Bitcoin 2022 | Monero 101 for a Bitcoin audience: history, protocol primer (stealth addresses, CT, ring signatures), dispelling supply/audit/hard-fork/scaling myths, and "use Monero for what you need Monero for." |
| [Silent Payments - The Experience](<./Silent Payments - The Experience.pdf>) | The Bitcoin Conference 2025 (Las Vegas) | Cake Wallet's pitch for Silent Payments (BIP 352): no rotating addresses, simpler wallets, better privacy — and why they force rethinking wallet sync UX. |
| [Cake @ Monerokon](<./Cake @ Monerokon.pdf>) | Monerokon 2025 | Cake Wallet's update to the Monero community: 600k+ users, background sync removing the biggest UX barrier, and Bitcoin Design-style address display. |
| [Putting the punk back in solarpunk](<./Putting the punk back in solarpunk.pdf>) | EthCC 2026 | Cake Wallet deck on solarpunk as an ethos: what "solarpunk" means, its darker-side questions ("larpunk?"), and finding the nuance between techno-optimism and punk self-reliance. |
| [Spark and Ark: the good, the bad, and the ugly](<./Spark and Ark.pptx>) *(PowerPoint)* | BTC Prague 2026 | Head-to-head of the Ark and Spark Bitcoin L2s (VTXOs, expiry, finality, privacy, operator trust) evaluated from the perspective of a mobile-only, mostly-offline wallet user. |
| [Run It Yourself - Why Local AI Matters](<./Run It Yourself - Why Local AI Matters.pdf>) | Upcoming talk | open-slide deck on why to run AI locally: the pace of open model releases, shrinking cloud-plan limits, and hardware tiers (MacBook → RTX 3090 → DGX Spark → Mac Studio → workstation) with measured tokens/sec vs. cloud APIs. Source: [`decks/local-ai-matters`](./decks/local-ai-matters). |

## Source decks (`decks/`)

Each open-slide project is a fully self-contained workspace (own `package.json`, lockfile, config, skills). Keep it that way — no shared/root toolchain.

- [`decks/local-ai-matters`](./decks/local-ai-matters) — source for **Run It Yourself - Why Local AI Matters**

Working in any project:

```bash
cd decks/<slug>
npm install
npm run dev       # dev server with hot reload
npm run build     # static bundle
npm run preview   # preview the built bundle
```

### Adding a new open-slide deck

1. Create a new directory under `decks/` named as a kebab-case slug of the deck title (`decks/<slug>/`). Fastest path: copy `decks/local-ai-matters` as a template and clear its `slides/` content.
2. Author the deck at `slides/<slug>/index.tsx` (each project can hold multiple slide decks under `slides/`).
3. When done presenting, export to PDF and commit it at the repo root, named after the deck title.
4. Add a row to the table above — deck link, event + year, one-line summary, and a pointer to the source directory.
