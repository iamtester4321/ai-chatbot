import Header from "./components/header"
import Input from "./components/input"
import ReactDOM from "react-dom/client";
import LogIn from "./log-in/logIn";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

  return (
    <>

<BrowserRouter>
      <Routes>
        <Route path="/" element={<Input />} />
        <Route path="/login" element={< LogIn/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
