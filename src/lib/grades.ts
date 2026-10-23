import { weeks } from '../curriculum';
import { attemptScore, quizKey, type StudentData } from './store';
export const categories = [
  { id: 'quiz', name: 'Weekly quizzes & written exams', weight: 15 },
  { id: 'lab', name: 'Laboratories', weight: 35 },
  { id: 'assignment', name: 'Assignments & documentation', weight: 20 },
  { id: 'midterm', name: 'Semester 1 practical', weight: 10 },
  { id: 'final', name: 'Final capstone & practical', weight: 20 },
];
export function gradebook(d: StudentData) {
  const rows = categories.map((cat) => {
    const relevant = cat.id === 'midterm' ? [weeks[11]] : cat.id === 'final' ? [weeks[23]] : weeks;
    const items = relevant.map((w) => {
      const id =
        cat.id === 'quiz'
          ? quizKey(w.number)
          : `${w.number}-${cat.id === 'midterm' || cat.id === 'final' ? 'practical' : cat.id}`;
      const attempts = d.attempts
        .filter((a) => a.quiz === id)
        .map(attemptScore)
        .filter((s): s is number => s !== null);
      const score =
        cat.id === 'quiz' ? (attempts.length ? Math.max(...attempts) : null) : (d.grades[id] ?? null);
      return { id, week: w.number, title: w.title, score };
    });
    const graded = items.filter((i) => i.score !== null);
    const sum = graded.reduce((n, i) => n + i.score!, 0);
    return {
      ...cat,
      items,
      graded: graded.length,
      missing: items.length - graded.length,
      average: graded.length ? sum / graded.length : null,
      earned: (sum / items.length / 100) * cat.weight,
      gradedWeight: (graded.length / items.length) * cat.weight,
    };
  });
  const earned = rows.reduce((n, r) => n + r.earned, 0);
  const gradedWeight = rows.reduce((n, r) => n + r.gradedWeight, 0);
  return {
    rows,
    earned,
    gradedAverage: gradedWeight ? (earned / gradedWeight) * 100 : null,
    gradedWeight,
    missing: rows.reduce((n, r) => n + r.missing, 0),
    total: rows.reduce((n, r) => n + r.items.length, 0),
  };
}
