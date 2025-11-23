// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "stream-chat-react/dist/css/v2/index.css";
// import "./index.css";
// import App from "./App.jsx";

// import { BrowserRouter } from "react-router-dom";

// import {
//   // useQuery,
//   // useMutation,
//   // useQueryClient,
//   QueryClient,
//   QueryClientProvider,
// } from "@tanstack/react-query";

// //Create a client
// const queryClient = new QueryClient();

// createRoot(document.getElementById("root")).render(
//     // using this we can use any component that is coming from react-router in our application
//   <StrictMode>
//     <BrowserRouter>
//       <QueryClientProvider client={queryClient}>
//         <App />
//       </QueryClientProvider>
//     </BrowserRouter>
//   </StrictMode>
// );




import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "stream-chat-react/dist/css/v2/index.css";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Provider } from "react-redux";   // ✅ Import Provider
import { store } from "./redux/store";    // ✅ Import store

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>   {/* ✅ Wrap App with Provider */}
          <App />
        </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);

