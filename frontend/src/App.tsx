import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { applyStoredTheme } from "./store/features/theme/themeSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(applyStoredTheme());
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Navigate to={"/chat"} />} /> */}
          <Route path="/*" element={<Navigate to={"/chat"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/share/:shareId" element={<Layout />} />
          <Route element={<Layout />}>
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
