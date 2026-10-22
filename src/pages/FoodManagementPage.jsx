import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { createFood, deleteFood, getFoods, updateFood } from '../services/foodCrudApi.js';
import Loading from '../components/Loading.jsx';

const blank = { name: '', description: '', price: '', image: '' };
export default function FoodManagementPage() {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadFoods = useCallback(async () => {
    setLoading(true); setError('');
    try { setFoods(await getFoods()); }
    catch (err) { setError(err.message || 'Could not load foods.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { loadFoods(); }, [loadFoods]);

  function edit(food) {
    setEditingId(food.id);
    setForm({ name: food.name, description: food.description, price: String(food.price), image: food.image || '' });
    setError(''); setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function resetForm() { setEditingId(null); setForm(blank); }
  function change(event) { setForm(current => ({ ...current, [event.target.name]: event.target.value })); }

  async function submit(event) {
    event.preventDefault(); setSaving(true); setError(''); setMessage('');
    try {
      const payload = { ...form, name: form.name.trim(), description: form.description.trim(), price: Number(form.price) };
      if (!payload.name || !payload.description || !Number.isFinite(payload.price) || payload.price <= 0) throw new Error('Enter a name, description, and price greater than zero.');
      if (editingId !== null) {
        const updated = await updateFood(editingId, payload);
        setFoods(current => current.map(food => food.id === editingId ? updated : food));
        setMessage('Food updated successfully (API demo response).');
      } else {
        const created = await createFood(payload);
        setFoods(current => [created, ...current]);
        setMessage('Food added successfully (API demo response).');
      }
      resetForm();
    } catch (err) { setError(err.message || 'The operation failed. Please try again.'); }
    finally { setSaving(false); }
  }

  async function remove(food) {
    if (!window.confirm(`Delete “${food.name}”?`)) return;
    setDeletingId(food.id); setError(''); setMessage('');
    try {
      await deleteFood(food.id);
      setFoods(current => current.filter(item => item.id !== food.id));
      setMessage('Food deleted successfully (API demo response).');
      if (editingId === food.id) resetForm();
    } catch (err) { setError(err.message || 'Could not delete this food.'); }
    finally { setDeletingId(null); }
  }

  return <main className="page-wrap management-page">
    <div className="page-heading"><div><span className="eyebrow">EXPERIMENT 3 · REST API</span><h1>Manage food products</h1><p>Practice GET, POST, PUT, and DELETE with asynchronous API requests.</p></div><button className="secondary-button" onClick={loadFoods} disabled={loading}><RefreshCw size={16}/> Refresh</button></div>
    <div className="api-note"><b>Demo API note:</b> DummyJSON simulates create, update, and delete responses. Changes are shown in this page's state and are not permanently saved on the server. Refreshing reloads the original API data.</div>
    {error && <div className="api-alert error-alert" role="alert">{error}</div>}
    {message && <div className="api-alert success-alert" role="status">{message}</div>}
    <section className="manage-form-card"><h2>{editingId !== null ? 'Update food' : 'Add a new food'}</h2><form onSubmit={submit} className="manage-form">
      <label>Food name<input name="name" value={form.name} onChange={change} required maxLength={100} placeholder="e.g. Garden veggie bowl" /></label>
      <label>Description<input name="description" value={form.description} onChange={change} required maxLength={240} placeholder="Short description" /></label>
      <label>Price (₹)<input name="price" type="number" min="1" step="1" value={form.price} onChange={change} required placeholder="199" /></label>
      <label>Image URL (optional)<input name="image" type="url" value={form.image} onChange={change} placeholder="https://example.com/food.jpg" /></label>
      <div className="form-actions"><button className="primary-button" type="submit" disabled={saving}>{saving ? <Loading/> : editingId !== null ? <Save size={16}/> : <Plus size={16}/>} {saving ? 'Saving…' : editingId !== null ? 'Save changes' : 'Add food'}</button>{editingId !== null && <button className="secondary-button" type="button" onClick={resetForm} disabled={saving}><X size={16}/> Cancel edit</button>}</div>
    </form></section>
    <section className="manage-list-section"><div className="section-title-row"><h2>Food products</h2><span>{foods.length} items</span></div>
      {loading ? <div className="api-state"><Loading/><p>Loading food products from the API…</p></div> : foods.length === 0 ? <div className="empty-state"><h3>No food products available</h3><p>Try refreshing the list.</p><button className="secondary-button" onClick={loadFoods}>Try again</button></div> : <div className="manage-food-list">{foods.map(food => <article className="manage-food-row" key={food.id}><div className="manage-food-image">{food.image ? <img src={food.image} alt="" loading="lazy"/> : <span>🍽️</span>}</div><div className="manage-food-info"><h3>{food.name}</h3><p>{food.description}</p><strong>₹{Number(food.price).toFixed(2)}</strong><small>ID: {food.id}</small></div><div className="manage-food-actions"><button className="secondary-button" onClick={() => edit(food)} aria-label={`Edit ${food.name}`}><Pencil size={15}/> Edit</button><button className="danger-button" onClick={() => remove(food)} disabled={deletingId === food.id}>{deletingId === food.id ? 'Deleting…' : <><Trash2 size={15}/> Delete</>}</button></div></article>)}</div>}
    </section>
  </main>;
}
