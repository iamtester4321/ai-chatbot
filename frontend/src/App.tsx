import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Layout from "./components/Layout/Layout";
import { applyStoredTheme } from "./store/features/themeSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(applyStoredTheme());
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/share/:shareId" element={<Layout />} />
          <Route element={<Layout />}>
            <Route path="/" />
            <Route path="/chat" />
            <Route path="/chat/:chatId" />
            <Route path="/share/:shareId" />
          </Route>
        </Routes>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </>
  );
}

export default App;
