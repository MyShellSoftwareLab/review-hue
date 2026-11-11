import { cn } from "@/lib/utils";

interface PRCounterProps {
  count: number;
  className?: string;
}

export const PRCounter = ({ count, className }: PRCounterProps) => {
  const getStatusColor = () => {
    if (count > 5) return "text-critical";
    if (count > 2) return "text-warning";
    return "text-success";
  };

  const getStatusLabel = () => {
    if (count > 5) return "Critical";
    if (count > 2) return "Warning";
    return "Good";
  };

  const getStatusBg = () => {
    if (count > 5) return "bg-critical/10";
    if (count > 2) return "bg-warning/10";
    return "bg-success/10";
  };

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className={cn(
        "w-full flex justify-center rounded-2xl p-12 transition-all duration-500 border-2",
        getStatusBg(),
        count > 5 ? "border-critical/30" : count > 2 ? "border-warning/30" : "border-success/30"
      )}>
        <div className={cn(
          "text-7xl font-bold transition-colors duration-500 tabular-nums",
          getStatusColor()
        )}>
          {count}
        </div>
      </div>
      <div className="text-center space-y-2">
        <div className="text-2xl font-semibold text-foreground">
          Pull Requests for Review
        </div>
        <div className={cn(
          "inline-block px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-500",
          getStatusBg(),
          getStatusColor()
        )}>
          {getStatusLabel()}
        </div>
      </div>
    </div>
  );
};
