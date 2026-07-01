import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from "react-redux";
import { client } from "./client/client.gen";
import { store } from "./stores/store"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./api/client";

client.setConfig({
  baseUrl: "http://localhost:8000",
});
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
