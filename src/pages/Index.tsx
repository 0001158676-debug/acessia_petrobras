import { useState, useRef } from "react";
import { Mic, MicOff, Send, Eye, Ear, Accessibility, Brain, MessageCircle, Layers, Puzzle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ResultCard } from "@/components/ResultCard";
import { HistoryList } from "@/components/HistoryList";
import { analyzeproblem, type AnalysisResult } from "@/lib/ai-analyzer";
import { useToast } from "@/hooks/use-toast";
import logoAcessia from "@/assets/logo_acessia.png";

const Index = () => {
  const [problem, setProblem] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!problem.trim()) {
      toast({ title: "Atenção", description: "Descreva o problema antes de analisar.", variant: "destructive" });
      return;
    }
    setIsAnalyzing(true);
    // Simular delay de IA
    await new Promise((r) => setTimeout(r, 1500));
    const analysis = analyzeproblem(problem);
    setResult(analysis);
    setHistory((prev) => [analysis, ...prev]);
    setProblem("");
    setIsAnalyzing(false);
  };

  const toggleVoice = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: "Não suportado", description: "Seu navegador não suporta reconhecimento de voz.", variant: "destructive" });
      return;
    }

    // Request microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop tracks immediately — we just needed the permission
      stream.getTracks().forEach((t) => t.stop());
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        toast({ title: "Microfone bloqueado", description: "Permita o acesso ao microfone nas configurações do navegador.", variant: "destructive" });
      } else if (err.name === "NotFoundError") {
        toast({ title: "Sem microfone", description: "Nenhum microfone foi encontrado no dispositivo.", variant: "destructive" });
      } else {
        toast({ title: "Erro", description: "Não foi possível acessar o microfone.", variant: "destructive" });
      }
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setProblem((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognition.onerror = (e: any) => {
      console.error("Speech recognition error:", e.error);
      setIsListening(false);
      if (e.error === "not-allowed") {
        toast({ title: "Microfone bloqueado", description: "Permita o acesso ao microfone nas configurações do navegador.", variant: "destructive" });
      }
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.error("Failed to start recognition:", err);
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary-dark border-b border-primary/30 shadow-lg">
        <div className="container max-w-5xl mx-auto px-4 py-5 flex items-center gap-4">
          <img src={logoAcessia} alt="AcessIA Petrobras" className="h-14 w-14 rounded-2xl object-cover shadow-md" />
          <div>
            <h1 className="text-2xl font-extrabold text-primary-foreground tracking-tight">AcessIA Petrobras</h1>
            <p className="text-sm text-primary-foreground/70 font-medium">Totem Inteligente de Acessibilidade</p>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Eye, label: "Visual", count: history.filter((h) => h.type === "visual").length },
            { icon: Ear, label: "Auditiva", count: history.filter((h) => h.type === "auditiva").length },
            { icon: Accessibility, label: "Motora", count: history.filter((h) => h.type === "motora").length },
            { icon: Brain, label: "Cognitiva", count: history.filter((h) => h.type === "cognitiva").length },
            { icon: MessageCircle, label: "Fala", count: history.filter((h) => h.type === "fala").length },
            { icon: Layers, label: "Múltipla", count: history.filter((h) => h.type === "multipla").length },
            { icon: Puzzle, label: "Autismo", count: history.filter((h) => h.type === "autismo").length },
            { icon: Heart, label: "Down", count: history.filter((h) => h.type === "down").length },
          ].map(({ icon: Icon, label, count }) => (
            <Card key={label} className="card-hover group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight">{count}</p>
                  <p className="text-sm text-muted-foreground font-medium">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Input area */}
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Descreva o problema de acessibilidade
              </label>
              <Textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Ex: O funcionário com deficiência visual não consegue ler as informações no terminal de controle..."
                className="min-h-[120px] text-base resize-none border-2 focus:border-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAnalyze();
                  }
                }}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="hero"
                size="lg"
                className="flex-1 h-14 text-base"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="h-5 w-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Analisar com IA
                  </>
                )}
              </Button>
              <Button
                variant="mic"
                size="lg"
                className="h-14 w-14"
                onClick={toggleVoice}
                aria-label={isListening ? "Parar gravação" : "Gravar voz"}
              >
                {isListening ? (
                  <MicOff className="h-6 w-6 animate-pulse-slow" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result && <ResultCard result={result} />}

        {/* History */}
        <HistoryList history={history} />
      </main>
    </div>
  );
};

export default Index;
