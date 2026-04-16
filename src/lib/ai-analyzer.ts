export interface AnalysisResult {
  id: string;
  problem: string;
  type: "visual" | "auditiva" | "motora" | "cognitiva" | "fala" | "multipla" | "autismo" | "down";
  priority: "alta" | "média" | "baixa";
  solution: string;
  timestamp: Date;
}

const keywords: Record<string, string[]> = {
  visual: ["visão", "visual", "cego", "enxergar", "tela", "contraste", "cor", "fonte", "leitura", "leitor", "ler", "olho", "luz", "brilho", "escuro", "texto pequeno", "letra", "display", "monitor", "baixa visão", "daltonismo", "cegueira", "óculos", "ampliação"],
  auditiva: ["ouvir", "auditivo", "surdo", "som", "áudio", "alarme", "sinal sonoro", "fone", "ruído", "barulho", "orelha", "audição", "escutar", "libras", "língua de sinais", "aparelho auditivo", "deficiente auditivo", "surdez"],
  motora: ["motor", "cadeira", "rampa", "escada", "elevador", "porta", "acesso", "andar", "mobilidade", "locomoção", "muleta", "braço", "mão", "perna", "físico", "ergonômico", "altura", "alcançar", "botão físico", "teclado", "cadeirante", "paralisia", "amputação", "prótese", "órtese"],
  cognitiva: ["cognitivo", "cognitiva", "intelectual", "mental", "aprendizado", "aprendizagem", "compreensão", "memória", "concentração", "atenção", "dificuldade de entender", "confuso", "complexo", "instrução", "lento", "deficiência intelectual", "neurodivergente", "tdah"],
  fala: ["fala", "falar", "comunicação", "mudo", "mudez", "voz", "gaguejar", "gagueira", "articulação", "pronúncia", "verbal", "não verbal", "comunicar", "expressar", "linguagem oral", "afasia", "disfonia", "disartria"],
  multipla: ["múltipla", "multipla", "surdocego", "surdo-cego", "várias deficiências", "combinada", "complexa", "associada", "mais de uma", "dupla deficiência"],
  autismo: ["autismo", "autista", "tea", "transtorno do espectro autista", "espectro autista", "asperger", "neurodivergente", "hipersensibilidade", "sensorial", "estereotipia", "rotina", "estímulo", "sobrecarga sensorial", "interação social"],
  down: ["down", "síndrome de down", "trissomia", "trissomia 21", "cromossomo 21", "síndrome"],
};

