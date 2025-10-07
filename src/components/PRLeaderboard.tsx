import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardEntry {
  login: string;
  avatar_url: string;
  prCount: number;
}

interface PRLeaderboardProps {
  entries: LeaderboardEntry[];
}

export const PRLeaderboard = ({ entries }: PRLeaderboardProps) => {
  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Review Requests
        </CardTitle>
        <p className="text-sm text-muted-foreground">PRs assigned this month</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No PRs this month
            </p>
          ) : (
            entries.map((entry, index) => (
              <div
                key={entry.login}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="w-6 text-center font-semibold text-sm">
                    {index + 1}
                  </span>
                  {getMedalIcon(index)}
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={entry.avatar_url} alt={entry.login} />
                    <AvatarFallback>{entry.login[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate">
                    {entry.login}
                  </span>
                </div>
                <span className="text-sm font-bold">
                  {entry.prCount}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
