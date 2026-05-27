// This query file will give us a reusable way of making any endpoint paginated.

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0; //Mongo, if we pass in zero as the page limits, Mango will return all of the documents in the collection.

function getPagination(query) {
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT; //returns the absolute value for the number
  // So if a number that you pass in is positive, it just returns that value back to you.
  // And if it's negative, it returns the positive version of that number.
  // And the little bonus for this function is that if you pass it a string, it will convert that string
  // into a number as well.

  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
}

module.exports = {
  getPagination,
};
