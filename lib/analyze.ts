export type FindingSeverity = "high" | "medium" | "low";

export type Finding = {
  category: string;
  severity: FindingSeverity;
  title: string;
  explanation: string;
  excerpt: string;
};

export type Analysis = {
  summary: string;
  sections: string[];
  parties: string[];
  dates: string[];
  findings: Finding[];
};

const rules: Array<{
  category: string;
  severity: FindingSeverity;
  title: string;
  explanation: string;
  pattern: RegExp;
}> = [
  {
    category: "liability",
    severity: "high",
    title: "Liability limitation detected",
    explanation: "Check exclusions, caps, carve-outs, and whether the limitation is mutual.",
    pattern: /\bliabilit(y|ies)|limitation of liability|liable for\b/i,
  },
  {
    category: "indemnity",
    severity: "high",
    title: "Indemnity language detected",
    explanation: "Review who indemnifies whom, covered losses, control of defense, and exceptions.",
    pattern: /\bindemnif(y|ies|ied)|indemnification|hold harmless\b/i,
  },
  {
    category: "termination",
    severity: "medium",
    title: "Termination terms detected",
    explanation: "Confirm notice periods, termination for convenience, and post-termination duties.",
    pattern: /\bterminat(e|ion|ed)|cancellation|notice period\b/i,
  },
  {
    category: "renewal",
    severity: "medium",
    title: "Renewal terms detected",
    explanation: "Check automatic renewal, renewal notice deadlines, and price changes.",
    pattern: /\bauto(matic|matically)?[- ]?renew|renewal|renew(s|ed)?\b/i,
  },
  {
    category: "privacy",
    severity: "medium",
    title: "Privacy or data-processing language detected",
    explanation: "Review permitted processing, security duties, retention, subprocessors, and breach notices.",
    pattern: /\bpersonal data|personal information|privacy|data protection|subprocessor\b/i,
  },
  {
    category: "intellectual property",
    severity: "medium",
    title: "Intellectual-property language detected",
    explanation: "Confirm ownership, licenses, pre-existing materials, and rights to derived work.",
    pattern: /\bintellectual property|copyright|trademark|work made for hire|license\b/i,
  },
  {
    category: "jurisdiction",
    severity: "low",
    title: "Governing law or jurisdiction detected",
    explanation: "Confirm the governing law, venue, dispute process, and enforceability in your situation.",
    pattern: /\bgoverning law|jurisdiction|venue|arbitration\b/i,
  },
];

function excerpt(content: string, matchIndex: number): string {
  const start = Math.max(0, matchIndex - 100);
  const end = Math.min(content.length, matchIndex + 220);
  return content.slice(start, end).replace(/\s+/g, " ").trim();
}

export function analyzeDocument(content: string): Analysis {
  const normalized = content.replace(/\r\n/g, "\n").trim();
  const lines = normalized.split("\n").map((line) => line.trim()).filter(Boolean);
  const sections = lines.filter((line) => line.length <= 100 && (/^\d+[\].): -]/.test(line) || /^[A-Z][A-Z\s&-]{5,}$/.test(line))).slice(0, 20);
  const dates = normalized.match(/\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})\b/gi) ?? [];
  const parties = lines
    .filter((line) => /\b(the parties|between|agreement between|("provider"|"client"|"customer"|"company"))\b/i.test(line))
    .slice(0, 6);

  const findings = rules.flatMap((rule) => {
    const match = rule.pattern.exec(normalized);
    return match?.index === undefined
      ? []
      : [{ category: rule.category, severity: rule.severity, title: rule.title, explanation: rule.explanation, excerpt: excerpt(normalized, match.index) }];
  });

  const summary = normalized
    ? `This document contains ${lines.length} non-empty lines. The local review identified ${findings.length} clause categories for human review; it does not determine legal effect or enforceability.`
    : "No document content was provided.";

  return { summary, sections, parties, dates: [...new Set(dates)], findings };
}
