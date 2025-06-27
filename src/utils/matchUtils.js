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
  const userInterests = Array.isArray(currentUser.interests) ? currentUser.interests : [];

  if (!userLearning) return null;

  let bestMatch = null;
  let bestScore = -1;

  for (const candidate of candidates) {
    if (candidate.id === currentUser.id) continue;

    const candidateLearning = candidate.learningGoal?.toLowerCase();
    if (!candidateLearning || candidateLearning === userLearning) continue;

    const candidateAge = calculateAge(candidate.birthDate);
    if (!candidateAge || candidateAge < minAge || candidateAge > maxAge) continue;

    const candidateInterests = Array.isArray(candidate.interests) ? candidate.interests : [];
    const shared = candidateInterests.filter((i) => userInterests.includes(i));
    const score = shared.length;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = { ...candidate, sharedInterests: shared };
    }
  }

  return bestMatch;
}
