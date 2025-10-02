import { ItemDTO, ItemFormOutput, ItemsResponse } from "@app/shared";
import { http } from "./http";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3001";
const ITEMS_URL = `${API_BASE_URL}/api/v1/items`;

export const ItemsClient = {
  create: (input: ItemFormOutput) => httpPost<ItemDTO>(ITEMS_URL, input),
  listAll: () => httpGet<ItemsResponse>(ITEMS_URL),
  update: (id: string, input: ItemFormOutput) =>
    httpPatch<ItemDTO>(`${ITEMS_URL}/${encodeURIComponent(id)}`, input),
  remove: (id: string) => httpDelete<void>(`${ITEMS_URL}/${encodeURIComponent(id)}`),
  deleteAll: () => httpDelete<void>(`${ITEMS_URL}`),
};

// http wrappers
async function httpGet<T>(url: string) {
  return http<T>(url);
}
async function httpPost<T>(url: string, body: unknown) {
  return http<T>(url, { method: "POST", body });
}
async function httpPatch<T>(url: string, body: unknown) {
  return http<T>(url, { method: "PATCH", body });
}
async function httpDelete<T>(url: string) {
  return http<T>(url, { method: "DELETE" });
}
