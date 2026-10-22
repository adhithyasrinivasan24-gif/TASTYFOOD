import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CartPage from '../pages/CartPage.jsx';

const mockRemove = jest.fn();
const mockUpdate = jest.fn();
let mockCartState;
jest.mock('../store/cartStore.js', () => ({ useCart: () => mockCartState }));

const emptyCart = () => ({ items: [], removeFromCart: mockRemove, updateQuantity: mockUpdate, subtotal: 0, tax: 0, deliveryFee: 0, total: 0 });
const filledCart = () => ({ ...emptyCart(), items: [{ id: 1, name: 'Noodle Bowl', image: 'noodles.jpg', price: 100, quantity: 2 }], subtotal: 200, tax: 10, deliveryFee: 35, total: 245 });

describe('CartPage', () => {
  beforeEach(() => { mockRemove.mockClear(); mockUpdate.mockClear(); });
  test('shows the empty cart message', () => {
    mockCartState = emptyCart();
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse menu' })).toBeInTheDocument();
  });
  test('renders cart item and derived totals', () => {
    mockCartState = filledCart();
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    expect(screen.getByText('Noodle Bowl')).toBeInTheDocument();
    expect(screen.getByText('₹200.00')).toBeInTheDocument();
    expect(screen.getByText('₹245.00')).toBeInTheDocument();
  });
  test('supports quantity update and remove actions', async () => {
    const user = userEvent.setup(); mockCartState = filledCart();
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    expect(mockUpdate).toHaveBeenCalledWith(1, 3);
    await user.click(screen.getByRole('button', { name: 'Remove Noodle Bowl' }));
    expect(mockRemove).toHaveBeenCalledWith(1);
  });
});
