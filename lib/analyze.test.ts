import { describe, expect, it } from "vitest";
import { analyzeDocument } from "./analyze";

describe("analyzeDocument", () => {
  it("returns a safe empty analysis for blank content", () => {
    const analysis = analyzeDocument(" \n ");

    expect(analysis.summary).toContain("No document content");
    expect(analysis.findings).toHaveLength(0);
    expect(analysis.dates).toEqual([]);
  });

  it("detects configured clause categories with source excerpts", () => {
    const content = [
      "SERVICE AGREEMENT",
      "This agreement is between Example Company and Client.",
      "The parties agree to indemnify each other.",
      "Either party may terminate with 30 days notice.",
      "This agreement renews automatically on January 1, 2027.",
    ].join("\n");

    const analysis = analyzeDocument(content);
    const categories = analysis.findings.map((finding) => finding.category);

    expect(categories).toEqual(expect.arrayContaining(["indemnity", "termination", "renewal"]));
    expect(analysis.dates).toContain("January 1, 2027");
    expect(analysis.sections).toContain("SERVICE AGREEMENT");
    expect(analysis.findings.every((finding) => finding.excerpt.length > 0)).toBe(true);
  });

  it("deduplicates repeated dates", () => {
    const analysis = analyzeDocument("Effective January 1, 2027. Renewal date: January 1, 2027.");

    expect(analysis.dates).toEqual(["January 1, 2027"]);
  });
});
