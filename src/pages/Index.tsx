import { useState, useEffect } from "react";
import { TokenInput } from "@/components/TokenInput";
import { PRCounter } from "@/components/PRCounter";
import { PRCreatorCards } from "@/components/PRCreatorCards";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { LogOut, RefreshCw } from "lucide-react";

interface PullRequest {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

interface PRCreator {
  login: string;
  avatar_url: string;
  count: number;
}

const Index = () => {
  const [token, setToken] = useState<string>("");
  const [prCount, setPrCount] = useState<number | null>(null);
  const [prCreators, setPrCreators] = useState<PRCreator[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPRs = async (githubToken: string, showToast = true) => {
    setIsLoading(true);
    try {
      // Get the authenticated user
      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!userResponse.ok) {
        throw new Error("Invalid token or authentication failed");
      }

      const user = await userResponse.json();

      // Get pull requests where the user is requested as a reviewer
      const prsResponse = await fetch(
        `https://api.github.com/search/issues?q=type:pr+state:open+review-requested:${user.login}`,
        {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!prsResponse.ok) {
        throw new Error("Failed to fetch pull requests");
      }

      const data = await prsResponse.json();
      setPrCount(data.total_count);
      
      // Group PRs by creator
      const creatorsMap = new Map<string, PRCreator>();
      data.items.forEach((pr: PullRequest) => {
        const login = pr.user.login;
        if (creatorsMap.has(login)) {
          creatorsMap.get(login)!.count++;
        } else {
          creatorsMap.set(login, {
            login,
            avatar_url: pr.user.avatar_url,
            count: 1,
          });
        }
      });
      
      setPrCreators(Array.from(creatorsMap.values()));
      setToken(githubToken);
      
      if (showToast) {
        toast({
          title: "Success!",
          description: `Found ${data.total_count} pull request${data.total_count !== 1 ? 's' : ''} for review`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch pull requests",
        variant: "destructive",
      });
      setPrCount(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (token) {
      fetchPRs(token);
    }
  };

  const handleLogout = () => {
    setToken("");
    setPrCount(null);
    setPrCreators([]);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      fetchPRs(token, false); // Silent refresh, no toast
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {prCount === null ? (
          <TokenInput onSubmit={fetchPRs} isLoading={isLoading} />
        ) : (
          <div className="space-y-8">
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
            
            <PRCreatorCards creators={prCreators} />
            
            <PRCounter count={prCount} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
