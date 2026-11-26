import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import ToastContainer from "./components/ToastContainer";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
