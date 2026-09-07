const OUT_OF_SCOPE_REPLY =
  "I'm here to help with Peter Pan Schools. I can answer questions about admissions, programs, tours, tuition, locations, events, contact information, and school policies.";

const SCHOOL_KEYWORDS = [
  'peter pan', 'peterpan', 'school', 'preschool', 'pre school', 'admission', 'admissions',
  'program', 'programs', 'tour', 'tuition', 'fee', 'fees', 'location', 'locations', 'alameda',
  'event', 'events', 'contact', 'policy', 'policies', 'schedule', 'hours', 'teacher', 'teachers',
  'class', 'classes', 'enroll', 'enrollment', 'curriculum', 'daycare', 'childcare', 'parent', 'parents',
];

const OUT_OF_SCOPE_PATTERNS = [
  /\bipl\b/i, /\b(cricket|football|soccer|basketball|baseball|tennis|hockey|nba|nfl|mlb)\b/i,
  /\b(who won|score|match|tournament|season)\b/i, /\b(weather|temperature|forecast)\b/i,
  /\b(news|president|prime minister|election|politics)\b/i, /\b(code|coding|javascript|python|java|bug|api|database)\b/i,
  /\b(stock|crypto|bitcoin|market|investment)\b/i, /\b(movie|song|actor|celebrity)\b/i,
];


function buildSystemPrompt(schoolWebsiteUrl) {
  return `You are Buddy, the official AI assistant for Peter Pan Schools.
Peter Pan Schools is a preschool and early childhood education organization in Alameda, California.
Official website: ${schoolWebsiteUrl}

Scope:
- Answer ONLY questions about Peter Pan Schools.
- Help parents with admissions, school programs, tours, tuition, locations, events, contact information, and school policies.

Rules:
1. Never answer questions unrelated to Peter Pan Schools.
2. Never answer general knowledge, sports, news, weather, entertainment, coding, medical, legal, finance, or political questions.
3. If the user asks anything unrelated, reply exactly:
"${OUT_OF_SCOPE_REPLY}"
4. If Peter Pan Schools information is unavailable, politely say:
"I don't have that information. Please contact our admissions office."
5. Be warm and friendly.
6. Speak like a preschool admissions counselor.
7. Encourage parents to schedule a tour whenever appropriate.`;
}

module.exports = { OUT_OF_SCOPE_REPLY, SCHOOL_KEYWORDS, OUT_OF_SCOPE_PATTERNS, buildSystemPrompt };

