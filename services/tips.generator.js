export function generateYearTips() {
  const categories = ["strength", "nutrition", "recovery", "motivation", "fat loss"];
  const tips = [];

  for (let i = 0; i < 52; i++) {
    const category = categories[i % categories.length];
    tips.push({
      week: i + 1,
      category,
      title: `Week ${i + 1} ${category} tip`,
      content: generateTip(category),
    });
  }

  return tips;
}

function generateTip(category) {
  const tips = {
    strength: [
      "Focus on compound exercises like squats and deadlifts.",
      "Increase weights gradually each week.",
      "Maintain proper form before adding weight.",
    ],
    nutrition: [
      "Eat protein after every workout.",
      "Stay hydrated during training.",
      "Prepare balanced meals with carbs and protein.",
    ],
    recovery: [
      "Sleep at least 7 hours per night.",
      "Stretch after workouts.",
      "Take rest days to avoid injuries.",
    ],
    motivation: [
      "Track your workouts to stay motivated.",
      "Set realistic weekly goals.",
      "Celebrate small progress.",
    ],
    "fat loss": [
      "Combine cardio with strength training.",
      "Reduce sugary drinks.",
      "Focus on calorie balance.",
    ],
  };

  const categoryTips = tips[category];
  const random = Math.floor(Math.random() * categoryTips.length);
  return categoryTips[random];
}