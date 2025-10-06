/* TODO: This would be a great place to define and `export` a function
 * (or multiple functions) that allows the rest of the code to easily
 * interact with the REST API.
 */

export async function api(url, method="GET", data="") {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : undefined
    };
    const response = await fetch(url, options);
    const responseData = await response.json();
    return responseData;
}

export function sortByName(items) {
    return items.sort((a,b) => a.name.localeCompare(b.name));
}

export const priorities = {
    high: 'High priority',
    medium: 'Medium priority',
    low: 'Low priority'
};
