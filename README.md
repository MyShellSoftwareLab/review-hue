# Review Hue

**Keep your team's pull requests from going stale.**

Review Hue is a glanceable dashboard of the pull requests waiting in your GitHub repositories. Put it on a second monitor or a team TV, and it shows at a glance when it's time to stop and review.

Review Hue is a free and open source project by [MyShell Software Lab](https://github.com/MyShellSoftwareLab), licensed under the [GNU AGPL v3.0](LICENSE).

**Live app:** https://review-hue.lovable.app

## Features

- **Color-coded review queue.** One big number for the open PRs in repositories owned by your account: green for 0–2, yellow for 3–5, red for 6 or more. Refreshes every 30 seconds.
- **PR author cards.** One card per author with their open PR count and unresolved review comments. Click a card to list that author's PRs.
- **Top contributors and least busy.** A leaderboard of this month's PR authors that switches between the busiest and the least busy every 30 seconds, and pauses while you hover it. Click a name to see that person's PRs for the month.
- **Monthly heatmap.** Which days of the month PRs were opened in your repositories.
- **Themes and sounds.** Seasonal themes with a notification sound when the queue changes. Mute it, or preview it with the Play button.
- **No backend.** Everything runs in your browser. Your token is stored in the browser's `localStorage` and only sent to `api.github.com`.

## Getting started

1. Open the app (the [hosted version](https://review-hue.lovable.app) or your own copy).
2. Create a GitHub [personal access token](https://github.com/settings/tokens/new?scopes=repo) with the `repo` scope, so Review Hue can read pull requests in private repositories.
3. Paste the token and click **Check PRs**.

Click **Logout** to remove the token from the browser.

## Self-hosting

Review Hue builds to a folder of static files (`dist/`). It has no server, database, or environment variables, so you can host it anywhere that serves static files.

### Requirements

- Node.js 18 or newer, with npm

### Build

```sh
git clone https://github.com/MyShellSoftwareLab/review-hue.git
cd review-hue
npm ci
npm run build
```

The site is now in `dist/`. To try the production build locally:

```sh
npm run preview
```

### Option 1: Docker

The repository includes a `Dockerfile` that builds the app and serves it with Nginx (configured in `nginx.conf`):

```sh
git clone https://github.com/MyShellSoftwareLab/review-hue.git
cd review-hue
docker build -t review-hue .
docker run -d -p 8080:80 --restart unless-stopped --name review-hue review-hue
```

Open http://localhost:8080. To update later, run `git pull`, then rebuild and restart the container.

### Option 2: Nginx (or any web server)

Copy `dist/` to your server, then point the web server at it. Review Hue is a single-page app, so unknown paths must fall back to `index.html` (see `nginx.conf` for a complete example):

```nginx
server {
    listen 80;
    server_name review.example.com;
    root /var/www/review-hue;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

With Caddy:

```caddy
review.example.com {
    root * /var/www/review-hue
    try_files {path} /index.html
    file_server
}
```

### Option 3: Static hosting services

Netlify, Vercel, Cloudflare Pages, and similar services work out of the box. Use these settings:

| Setting          | Value           |
| ---------------- | --------------- |
| Build command    | `npm run build` |
| Output directory | `dist`          |

Enable the single-page app fallback to `index.html` if your host asks for it.

### Serving from a subpath

The build assumes the site is served from the domain root (`/`). To serve it from a subpath such as `https://example.com/review-hue/`, build with:

```sh
npx vite build --base=/review-hue/
```

### Security notes

- Serve the app over **HTTPS**. Users paste a GitHub token into it.
- The token is kept in the browser's `localStorage` on the user's device and is only sent to `api.github.com`. Your server never receives it.

## Development

```sh
npm install
npm run dev     # http://localhost:8080
npm run lint
```

Built with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui.

The project is also connected to [Lovable](https://lovable.dev/projects/6037a066-dfd1-4933-a266-b3ef4828028d). Changes pushed to `main` sync back into the Lovable editor.

## Contributing

Issues and pull requests are welcome at [MyShellSoftwareLab/review-hue](https://github.com/MyShellSoftwareLab/review-hue).

## License

Copyright (C) 2026 MyShell Software Lab

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the [LICENSE](LICENSE) file for details.

If you run a modified version of Review Hue for other people to use over a network, the AGPL requires you to offer them the source code of your modified version.
