
import "./styles/styles.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home.js";
import SearchImg from "./pages/searchImg/SearchImg.js";
import UploadImg from "./pages/uploadImg/UploadImg.js";
import Profile from "./pages/profile/Profile.js";
import Folder from "./pages/folder/Folder.js"; // припустимо, що у вас є сторінка для відображення folder

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchImg />} />
        <Route path="/upload" element={<UploadImg />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/folder/:folderId" element={<Folder />} /> {/* Сторінка для відображення folder */}
      </Routes>
    </Router>
  );
}

export default App;

