"use client";
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

interface LatexTextProps {
  text: string;
  inline?: boolean;
}

export function LatexText({ text, inline = true }: LatexTextProps) {
  // Regex para encontrar expresiones LaTeX: $...$ (inline) o $$...$$ (block)
  const latexRegex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;
  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = latexRegex.exec(text)) !== null) {
    // Agregar texto antes de la expresión LaTeX
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Determinar si es block ($$) o inline ($)
    if (match[1]) {
      // Block math: $$...$$
      parts.push(<BlockMath key={match.index} math={match[1]} />);
    } else if (match[2]) {
      // Inline math: $...$
      parts.push(<InlineMath key={match.index} math={match[2]} />);
    }

    lastIndex = match.index + match[0].length;
  }

  // Agregar el texto restante
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // Si no hay expresiones LaTeX, devolver el texto tal cual
  if (parts.length === 0) {
    return <>{text}</>;
  }

  return <>{parts}</>;
}

