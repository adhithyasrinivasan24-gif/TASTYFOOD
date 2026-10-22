import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FoodMenuPage from '../pages/FoodMenuPage.jsx';

jest.mock('../components/FoodCard.jsx', () => ({
  __esModule: true,
  default: ({ food }) => <article>{food.name}</article>
}));
const makeMenu = () => ({
  filteredFoods: [
    { id: 1, name: 'Paneer Bowl', category: 'Lunch' },
    { id: 2, name: 'Berry Smoothie', category: 'Drinks' }
  ], loading: false, error: '', search: '', category: 'All',
  categories: ['All', 'Lunch', 'Drinks'], retry: jest.fn(),
  setSearch: jest.fn(), setCategory: jest.fn()
});

describe('FoodMenuPage', () => {
  test('renders foods from menu data', () => {
    render(<FoodMenuPage menu={makeMenu()} />);
    expect(screen.getByText('Paneer Bowl')).toBeInTheDocument();
    expect(screen.getByText('Berry Smoothie')).toBeInTheDocument();
  });
  test('calls search setter when searching', async () => {
    const user = userEvent.setup();
    const menu = makeMenu();
    render(<FoodMenuPage menu={menu} />);
    await user.type(screen.getByRole('textbox', { name: 'Search food' }), 'berry');
    expect(menu.setSearch).toHaveBeenCalled();
  });
  test('calls category setter when category changes', async () => {
    const user = userEvent.setup();
    const menu = makeMenu();
    render(<FoodMenuPage menu={menu} />);
    await user.selectOptions(screen.getByRole('combobox'), 'Drinks');
    expect(menu.setCategory).toHaveBeenCalledWith('Drinks');
  });
  test('shows loading and API error states', () => {
    const menu = makeMenu(); menu.loading = true;
    const { rerender } = render(<FoodMenuPage menu={menu} />);
    expect(screen.getByText(/Fetching today's food menu/i)).toBeInTheDocument();
    menu.loading = false; menu.error = 'Network unavailable';
    rerender(<FoodMenuPage menu={menu} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Network unavailable');
  });
});
