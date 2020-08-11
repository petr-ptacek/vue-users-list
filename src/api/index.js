import users from '../assets/data/users';
const BASE_URL = process.env.VUE_APP_USERS_URL;

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

export const fakeFetch = async (page, delay = 1500) => {
  const usersCount = users.results.length;
  const usersPerPage = 20;
  const pagesCount = Math.ceil(usersCount / usersPerPage);
  const currentPage = page;
  const results = users.results.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);
  const resultsCount = results.length;

  return new Promise(resolve => {
    window.setTimeout(
      () => resolve(
        {
          meta: {
            usersCount,
            pagesCount,
            resultsCount,
            usersPerPage,
            currentPage
          },
          results
        }
      )
      , delay
    );
  });
};
