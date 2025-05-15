import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from 'sonner';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Layout from "./components/Layout/Layout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { applyStoredTheme } from "./store/features/themeSlice";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";

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
          
          {/* Protected Routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/"/>
                  <Route path="/chat"/>
                  <Route path="/chat/:chatId"/>
                </Route>
              </Routes>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </>
  );
}

export default App;