import type { ReactNode } from "react";
import {
  BellRing,
  CalendarDays,
  Github,
  Lock,
  Palette,
  Server,
  Trophy,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const REPO_URL = "https://github.com/MyShellSoftwareLab/review-hue";
const ORG_URL = "https://github.com/MyShellSoftwareLab";

const features = [
  {
    icon: BellRing,
    title: "Color-coded review queue",
    description:
      "One big number for the open PRs in your repos: green when it's under control, yellow at 3+, red at 6+. Refreshes every 30 seconds.",
  },
  {
    icon: Users,
    title: "Who's waiting on you",
    description:
      "A card for each PR author, with their open PR count and how many unresolved review comments they have.",
  },
  {
    icon: Trophy,
    title: "Top contributors & least busy",
    description:
      "A rotating leaderboard of this month's PR authors, so you can see who's shipping and who has room to review.",
  },
  {
    icon: CalendarDays,
    title: "Monthly heatmap",
    description: "See which days of the month PRs were opened in your repositories.",
  },
  {
    icon: Palette,
    title: "Themes & sounds",
    description:
      "Seasonal themes with notification sounds when your queue changes. Mute them or preview them at any time.",
  },
  {
    icon: Lock,
    title: "Your token stays with you",
    description:
      "No backend. Your token is saved in your browser and only ever sent to api.github.com.",
  },
];

const selfHostSteps = `git clone ${REPO_URL}.git
cd review-hue
npm ci
npm run build
# serve the dist/ folder with any static web server`;

interface LandingProps {
  /** The sign-in form, rendered in the hero next to the pitch. */
  children: ReactNode;
}

export const Landing = ({ children }: LandingProps) => {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-24 py-12">
      {/* Hero */}
      <section className="grid items-center gap-12 lg:grid-cols-2 min-h-[calc(100dvh-6rem)]">
        <div className="space-y-6 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
            <Github className="h-3.5 w-3.5" />
            Free &amp; open source · AGPL-3.0
          </span>
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Review Hue
          </h1>
          <p className="text-xl text-muted-foreground">
            Keep your team's pull requests from going stale. A glanceable dashboard of the PRs
            waiting in your GitHub repositories, color-coded so you know when it's time to review.
          </p>
          <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
            <a
              href="#self-host"
              className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Server className="h-4 w-4" />
              Self-host it
            </a>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-md">
          <CardContent className="flex justify-center p-8">{children}</CardContent>
        </Card>
      </section>

      {/* Features */}
      <section className="space-y-10">
        <h2 className="text-center text-3xl font-bold text-foreground">What you get</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardContent className="space-y-3 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Self-hosting */}
      <section id="self-host" className="grid items-center gap-10 lg:grid-cols-2 scroll-mt-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Host it yourself</h2>
          <p className="text-muted-foreground">
            Review Hue is a static web app with no server and no database. Build it once and serve
            the files from any static host: Nginx, Caddy, GitHub Pages, Netlify, an S3 bucket, or a
            Docker container.
          </p>
          <p className="text-muted-foreground">
            Prefer containers? There is a ready-made Dockerfile. Full instructions, including Nginx and Caddy examples, are in the{" "}
            <a
              href={`${REPO_URL}#self-hosting`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              README
            </a>
            .
          </p>
        </div>
        <pre className="overflow-x-auto rounded-lg border bg-muted p-6 text-sm text-foreground">
          <code>{selfHostSteps}</code>
        </pre>
      </section>

      {/* Footer */}
      <footer className="border-t pt-8 text-center text-sm text-muted-foreground space-y-2">
        <p>
          Review Hue is a free and open source project by{" "}
          <a
            href={ORG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            MyShell Software Lab
          </a>
          .
        </p>
        <p>
          Licensed under the{" "}
          <a
            href={`${REPO_URL}/blob/main/LICENSE`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GNU Affero General Public License v3.0
          </a>
          .
        </p>
      </footer>
    </div>
  );
};
