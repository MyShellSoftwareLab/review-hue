import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface PRCreator {
  login: string;
  avatar_url: string;
  count: number;
  unresolvedComments: number;
}

interface PRCreatorCardsProps {
  creators: PRCreator[];
  onSelectCreator?: (creator: PRCreator) => void;
}

export const PRCreatorCards = ({ creators, onSelectCreator }: PRCreatorCardsProps) => {
  if (creators.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {creators.map((creator) => (
        <button
          key={creator.login}
          type="button"
          onClick={() => onSelectCreator?.(creator)}
          className="text-left w-full"
        >
        <Card className={`hover:shadow-lg hover:bg-accent transition-all w-full cursor-pointer ${creator.unresolvedComments > 0 ? 'border-destructive/50 border-2' : ''}`}>
          <CardContent className="flex items-center gap-3 p-4">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={creator.avatar_url} alt={creator.login} />
              <AvatarFallback>{creator.login.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{creator.login}</p>
              <p className="text-xs text-muted-foreground">Pull Requests</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="secondary" className="text-lg font-bold">
                {creator.count}
              </Badge>
              {creator.unresolvedComments > 0 && (
                <Badge variant="destructive" className="text-xs font-semibold gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {creator.unresolvedComments}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        </button>
        ))}
      </div>
    </div>
  );
};
