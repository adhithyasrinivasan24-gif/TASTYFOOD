import apiClient from './apiClient.js';

function toFood(recipe) {
  return {
    id: recipe.id,
    name: recipe.name || '',
    description: recipe.description || `${recipe.cuisine || 'Popular'} recipe`,
    price: Number(recipe.price ?? Math.max(79, Math.round((recipe.caloriesPerServing || 350) * 0.42))),
    image: recipe.image || '',
    category: recipe.mealType?.[0] || recipe.cuisine || 'Other',
    cuisine: recipe.cuisine || 'Mixed',
    rating: Number(recipe.rating || 4.2),
  };
}
function explain(error) {
  if (error.response?.status === 401) return 'Your session may have expired. Please sign in again.';
  if (error.response?.status === 403) return 'You do not have permission to perform this operation.';
  if (!error.response) return 'Network error. Check your internet connection and try again.';
  return `Request failed (${error.response.status}). Please try again.`;
}
export async function getFoods() {
  try { const { data } = await apiClient.get('/recipes?limit=30'); if (!Array.isArray(data.recipes)) throw new Error('The API response did not contain a food list.'); return data.recipes.map(toFood); }
  catch (error) { if (error.message === 'The API response did not contain a food list.') throw error; throw new Error(explain(error)); }
}
export async function createFood(food) {
  try { const { data } = await apiClient.post('/recipes/add', { name: food.name, description: food.description, price: Number(food.price), image: food.image }); return toFood({ ...data, ...food, id: data.id ?? Date.now() }); }
  catch (error) { throw new Error(explain(error)); }
}
export async function updateFood(id, food) {
  try { const { data } = await apiClient.put(`/recipes/${encodeURIComponent(id)}`, { name: food.name, description: food.description, price: Number(food.price), image: food.image }); return toFood({ ...data, ...food, id: Number(id) }); }
  catch (error) { throw new Error(explain(error)); }
}
export async function deleteFood(id) {
  try { const { data } = await apiClient.delete(`/recipes/${encodeURIComponent(id)}`); return data; }
  catch (error) { throw new Error(explain(error)); }
}
