import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeatmapData {
  week: number;
  days: { dayOfWeek: number; count: number; date: string }[];
}

interface PRHeatmapProps {
  data: HeatmapData[];
}

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export const PRHeatmap = ({ data }: PRHeatmapProps) => {
  const getHeatColor = (count: number) => {
    if (count === 0) return "hsl(var(--muted))";
    if (count < 10) return "hsl(0, 70%, 50%)"; // Red
    if (count < 20) return "hsl(30, 70%, 50%)"; // Orange
    if (count < 30) return "hsl(60, 70%, 50%)"; // Yellow
    if (count < 40) return "hsl(90, 70%, 50%)"; // Yellow-green
    return "hsl(120, 70%, 40%)"; // Green
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>PR Creation Heatmap</CardTitle>
        <p className="text-sm text-muted-foreground">This Month</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Day labels */}
          <div className="grid grid-cols-6 gap-2 text-xs text-muted-foreground">
            <div></div>
            {dayNames.map((day) => (
              <div key={day} className="text-center font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {data.map((week) => (
            <div key={week.week} className="grid grid-cols-6 gap-2">
              <div className="text-xs text-muted-foreground flex items-center">
                Week {week.week}
              </div>
              {week.days
                .filter((day) => day.dayOfWeek >= 1 && day.dayOfWeek <= 5)
                .map((day) => (
                <div
                  key={`${week.week}-${day.dayOfWeek}`}
                  className="aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-all hover:scale-110 hover:shadow-lg cursor-pointer"
                  style={{ backgroundColor: getHeatColor(day.count) }}
                  title={`${day.date}: ${day.count} PR${day.count !== 1 ? 's' : ''}`}
                >
                  {day.count > 0 && (
                    <span className="text-foreground">{day.count}</span>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4">
            <span>Less (&lt;10)</span>
            {[0, 5, 15, 25, 35, 45].map((count) => (
              <div
                key={count}
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: getHeatColor(count) }}
              />
            ))}
            <span>More (40+)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
