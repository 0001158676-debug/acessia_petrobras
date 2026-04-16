import { Eye, Ear, Accessibility, Brain, MessageCircle, Layers, Puzzle, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalysisResult } from "@/lib/ai-analyzer";

const typeConfig = {
  visual: { label: "Visual", icon: Eye, color: "bg-blue-100 text-blue-800" },
  auditiva: { label: "Auditiva", icon: Ear, color: "bg-purple-100 text-purple-800" },
  motora: { label: "Motora", icon: Accessibility, color: "bg-orange-100 text-orange-800" },
  cognitiva: { label: "Cognitiva", icon: Brain, color: "bg-teal-100 text-teal-800" },
  fala: { label: "Fala", icon: MessageCircle, color: "bg-pink-100 text-pink-800" },
  multipla: { label: "Múltipla", icon: Layers, color: "bg-amber-100 text-amber-800" },
  autismo: { label: "Autismo", icon: Puzzle, color: "bg-indigo-100 text-indigo-800" },
  down: { label: "Síndrome de Down", icon: Heart, color: "bg-rose-100 text-rose-800" },
};

const priorityConfig = {
  alta: "bg-priority-high/10 text-priority-high border-priority-high/30",
  média: "bg-priority-medium/10 text-priority-medium border-priority-medium/30",
  baixa: "bg-priority-low/10 text-priority-low border-priority-low/30",
};

export function ResultCard({ result }: { result: AnalysisResult }) {
  const typeInfo = typeConfig[result.type];
  const Icon = typeInfo.icon;

  return (
    <Card className="card-hover animate-slide-up border-l-4 border-l-primary overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            Resultado da Análise
          </CardTitle>
          <Badge variant="outline" className={priorityConfig[result.priority] + " font-semibold border"}>
            Prioridade {result.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Problema relatado</p>
          <p className="text-foreground">{result.problem}</p>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 rounded-lg bg-secondary p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Tipo</p>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
              <Icon className="h-3 w-3" />
              {typeInfo.label}
            </span>
          </div>
          <div className="flex-1 rounded-lg bg-secondary p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Prioridade</p>
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${priorityConfig[result.priority]}`}>
              {result.priority.charAt(0).toUpperCase() + result.priority.slice(1)}
            </span>
          </div>
        </div>
        <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
          <p className="text-sm font-semibold text-primary mb-1">💡 Solução sugerida</p>
          <p className="text-foreground">{result.solution}</p>
        </div>
      </CardContent>
    </Card>
  );
}
