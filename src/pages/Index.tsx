import { useState, useEffect, useRef } from "react";
import { TokenInput } from "@/components/TokenInput";
import { PRCounter } from "@/components/PRCounter";
import { PRCreatorCards } from "@/components/PRCreatorCards";
import { PRLeaderboard } from "@/components/PRLeaderboard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { LogOut, RefreshCw, Volume2 } from "lucide-react";

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
  unresolvedComments: number;
}

interface LeaderboardEntry {
  login: string;
  avatar_url: string;
  prCount: number;
}

const Index = () => {
  const [token, setToken] = useState<string>("");
  const [prCount, setPrCount] = useState<number | null>(null);
  const [prCreators, setPrCreators] = useState<PRCreator[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const previousPrCountRef = useRef<number | null>(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("github_token");
    if (savedToken) {
      setToken(savedToken);
      fetchPRs(savedToken, false);
      fetchMonthlyLeaderboard(savedToken);
    }
  }, []);

  const playBeep = () => {
    if (!soundEnabled) return;
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const playCelebration = () => {
    if (!soundEnabled) return;
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Play ascending notes for celebration
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      const startTime = audioContext.currentTime + (index * 0.15);
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  };

  const fetchMonthlyLeaderboard = async (githubToken: string) => {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const formattedDate = firstDayOfMonth.toISOString().split('T')[0];
      
      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!userResponse.ok) return;
      
      const user = await userResponse.json();
      
      // Get all PRs from user's organization/repos created this month
      const prsResponse = await fetch(
        `https://api.github.com/search/issues?q=type:pr+created:>=${formattedDate}+author:${user.login}+OR+involves:${user.login}`,
        {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!prsResponse.ok) return;
      
      const data = await prsResponse.json();
      
      // Count PRs by creator
      const creatorsMap = new Map<string, LeaderboardEntry>();
      data.items.forEach((pr: PullRequest) => {
        const login = pr.user.login;
        if (creatorsMap.has(login)) {
          creatorsMap.get(login)!.prCount++;
        } else {
          creatorsMap.set(login, {
            login,
            avatar_url: pr.user.avatar_url,
            prCount: 1,
          });
        }
      });
      
      // Sort by PR count and take top 10
      const sortedLeaderboard = Array.from(creatorsMap.values())
        .sort((a, b) => b.prCount - a.prCount)
        .slice(0, 10);
      
      setLeaderboard(sortedLeaderboard);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    }
  };

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
      
      // Fetch unresolved comments for each PR
      const prCommentsPromises = data.items.map(async (pr: PullRequest) => {
        const prNumber = pr.html_url.split('/').pop();
        const repoUrl = pr.html_url.split('/pull/')[0];
        const [owner, repo] = repoUrl.split('/').slice(-2);
        
        try {
          const reviewCommentsResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/comments`,
            {
              headers: {
                Authorization: `token ${githubToken}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );
          
          if (reviewCommentsResponse.ok) {
            const comments = await reviewCommentsResponse.json();
            // Count unresolved comments (comments without a resolved state or in_reply_to_id that's unresolved)
            const unresolvedCount = comments.filter((comment: any) => 
              comment.in_reply_to_id === undefined || comment.in_reply_to_id === null
            ).length;
            return { prUser: pr.user.login, unresolvedCount };
          }
        } catch (error) {
          console.error('Error fetching comments for PR:', error);
        }
        return { prUser: pr.user.login, unresolvedCount: 0 };
      });
      
      const prCommentsResults = await Promise.all(prCommentsPromises);
      
      // Group PRs by creator and aggregate unresolved comments
      const creatorsMap = new Map<string, PRCreator>();
      data.items.forEach((pr: PullRequest, index: number) => {
        const login = pr.user.login;
        const unresolvedComments = prCommentsResults[index].unresolvedCount;
        
        if (creatorsMap.has(login)) {
          const creator = creatorsMap.get(login)!;
          creator.count++;
          creator.unresolvedComments += unresolvedComments;
        } else {
          creatorsMap.set(login, {
            login,
            avatar_url: pr.user.avatar_url,
            count: 1,
            unresolvedComments,
          });
        }
      });
      
      setPrCreators(Array.from(creatorsMap.values()));
      
      // Check for PR count changes and play sounds
      const newCount = data.total_count;
      const previousCount = previousPrCountRef.current;
      
      if (previousCount !== null) {
        // New PR appeared
        if (newCount > previousCount) {
          playBeep();
        }
        // All PRs reviewed
        if (previousCount > 0 && newCount === 0) {
          playCelebration();
        }
      }
      
      previousPrCountRef.current = newCount;
      setPrCount(newCount);
      setToken(githubToken);
      
      // Save token to localStorage
      localStorage.setItem("github_token", githubToken);
      
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
      fetchMonthlyLeaderboard(token);
    }
  };

  const handleLogout = () => {
    setToken("");
    setPrCount(null);
    setPrCreators([]);
    setLeaderboard([]);
    previousPrCountRef.current = null;
    
    // Clear token from localStorage
    localStorage.removeItem("github_token");
    
    toast({
      title: "Logged out",
      description: "Your GitHub token has been removed",
    });
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
    <div className="min-h-screen bg-background p-6">
      {prCount !== null && (
        <div className="fixed top-6 right-6 flex gap-3 z-10">
          <div className="flex items-center gap-2 bg-background border rounded-md px-3 py-2">
            <Checkbox 
              id="sound-toggle"
              checked={soundEnabled}
              onCheckedChange={(checked) => setSoundEnabled(checked as boolean)}
            />
            <Label 
              htmlFor="sound-toggle" 
              className="text-sm cursor-pointer flex items-center gap-1"
            >
              <Volume2 className="w-4 h-4" />
              Sound
            </Label>
          </div>
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
      )}
      
      {prCount === null ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <TokenInput onSubmit={fetchPRs} isLoading={isLoading} />
          </div>
        </div>
      ) : (
        <div className="flex gap-6 justify-center items-start pt-20">
          <PRLeaderboard entries={leaderboard} />
          
          <div className="space-y-8">
            <PRCounter count={prCount} />
            <PRCreatorCards creators={prCreators} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
