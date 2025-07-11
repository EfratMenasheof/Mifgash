function calculateAge(birthDateStr) {
  if (!birthDateStr) return null;
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function findBestMatch(currentUser, userPreferences, candidates) {
  const { ageRange, interests } = userPreferences;
  const [minAge, maxAge] = ageRange;

  const userLearning = currentUser.learningGoal?.toLowerCase();
  const userInterests = Array.isArray(currentUser.interests)
    ? currentUser.interests.map(i => i.toLowerCase())
    : [];

  if (!userLearning) return [];

  const myNativeLang = userLearning === "english" ? "hebrew" : "english";

  // שלב 1: מסננים רק לפי שפה הפוכה
  const langFiltered = candidates.filter(
    c => c.learningGoal?.toLowerCase() === myNativeLang
  );

  if (langFiltered.length === 0) return [];

  // שלב 2: ניקוד ודירוג התאמות
  const scoredMatches = langFiltered.map(candidate => {
    const candidateAge = calculateAge(candidate.birthDate);
    const isInAgeRange = candidateAge && candidateAge >= minAge && candidateAge <= maxAge;

    const candidateInterests = Array.isArray(candidate.interests)
      ? candidate.interests.map(i => i.toLowerCase())
      : [];

    const shared = candidateInterests.filter(i => userInterests.includes(i));
    const sharedCount = shared.length;

    // דירוג לפי התאמה:
    // 1 = מושלמת (שפה + גיל + תחומי עניין)
    // 2 = שפה + גיל
    // 3 = רק שפה
    let tier = 3;
    if (isInAgeRange && sharedCount > 0) tier = 1;
    else if (isInAgeRange) tier = 2;

    return {
      ...candidate,
      sharedInterests: shared,
      score: sharedCount,
      tier
    };
  });

  // שלב 3: ממיינים לפי tier ואז כמות תחומי עניין משותפים
  scoredMatches.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return b.score - a.score;
  });

  return scoredMatches;
}
