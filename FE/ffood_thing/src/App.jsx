import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import RecipesMainPage from "./pages/RecipesMainPage"
import RecipeDetailPage from "./pages/RecipeDetailPage"
import "./App.css"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/recipes" element={<RecipesMainPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
      </Routes>
    </Router>
  )
}

export default App
