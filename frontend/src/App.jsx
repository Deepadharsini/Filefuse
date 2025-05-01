import UploadForm from "./components/UploadForm";
import DownloadPage from "./components/DownloadPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadForm />} />
        <Route path="/download/:id" element={<DownloadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
