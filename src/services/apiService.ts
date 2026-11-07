import { QuizQuestion, Difficulty } from '../types/quiz';
import { FALLBACK_QUESTIONS } from '../data/fallbackQuestions';

// Robust HTML entity decoder
export function decodeHtml(html: string): string {
  if (!html) return '';
  // First pass: standard string replacements for most common entities
  let text = html
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&eacute;/g, 'é')
    .replace(/&Eacute;/g, 'É')
    .replace(/&oacute;/g, 'ó')
    .replace(/&aacute;/g, 'á')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&uuml;/g, 'ü')
    .replace(/&deg;/g, '°')
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&hellip;/g, '…');

  // Second pass: browser DOMParser if available in client environment
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(text, 'text/html');
      if (doc.documentElement.textContent) {
        text = doc.documentElement.textContent;
      }
    } catch {
      // ignore
    }
  }
  return text;
}

// Fisher-Yates array shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

interface OpenTdbResponseItem {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface OpenTdbApiResponse {
  response_code: number;
  results: OpenTdbResponseItem[];
}

export const apiService = {
  async fetchQuestions({
    categoryKey,
    numericCategoryId,
    difficulty,
    amount,
    customQuestions = [],
  }: {
    categoryKey: string;
    numericCategoryId?: number;
    difficulty: Difficulty;
    amount: number;
    customQuestions?: QuizQuestion[];
  }): Promise<{ questions: QuizQuestion[]; source: 'api' | 'local' | 'custom' }> {
    // If user specifically requested custom questions or category is custom
    if (categoryKey === 'custom' || categoryKey === 'user_custom') {
      if (customQuestions.length > 0) {
        const filtered = customQuestions.filter(
          (q) => !difficulty || q.difficulty === difficulty || customQuestions.length <= amount
        );
        const selected = shuffleArray(filtered.length > 0 ? filtered : customQuestions).slice(0, amount);
        return {
          questions: selected.map((q) => ({
            ...q,
            options: shuffleArray(q.options),
          })),
          source: 'custom',
        };
      }
    }

    // Attempt live Open Trivia DB fetch
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout

      let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
      if (numericCategoryId && numericCategoryId > 0) {
        url += `&category=${numericCategoryId}`;
      }
      if (difficulty) {
        url += `&difficulty=${difficulty}`;
      }

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = (await response.json()) as OpenTdbApiResponse;

        if (data.response_code === 0 && data.results && data.results.length > 0) {
          const mappedQuestions: QuizQuestion[] = data.results.map((item, idx) => {
            const decodedQuestion = decodeHtml(item.question);
            const decodedCorrect = decodeHtml(item.correct_answer);
            const decodedIncorrect = item.incorrect_answers.map(decodeHtml);
            const allOptions = shuffleArray([decodedCorrect, ...decodedIncorrect]);

            return {
              id: `api-${numericCategoryId || 0}-${Date.now()}-${idx}`,
              category: decodeHtml(item.category),
              categoryId: numericCategoryId,
              difficulty: (item.difficulty as Difficulty) || difficulty,
              question: decodedQuestion,
              options: allOptions,
              correctAnswer: decodedCorrect,
              explanation: `The correct answer is "${decodedCorrect}". Verified from Open Trivia Database records.`,
            };
          });

          return { questions: mappedQuestions, source: 'api' };
        }
      }
    } catch (err) {
      console.warn('Open Trivia DB API not reachable or timed out. Falling back to internal question bank.', err);
    }

    // Graceful fallback to verified curated question bank
    const categoryFallbacks = FALLBACK_QUESTIONS[categoryKey] || FALLBACK_QUESTIONS['general_knowledge'];
    let pool = [...categoryFallbacks];

    // If more questions needed than single category pool, supplement with other categories
    if (pool.length < amount) {
      Object.entries(FALLBACK_QUESTIONS).forEach(([k, list]) => {
        if (k !== categoryKey) {
          pool.push(...list);
        }
      });
    }

    const shuffledPool = shuffleArray(pool);
    const selected = shuffledPool.slice(0, amount).map((q, idx) => ({
      ...q,
      id: `${q.id}-${idx}`,
      options: shuffleArray(q.options),
    }));

    return { questions: selected, source: 'local' };
  },
};
