import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShowBooks from './pages/ShowBooks';
import ShowAuthors from './pages/ShowAuthors';
import ShowGenres from './pages/ShowGenres';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShowBooks></ShowBooks>}></Route>
        <Route path="/authors" element={<ShowAuthors></ShowAuthors>}></Route>
        <Route path="/genres" element={<ShowGenres></ShowGenres>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
