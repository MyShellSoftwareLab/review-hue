import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  login: string;
  avatar_url: string;
  prCount: number;
}

interface PRLeaderboardProps {
  topEntries: LeaderboardEntry[];
  bottomEntries: LeaderboardEntry[];
  onSelectContributor?: (entry: LeaderboardEntry) => void;
}

type View = "top" | "bottom";

const ROTATION_MS = 30_000;

export const PRLeaderboard = ({
  topEntries,
  bottomEntries,
  onSelectContributor,
}: PRLeaderboardProps) => {
  const [view, setView] = useState<View>("top");
  const [isHovered, setIsHovered] = useState(false);

  const canRotate = bottomEntries.length > 0;
  const activeView: View = canRotate ? view : "top";

  // Switch views every 30s, but only while the card is not hovered.
  // Re-runs on view change / hover leave, so each slide gets a full 30s.
  useEffect(() => {
    if (!canRotate || isHovered) return;
    const id = setTimeout(
      () => setView((v) => (v === "top" ? "bottom" : "top")),
      ROTATION_MS
    );
    return () => clearTimeout(id);
  }, [view, isHovered, canRotate]);

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const isTop = activeView === "top";
  const entries = isTop ? topEntries : bottomEntries;

  return (
    <Card
      className="w-full h-full max-h-full flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            {isTop ? <Trophy className="w-5 h-5" /> : <Coffee className="w-5 h-5" />}
            {isTop ? "Top Contributors" : "Least Busy"}
          </CardTitle>
          {canRotate && (
            <div className="flex gap-1.5" role="tablist">
              {(["top", "bottom"] as View[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={activeView === v}
                  aria-label={v === "top" ? "Show top contributors" : "Show least busy"}
                  onClick={() => setView(v)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    activeView === v ? "w-5 bg-primary" : "w-2 bg-muted-foreground/40"
                  )}
                />
              ))}
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {isTop ? "Most PRs in your repos this month" : "Fewest PRs in your repos this month"}
        </p>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-y-auto">
        <div key={activeView} className="space-y-3 animate-in fade-in duration-500">
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No PRs this month
            </p>
          ) : (
            entries.map((entry, index) => (
              <button
                key={entry.login}
                type="button"
                onClick={() => onSelectContributor?.(entry)}
                className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {isTop && (
                    <span className="w-6 text-center font-semibold text-sm">
                      {index + 1}
                    </span>
                  )}
                  {isTop && getMedalIcon(index)}
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={entry.avatar_url} alt={entry.login} />
                    <AvatarFallback>{entry.login[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate">{entry.login}</span>
                </div>
                <span className="text-sm font-bold">{entry.prCount}</span>
              </button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
