import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import FoodCard from '../components/FoodCard.jsx';
import { useCartStore } from '../store/cartStore.js';

jest.mock('../store/cartStore.js', () => ({
  useCart: () => ({ addToCart: mockAddToCart }),
  useCartStore: jest.fn()
}));
const mockAddToCart = jest.fn();

const food = { id: 7, name: 'Paneer Bowl', category: 'Lunch', description: 'Fresh and tasty', price: 120, rating: 4.5, image: 'paneer.jpg' };

describe('FoodCard', () => {
  beforeEach(() => mockAddToCart.mockClear());
  test('renders food information correctly', () => {
    render(<MemoryRouter><FoodCard food={food} /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Paneer Bowl' })).toBeInTheDocument();
    expect(screen.getByText('Fresh and tasty')).toBeInTheDocument();
    expect(screen.getByText('₹120')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Paneer Bowl' })).toHaveAttribute('src', 'paneer.jpg');
  });
  test('adds food to cart and announces success', async () => {
    const user = userEvent.setup();
    const onAdded = jest.fn();
    render(<MemoryRouter><FoodCard food={food} onAdded={onAdded} /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Add Paneer Bowl to cart' }));
    expect(mockAddToCart).toHaveBeenCalledWith(food);
    expect(onAdded).toHaveBeenCalledWith('Paneer Bowl added to cart');
  });
});
