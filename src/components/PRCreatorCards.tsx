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
}

export const PRCreatorCards = ({ creators }: PRCreatorCardsProps) => {
  if (creators.length === 0) return null;

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
        {creators.map((creator) => (
        <Card key={creator.login} className={`hover:shadow-lg transition-all w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] ${creator.unresolvedComments > 0 ? 'border-destructive/50 border-2' : ''}`}>
          <CardContent className="flex items-center gap-3 p-4">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={creator.avatar_url} alt={creator.login} />
              <AvatarFallback>{creator.login.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{creator.login}</p>
              <p className="text-xs text-muted-foreground">Pull Requests</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="secondary" className="text-base font-bold px-2.5 py-1">
                {creator.count}
              </Badge>
              {creator.unresolvedComments > 0 && (
                <Badge variant="destructive" className="text-sm font-semibold gap-1 px-2 py-1">
                  <AlertCircle className="w-3 h-3" />
                  {creator.unresolvedComments}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        ))}
      </div>
    </div>
  );
};
