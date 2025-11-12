export interface Solution {
  id: number;
  title: string;
  explanation: string;
  code_snippet: string;
  example: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  solutions: Solution[];
}
