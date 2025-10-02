import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PRCreator {
  login: string;
  avatar_url: string;
  count: number;
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
        <Card key={creator.login} className="hover:shadow-lg transition-shadow w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)]">
          <CardContent className="flex items-center gap-3 p-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={creator.avatar_url} alt={creator.login} />
              <AvatarFallback>{creator.login.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{creator.login}</p>
              <p className="text-xs text-muted-foreground">Pull Requests</p>
            </div>
            <Badge variant="secondary" className="text-lg font-bold">
              {creator.count}
            </Badge>
          </CardContent>
        </Card>
        ))}
      </div>
    </div>
  );
};
