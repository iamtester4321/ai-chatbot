import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from 'sonner';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Layout from "./components/Layout/Layout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { applyStoredTheme } from "./store/features/themeSlice"; // Update the path if different

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(applyStoredTheme());
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" />
            <Route path="/chat" />
            <Route path="/chat/:chatId" />
            <Route path="/share/:shareId" />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>

      <Toaster position="bottom-right" />
    </>
  );
}

export default App;