import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import App2 from './vers/CoreLangStory';
import App1 from './vers/glue-words';
import './App.css'


function App() {

  return (
    <>
    <BrowserRouter>
      <nav>
        <Link to="/corel">Story</Link> |{" "}
        <Link to="/glue">Glue Words</Link>
      </nav>

      <Routes>
        <Route path="/corel" element={<App2 />} />
        <Route path="/glue" element={<App1 />} />
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
