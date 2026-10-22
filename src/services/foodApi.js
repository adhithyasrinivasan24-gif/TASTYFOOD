const BASE_URL = 'https://dummyjson.com/recipes';

function normalizeRecipe(recipe) {
  const category = recipe.mealType?.[0] || recipe.cuisine || 'Other';
  return {
    id: recipe.id,
    name: recipe.name,
    description: `${recipe.cuisine || 'Popular'} recipe · ${recipe.prepTimeMinutes ?? 0} min prep · ${recipe.difficulty || 'Easy'}`,
    price: Math.max(79, Math.round((recipe.caloriesPerServing || 350) * 0.42)),
    rating: Number(recipe.rating || 4.2),
    category,
    image: recipe.image,
    cuisine: recipe.cuisine || 'Mixed',
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || [],
    prepTimeMinutes: recipe.prepTimeMinutes || 0,
    cookTimeMinutes: recipe.cookTimeMinutes || 0,
    servings: recipe.servings || 1,
    caloriesPerServing: recipe.caloriesPerServing || 0,
  };
}

async function requestJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Food service returned ${response.status}. Please try again.`);
  return response.json();
}

export async function fetchFoodMenu() {
  const data = await requestJson(`${BASE_URL}?limit=30&sortBy=rating&order=desc`);
  if (!Array.isArray(data.recipes)) throw new Error('The food service returned an unexpected response.');
  return data.recipes.map(normalizeRecipe);
}

export async function fetchFoodById(id) {
  if (!/^\d+$/.test(String(id))) throw new Error('Invalid food ID.');
  const recipe = await requestJson(`${BASE_URL}/${encodeURIComponent(id)}`);
  return normalizeRecipe(recipe);
}
