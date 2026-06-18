import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import CoreLang from './vers/corelang';
import './App.css'


function App() {

  return (
    <>
     <CoreLang />

    </>
  )
}

export default App


/***
 * 
 *  <BrowserRouter>
      <nav>
        <Link to="/corel">Story</Link> |{" "}
        <Link to="/glue">Glue Words</Link>
      </nav>

      <Routes>
        <Route path="/corel" element={<App2 />} />
        <Route path="/glue" element={<App1 />} />
      </Routes>
    </BrowserRouter>
 * 
 * 
 *  * 
 * 
 */