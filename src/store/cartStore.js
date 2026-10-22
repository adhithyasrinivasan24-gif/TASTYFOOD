import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Middleware logs cart actions for learning/debugging.
const logCartActions = (config) => (set, get, api) => config(
  (partial, replace, actionName = 'cart/update') => {
    console.info(`[Cart middleware] ${actionName}`);
    set(partial, replace);
  }, get, api
);

export const calculateCartSummary = (items = []) => {
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.05;
  const deliveryFee = subtotal === 0 || subtotal >= 500 ? 0 : 35;
  return { subtotal, tax, deliveryFee, total: subtotal + tax + deliveryFee,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0) };
};

export const useCartStore = create(persist(logCartActions((set, get) => ({
  items: [],
  isCartLoading: false,
  addToCart: (food) => set((state) => {
    const found = state.items.find((item) => item.id === food.id);
    const items = found
      ? state.items.map((item) => item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...state.items, { ...food, quantity: 1 }];
    return { items };
  }, false, 'addToCart'),
  removeFromCart: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) }), false, 'removeFromCart'),
  updateQuantity: (id, quantity) => set((state) => ({
    items: quantity < 1 ? state.items.filter((item) => item.id !== id)
      : state.items.map((item) => item.id === id ? { ...item, quantity } : item)
  }), false, 'updateQuantity'),
  clearCart: () => set({ items: [] }, false, 'clearCart'),
  setCartLoading: (isCartLoading) => set({ isCartLoading }, false, 'setCartLoading')
})), {
  name: 'freshbite-cart',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ items: state.items })
}));

// Compatibility hook keeps the existing UI simple while the store is global.
export function useCart() {
  const state = useCartStore();
  return { ...state, ...calculateCartSummary(state.items) };
}
