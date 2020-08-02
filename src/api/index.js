/**
 * @param {number} page
 * @returns {Promise<any>}
 */
export const fetchUsers = async (page) => {
  const response = await window.fetch(
      `https://gorest.co.in/public-api/users?_format=json&access-token=3N-MlUn9Mk0Dr5APyKlk3iAwJQV3rWO_5m6e&page=${ page }`
  );

  return await response.json();
};