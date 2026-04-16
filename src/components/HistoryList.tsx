import { Eye, Ear, Accessibility, Brain, MessageCircle, Layers, Clock, Puzzle, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisResult } from "@/lib/ai-analyzer";

const typeIcons = {
  visual: Eye,
  auditiva: Ear,
  motora: Accessibility,
  cognitiva: Brain,
  fala: MessageCircle,
  multipla: Layers,
  autismo: Puzzle,
  down: Heart,
};

export function HistoryList({ history }: { history: AnalysisResult[] }) {
  if (history.length === 0) return null;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Histórico de Análises
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((item) => {
            const Icon = typeIcons[item.type];
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.problem}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} · {item.solution}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {item.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
