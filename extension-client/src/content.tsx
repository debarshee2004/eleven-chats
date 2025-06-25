import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ContentPage from "./content/ContentPage";
import "./index.css";

const root = document.createElement("div");
root.id = "__chat_app_sidebar_toggle_button";
document.body.appendChild(root);

createRoot(root).render(
  <StrictMode>
    <ContentPage />
  </StrictMode>
);
