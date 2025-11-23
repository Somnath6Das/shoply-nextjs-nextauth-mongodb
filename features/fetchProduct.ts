import axios from "axios";

export async function fetchProducts(page = 1, pageSize = 10) {
  const res = await axios.get(
    `/api/products/list?page=${page}&pageSize=${pageSize}`
  );
  return res.data;
}
