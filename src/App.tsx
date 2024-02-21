import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/Home"
import RegistrationPage from "./pages/Registration"
import BoardsPage from "./pages/Boards"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/board" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
