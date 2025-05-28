import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { applyStoredTheme } from "./store/features/theme/themeSlice";
import ErrorBoundary from "./components/Common/ErrorBoundary";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(applyStoredTheme());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Navigate to={"/chat"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/share/:shareId" element={<Layout />} />
          <Route element={<Layout />}>
            <Route path="/chat" element={<div />} />
            <Route path="/chat/:chatId" element={<div />} />
            <Route path="/share/:shareId" element={<div />} />
          </Route>
        </Routes>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
