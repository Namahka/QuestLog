function localDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function updateStreak(streak, completedDate = new Date()) {
  const today = localDate(completedDate);
  if (streak.lastCompletionDate === today) return streak;
  if (!streak.lastCompletionDate) {
    streak.current = 1;
  } else {
    const last = new Date(`${streak.lastCompletionDate}T12:00:00`);
    const now = new Date(`${today}T12:00:00`);
    const diff = Math.round((now - last) / 86400000);
    streak.current = diff === 1 ? streak.current + 1 : 1;
  }
  streak.lastCompletionDate = today;
  streak.longest = Math.max(streak.longest, streak.current);
  return streak;
}
