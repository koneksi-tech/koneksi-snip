# KonekSnip

Share screenshots and screen recordings instantly. Paste, drop, or pick a file — get a link to share in seconds. Powered by [Koneksi](https://koneksi.co.kr) (privatized, decentralized storage on IPFS).

## How it works

- **Images:** Upload a screenshot or image (paste from clipboard, drag and drop, or pick from your device). The file is sent to the Koneksi API and stored; you get a shareable link right away.
- **Screen recording:** Choose “Screen Recording,” pick a screen or tab (with optional system audio and microphone), then a short countdown runs before capture starts. Recordings are limited to 2 minutes and auto-upload when you stop. You can cancel to discard without uploading.

## Features

- **Quick upload** — Paste (desktop: Ctrl/Cmd + V), drag and drop, or tap “Pick a file” to upload screenshots and images
- **Screen recording** — Record a window or tab with optional microphone; 2-minute max, 3-second countdown after selecting the source
- **Share links** — Every upload returns a link you can copy or open; share modal with one-click copy
- **Upload history** — See recent uploads, copy links, open in new tab, or remove from history
- **Mobile-friendly** — Responsive layout; on mobile, “Pick a file” is the main action (no paste shortcut)

## Installation

### Prerequisites

- **Node.js 18+** (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **pnpm** (or npm / yarn)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/koneksi-tech/koneksi-snip-poc.git
   cd koneksi-snip-poc
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment**

   Copy the example env file and fill in your [Koneksi](https://koneksi.co.kr) API credentials:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:
   - `VITE_KONEKSI_API_URL` — Koneksi API base URL
   - `VITE_KONEKSI_WEBAPP_URL` — Web app URL (for share links)
   - `VITE_KONEKSI_CLIENT_ID`
   - `VITE_KONEKSI_CLIENT_SECRET`
   - `VITE_KONEKSI_DIRECTORY_ID`

You can get Koneksi Client ID & Secret here: https://koneksi-1.gitbook.io/docs/developer-tools/quick-start

4. **Run locally**

   ```bash
   pnpm dev
   ```

   Open the URL shown in the terminal (e.g. `http://localhost:5173`).

5. **Build for production**

   ```bash
   pnpm build
   pnpm preview
   ```

## Contributing

We welcome contributions. Here’s a simple workflow:

1. **Fork** this repository and clone your fork.
2. **Create a branch** for your change:
   ```bash
   git checkout -b feature/your-feature
   ```
   Use a clear branch name (e.g. `fix/mobile-layout`, `feat/recording-options`).
3. **Make your changes** — keep the code style consistent and add or update tests if relevant.
4. **Run checks:**
   ```bash
   pnpm lint
   pnpm build
   ```
5. **Commit** with a clear message (e.g. “Add mobile upload CTA”, “Fix history panel overflow”).
6. **Push** to your fork and open a **Pull Request** against the default branch of this repo. Describe what you changed and why.
7. **Address review** — maintainers may ask for updates; we’ll merge once everything looks good.

If you’re unsure what to work on, check open issues or start a discussion. Please follow the project’s code of conduct and be respectful in issues and PRs.

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** (v4) for styling
- **Zustand** for state (upload, recording)
- **TanStack Query** for upload mutation
- **Sonner** for toasts
- **Radix**-based UI primitives

## License

See the [LICENSE](LICENSE) file in this repository.
