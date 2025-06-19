import { Toaster } from "./components/ui/toaster";
import UserManagementPage from "./pages/users/UserManagementPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <UserManagementPage />,
    },
  ]);
  return (
    <>
      <Toaster /> <RouterProvider router={router} />
    </>
  );
}

export default App;
