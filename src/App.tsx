import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/Home"
import BoardsPage from "./pages/Boards"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BoardsPage />} />
        <Route path="/board/:id" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
