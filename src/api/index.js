const ACCESS_TOKEN = 'h5Y31PSuUrqFBqgZri8MfY0qhfSe6uu9wRoK';
const url = new window.URL(`https://gorest.co.in/public-api/users?_format=json&access-token=${ ACCESS_TOKEN }`);

/**
 * @param {number} page
 * @returns {Promise<any>}
 */
export const fetchUsers = async (page) => {

  typeof page === 'number' ?
      url.searchParams.set('page', page.toString()) :
      url.searchParams.delete('page');

  const response = await window.fetch(url, { headers: { 'Content-Type': 'application/json; charset=UTF-8' } });
  return await response.json();
};