const solutions: Record<string, string[]> = {
  visual: [
    "Instalar leitor de tela compatível com os sistemas internos.",
    "Aumentar o contraste e tamanho das fontes nos terminais.",
    "Implementar modo de alto contraste em todas as interfaces.",
    "Adicionar descrições em áudio para sinalizações visuais.",
    "Instalar piso tátil direcional nas áreas de circulação.",
    "Disponibilizar lupas eletrônicas nos postos de trabalho.",
    "Implementar audiodescrição em materiais de treinamento.",
  ],
  auditiva: [
    "Instalar alertas visuais (luzes piscantes) para alarmes sonoros.",
    "Disponibilizar intérprete de Libras em reuniões presenciais.",
    "Implementar legendas automáticas em videoconferências.",
    "Substituir sinais sonoros por notificações visuais e vibratórias.",
    "Instalar painéis informativos visuais em áreas comuns.",
    "Fornecer aparelhos de amplificação sonora individual.",
    "Implementar sistema de comunicação por texto em tempo real.",
  ],
  motora: [
    "Instalar rampa de acesso com inclinação adequada (NBR 9050).",
    "Adaptar a altura dos terminais para cadeirantes.",
    "Instalar portas automáticas com sensor de proximidade.",
    "Disponibilizar mesa com altura ajustável no posto de trabalho.",
    "Adicionar barras de apoio nos banheiros e corredores.",
    "Instalar elevadores acessíveis em todos os pavimentos.",
    "Adaptar estacionamento com vagas reservadas e sinalizadas.",
  ],
  cognitiva: [
    "Simplificar a interface dos sistemas com linguagem clara e direta.",
    "Criar manuais com instruções visuais passo a passo (pictogramas).",
    "Implementar assistente virtual para guiar tarefas complexas.",
    "Reduzir sobrecarga de informações nas telas do sistema.",
    "Disponibilizar treinamentos adaptados com repetição e reforço.",
    "Criar rotinas visuais e cronogramas ilustrados para tarefas diárias.",
    "Implementar feedback visual imediato para cada ação do usuário.",
  ],
  fala: [
    "Disponibilizar sistema de comunicação alternativa (pranchas/tablets).",
    "Implementar chat por texto como alternativa a chamadas de voz.",
    "Instalar software de comunicação aumentativa e alternativa (CAA).",
    "Substituir interações verbais obrigatórias por formulários digitais.",
    "Treinar equipe para comunicação paciente e uso de gestos.",
    "Disponibilizar aplicativo de texto-para-voz nos postos de trabalho.",
    "Implementar sistema de chamados por escrito para suporte técnico.",
  ],
  multipla: [
    "Realizar avaliação individualizada para adaptar o posto de trabalho.",
    "Combinar tecnologias assistivas (leitor de tela + comunicação alternativa).",
    "Designar profissional de apoio para acompanhamento personalizado.",
    "Criar plano de acessibilidade integrado considerando todas as necessidades.",
    "Implementar ambiente multissensorial com estímulos visuais, táteis e auditivos.",
    "Adaptar equipamentos com acionamento por múltiplas modalidades (voz, toque, sopro).",
    "Garantir acessibilidade arquitetônica completa com sinalização tátil e visual.",
  ],
  autismo: [
    "Criar ambiente de trabalho com redução de estímulos sensoriais (luz, som).",
    "Estabelecer rotinas claras e previsíveis com cronogramas visuais.",
    "Disponibilizar espaço silencioso para pausas e autorregulação.",
    "Fornecer instruções escritas e objetivas, evitando linguagem figurada.",
    "Implementar comunicação direta e clara, sem ambiguidades.",
    "Oferecer fones com cancelamento de ruído para concentração.",
    "Designar mentor para apoio na adaptação e interações sociais.",
  ],
  down: [
    "Adaptar materiais de treinamento com linguagem simples e visual.",
    "Criar rotinas estruturadas com apoio de pictogramas e checklists.",
    "Disponibilizar acompanhamento profissional para desenvolvimento de habilidades.",
    "Implementar sistema de reforço positivo e feedback constante.",
    "Adaptar tarefas com instruções passo a passo ilustradas.",
    "Garantir inclusão em atividades de equipe com apoio adequado.",
    "Oferecer treinamentos práticos com repetição e demonstração.",
  ],
};

function classify(text: string): AnalysisResult["type"] {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};
  for (const [type, words] of Object.entries(keywords)) {
    scores[type] = words.filter((k) => lower.includes(k)).length;
  }
  const max = Math.max(...Object.values(scores));
  if (max === 0) return "visual";
  const best = Object.entries(scores).filter(([, v]) => v === max);
  if (best.length > 2) return "multipla";
  return best[0][0] as AnalysisResult["type"];
}

function getPriority(text: string): "alta" | "média" | "baixa" {
  const lower = text.toLowerCase();
  const highWords = ["urgente", "grave", "perigo", "risco", "acidente", "emergência", "impossível", "não consegue", "bloqueado"];
  const lowWords = ["sugestão", "melhoria", "futuro", "talvez", "poderia"];
  if (highWords.some((w) => lower.includes(w))) return "alta";
  if (lowWords.some((w) => lower.includes(w))) return "baixa";
  return "média";
}

export function analyzeproblem(problem: string): AnalysisResult {
  const type = classify(problem);
  const solutionList = solutions[type];
  const solution = solutionList[Math.floor(Math.random() * solutionList.length)];

  return {
    id: crypto.randomUUID(),
    problem,
    type,
    priority: getPriority(problem),
    solution,
    timestamp: new Date(),
  };
}
