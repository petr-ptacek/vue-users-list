const BASE_URL = 'http://localhost:3000/api/users';

/**
 * @param {number} page
 * @returns {Promise<any>}
 */
export const fetchUsers = async (page) => {
  const url = new window.URL(BASE_URL);

  typeof page === 'number' ?
    url.searchParams.set('page', page.toString()) :
    url.searchParams.delete('page');

  const response = await window.fetch(
    url.toString(),
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    }
  );

  return await response.json();
};