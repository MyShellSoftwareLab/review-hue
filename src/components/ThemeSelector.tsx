import { useTheme, Theme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

const themeLabels: Record<Theme, string> = {
  default: "Default",
  halloween: "Halloween",
  christmas: "Christmas",
};

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="w-4 h-4" />
          {themeLabels[theme]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => setTheme('default')}>
          Default
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('halloween')}>
          🎃 Halloween
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('christmas')}>
          🎄 Christmas
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
