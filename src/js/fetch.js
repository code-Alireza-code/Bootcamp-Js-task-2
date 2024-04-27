async function fetchData(query = "") {
  try {
    const res = await axios.get(`${BASE_URL}?${query}`);
    return await res.data;
  } catch (error) {
    return error.message;
  }
}
