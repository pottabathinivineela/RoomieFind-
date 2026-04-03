const WEIGHTS = { budget: 0.30, location: 0.25, lifestyle: 0.25, gender: 0.20 };

function budgetScore(a, b) {
  const lo = Math.max(a.budgetMin, b.budgetMin);
  const hi = Math.min(a.budgetMax, b.budgetMax);
  const union = Math.max(a.budgetMax, b.budgetMax) - Math.min(a.budgetMin, b.budgetMin);
  return union > 0 ? Math.max(0, (hi - lo) / union) : 0;
}

function locationScore(a, b) {
  if (!a.preferredArea || !b.preferredArea) return 0.5;
  return a.preferredArea.toLowerCase() === b.preferredArea.toLowerCase() ? 1 : 0.3;
}

function lifestyleScore(a, b) {
  const smoking = a.smoking === b.smoking ? 1 : 0;
  const sleepMap = { early: 0, flexible: 1, night_owl: 2 };
  const sleepDiff = Math.abs((sleepMap[a.sleepSchedule] || 1) - (sleepMap[b.sleepSchedule] || 1));
  const sleep = sleepDiff === 0 ? 1 : sleepDiff === 1 ? 0.5 : 0;
  const cleanDiff = Math.abs((a.cleanliness || 3) - (b.cleanliness || 3));
  const clean = Math.max(0, 1 - cleanDiff / 4);
  return (smoking + sleep + clean) / 3;
}

function genderScore(a, b) {
  if (a.genderPref === "any" || b.genderPref === "any") return 1;
  if (a.genderPref === b.gender && b.genderPref === a.gender) return 1;
  if (a.genderPref === b.gender || b.genderPref === a.gender) return 0.7;
  return 0;
}

function computeCompatibility(profileA, profileB) {
  if (profileA.userId === profileB.userId) return 0;
  const scores = {
    budget: budgetScore(profileA, profileB),
    location: locationScore(profileA, profileB),
    lifestyle: lifestyleScore(profileA, profileB),
    gender: genderScore(profileA, profileB),
  };
  const total = Object.entries(WEIGHTS).reduce((s, [k, w]) => s + w * scores[k], 0);
  return Math.round(total * 100);
}

module.exports = { computeCompatibility };
