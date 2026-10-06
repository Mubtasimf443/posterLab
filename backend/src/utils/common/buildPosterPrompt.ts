/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

interface PosterPromptParams {
  occasionType: string;
  title: string;
  name: string;
  designation: string;
  party: string;
  district: string;
  primary: string;
  secondary: string;
  accent: string;
  textSlots?: string[];
}

export default function buildPosterPrompt({
  occasionType,
  title,
  name,
  designation,
  party,
  district,
  primary,
  secondary,
  accent,
  textSlots = [],
}: PosterPromptParams): string {
  const slots: string = textSlots
    .map((slot: string, index: number) => `${index + 1}. "${slot}"`)
    .join('\n');

  return `
Create a professional event poster in a 3:4 portrait aspect ratio.

EVENT:
    - Event / Occasion: "${occasionType}"
    - Main headline: "${title}"

DESIGN STYLE:
    - Style: Retro-modern, energetic, premium, professional political/event poster design.
    - The design should look polished, visually balanced, and suitable for official public/event promotion.
    - Use strong typography, clean composition, subtle retro-inspired graphic elements, and modern visual hierarchy.
    - Create a visually striking composition without making it cluttered.
    - Use the entire canvas effectively.

COLOR PALETTE:
    - Primary color: ${primary}
    - Secondary color: ${secondary}
    - Accent color: ${accent}
    - Use these colors consistently throughout the poster.
    - Maintain strong contrast between the background and all text.
    - Do not introduce unrelated dominant colors.

TEXT CONTENT:
The following text must appear EXACTLY as provided. Do not rewrite, translate, abbreviate, correct, paraphrase, or invent any of the text.

1. HEADLINE:
"${title}"

2. PERSON NAME:
"${name}"

3. DESIGNATION:
"${designation}"

4. POLITICAL PARTY:
"${party}"

5. DISTRICT:
"${district}"

6. TEXT SLOTS:
${slots}

TEXT LAYOUT:
    - The headline "${title}" must be the most prominent text element.
    - "${name}" should be clearly visible and visually associated with the person's portrait.
    - Place "${designation}" immediately after or below the person's name.
    - Place "${party}" after the designation.
    - Display "${district}" clearly but with less visual emphasis than the headline.
    - Incorporate every text slot exactly as provided.
    - Do not omit any provided text.
    - Do not add any text that was not provided.
    - Do not generate slogans, quotes, dates, locations, captions, hashtags, logos, or decorative words unless they are explicitly provided above.
    - Preserve the exact spelling, capitalization, punctuation, and wording of every provided text value.
    - Make all text highly legible and correctly spelled.
    - Never generate fake, random, garbled, or distorted letters.

IMAGE INSTRUCTIONS:
    - Image 1 is the user's portrait/photo.
    - Treat Image 1 as the primary person's photograph.
    - Preserve the person's identity and facial features.
    - Do not significantly alter, redraw, distort, or replace the person's face.
    - Place the person naturally and prominently within the poster composition.
    - Any additional provided images are image slots and should be incorporated into the poster where visually appropriate.
    - Do not confuse the user's portrait with other image slots.
    - Do not generate additional people unless they are already present in the provided images.

COMPOSITION:
- Create a clear visual hierarchy:
    1. Main headline
    2. User portrait
    3. User name
    4. Designation and political party
    5. District
    6. Additional text slots
    - Keep important text and the person's face away from the edges.
    - Use appropriate spacing, alignment, typography, and visual balance.
    - Avoid overcrowding.
    - Make the poster look like it was designed by a professional graphic designer rather than generated from a generic template.

QUALITY REQUIREMENTS:
    - High-resolution professional poster appearance.
    - Sharp and clean typography.
    - Correctly rendered text.
    - No distorted letters.
    - No overlapping text.
    - No cropped important text.
    - No distorted faces.
    - No unnecessary decorative elements that interfere with readability.

STRICT RESTRICTIONS:
    - Do NOT add any additional text.
    - Do NOT invent or modify any provided text.
    - Do NOT add watermarks.
    - Do NOT add logos unless they are provided as an image.
    - Do NOT add fake signatures.
    - Do NOT add random symbols that resemble letters.
    - Do NOT include placeholder text.
`;
}