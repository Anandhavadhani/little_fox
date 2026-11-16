import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

beforeEach(() => {
  global.fetch = vi.fn((url) => {
    if (url.includes('/books')) {
      return Promise.resolve({
        ok: true,
        json: async () => [
          {
            id: 'book-1',
            title: 'Book One',
            author: 'Author One',
            coverImage: '/covers/cover-1.jpg',
            shortDescription: 'Short description one',
            fullDescription: 'Long description one',
            category: 'Fiction',
            affiliateUrl: 'https://example.com/affiliate-1',
          },
          {
            id: 'book-2',
            title: 'Book Two',
            author: 'Author Two',
            coverImage: '',
            shortDescription: 'Short description two',
            fullDescription: 'Long description two',
            category: 'Self Help',
            affiliateUrl: 'https://example.com/affiliate-2',
          },
        ],
      });
    }

    if (url.includes('/settings')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          logoName: 'Little Fox',
          amazonProfileUrl: 'https://www.amazon.com/',
          pinterestProfileUrl: 'https://www.pinterest.com/',
        }),
      });
    }

    return Promise.resolve({ ok: true, json: async () => ({}) });
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('renders the hero, find me on section, and book collection from API data', async () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(await screen.findByText(/my book recommendations/i)).toBeInTheDocument();
  expect(await screen.findByRole('button', { name: /browse books/i })).toBeInTheDocument();
  expect(await screen.findByText(/find me on/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/books'));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/settings'));
  });
});
