export interface SolutionExample {
  input: string;
  steps: Array<{
    iteration: number;
    description: string;
    variables?: Record<string, any>;
    code_line?: string;
    output: string;
  }>;
  final_output: string;
}

export interface Solution {
  id: number;
  title: string;
  explanation: string;
  code_snippet: string;
  complexity?: string;
  example: string | SolutionExample;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  solutions: Solution[];
}
