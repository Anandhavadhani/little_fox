const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(url) {
  const response = await fetch(`${API_BASE_URL}${url}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

export const getBooks = () => request('/books');
export const getBookById = (id) => request(`/books/${id}`);
export const getRelatedBooks = (id) => request(`/books/${id}/related`);
export const getSettings = () => request('/settings');
