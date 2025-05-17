export function findBestMatch(userPreferences, candidates) {
    const { ageRange, interests } = userPreferences;
  
    const inAgeRange = (age) => {
      switch (ageRange) {
        case "18-25": return age >= 18 && age <= 25;
        case "26-35": return age >= 26 && age <= 35;
        case "35-50": return age >= 35 && age <= 50;
        case "50+": return age > 50;
        case "any": return true;
        default: return true;
      }
    };
  
    let bestMatch = null;
    let highestScore = -1;
  
    for (const friend of candidates) {
      if (friend.id === 'user' || friend.isFriend) continue; // exclude self & current friends
      if (!inAgeRange(friend.age)) continue;
  
      const sharedInterests = friend.interests.filter((i) => interests.includes(i));
      const score = sharedInterests.length;
  
      if (score > highestScore) {
        bestMatch = { ...friend, sharedInterests };
        highestScore = score;
      }
    }
  
    return bestMatch;
  }
  