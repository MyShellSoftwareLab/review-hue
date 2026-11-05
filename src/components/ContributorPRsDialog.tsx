import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, GitPullRequest } from "lucide-react";

export interface PRSummary {
  id: number;
  title: string;
  html_url: string;
  created_at: string;
  state?: string;
  pull_request?: { merged_at?: string | null };
  user: { login: string; avatar_url: string };
}

interface ContributorPRsDialogProps {
  contributor: { login: string; avatar_url: string; prCount: number } | null;
  prs: PRSummary[];
  onOpenChange: (open: boolean) => void;
}

const getRepoName = (url: string) => {
  const parts = url.split("/");
  return `${parts[parts.length - 3]}/${parts[parts.length - 2]}`;
};

const getPRState = (pr: PRSummary) => {
  if (pr.pull_request?.merged_at) return "Merged";
  return pr.state === "open" ? "Open" : "Closed";
};

const getStateVariant = (state: string) => {
  if (state === "Open") return "default";
  if (state === "Merged") return "secondary";
  return "destructive";
};

export const ContributorPRsDialog = ({
  contributor,
  prs,
  onOpenChange,
}: ContributorPRsDialogProps) => {
  const sorted = [...prs].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <Dialog open={!!contributor} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {contributor && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={contributor.avatar_url} alt={contributor.login} />
                <AvatarFallback>{contributor.login[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <span>{contributor?.login}</span>
            <Badge variant="outline">{sorted.length} PRs</Badge>
          </DialogTitle>
          <DialogDescription>
            Pull requests opened this month in your repositories
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1">
          {sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No pull requests to show
            </p>
          ) : (
            sorted.map((pr) => {
              const state = getPRState(pr);
              return (
                <a
                  key={pr.id}
                  href={pr.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <GitPullRequest className="w-4 h-4 mt-1 flex-shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{pr.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getRepoName(pr.html_url)} ·{" "}
                      {new Date(pr.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={getStateVariant(state)}>{state}</Badge>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </a>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
