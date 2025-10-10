import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeatmapData {
  week: number;
  days: { dayOfWeek: number; count: number; date: string }[];
}

interface PRHeatmapProps {
  data: HeatmapData[];
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const PRHeatmap = ({ data }: PRHeatmapProps) => {
  const getHeatColor = (count: number) => {
    if (count === 0) return "hsl(var(--muted))";
    if (count <= 2) return "hsl(var(--primary) / 0.3)";
    if (count <= 4) return "hsl(var(--primary) / 0.5)";
    if (count <= 6) return "hsl(var(--primary) / 0.7)";
    return "hsl(var(--primary))";
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
          <div className="grid grid-cols-8 gap-2 text-xs text-muted-foreground">
            <div></div>
            {dayNames.map((day) => (
              <div key={day} className="text-center font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {data.map((week) => (
            <div key={week.week} className="grid grid-cols-8 gap-2">
              <div className="text-xs text-muted-foreground flex items-center">
                Week {week.week}
              </div>
              {week.days.map((day) => (
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
            <span>Less</span>
            {[0, 2, 4, 6, 8].map((count) => (
              <div
                key={count}
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: getHeatColor(count) }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
