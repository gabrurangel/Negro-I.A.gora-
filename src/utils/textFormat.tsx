import React from 'react';

/**
 * Strips markdown symbols like *, **, _, #, `, ~ so that SpeechSynthesis
 * speaks smoothly without saying literal words like "asterisco" or "jogo da velha".
 */
export function stripMarkdownForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/[*_#`~>]/g, '')
    .replace(/\[\d+\/\d+:[^\]]+\]/g, (match) => match.replace(/[[\]]/g, ''))
    .trim();
}

interface FormattedTextProps {
  text: string;
  isAssistant?: boolean;
  className?: string;
}

/**
 * Renders text with support for bold (**text**), italics (*text*),
 * and clean line breaks without showing raw asterisks.
 */
export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  isAssistant = true,
  className = '',
}) => {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className={`space-y-1.5 ${className}`}>
      {lines.map((line, lineIndex) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIndex} className="h-1" />;
        }

        return (
          <p key={lineIndex} className="leading-snug">
            {renderLineWithFormatting(line, isAssistant)}
          </p>
        );
      })}
    </div>
  );
};

function renderLineWithFormatting(line: string, isAssistant: boolean): React.ReactNode {
  // Regex to match **bold** or *italic*
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      const boldText = token.slice(2, -2);
      parts.push(
        <strong
          key={key++}
          className={
            isAssistant
              ? 'font-bold text-amber-300 drop-shadow-sm'
              : 'font-bold text-white underline decoration-amber-300/70'
          }
        >
          {boldText}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const italicText = token.slice(1, -1);
      parts.push(
        <em key={key++} className="italic text-amber-200/90 font-medium">
          {italicText}
        </em>
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return parts.length > 0 ? parts : line;
}
