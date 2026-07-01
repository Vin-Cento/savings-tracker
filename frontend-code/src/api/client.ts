// src/api/client.ts
import { client } from "../client/client.gen";

client.setConfig({
  baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
});
