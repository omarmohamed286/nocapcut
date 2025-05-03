import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "@/router/AppRouter.tsx";

createRoot(document.getElementById("root")!).render(<AppRouter></AppRouter>);
