import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function DownloadPage() {
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [downloadURL, setDownloadURL] = useState(null);
  const [filename, setFilename] = useState(null);

  const fetchFile = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/download/${id}`, {
        params: { password },
      });
      setDownloadURL(res.data.downloadURL);
      setFilename(res.data.filename);
    } catch (err) {
      alert("Error: " + err.response.data);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-semibold text-center">SafeVault - Download File</h2>
      <input
        type="text"
        placeholder="Password (if required)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button onClick={fetchFile} className="w-full bg-green-600 text-white py-2 rounded">
        Get File
      </button>

      {downloadURL && (
        <div className="text-center mt-4">
          <a href={downloadURL} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
            Click to download "{filename}"
          </a>
        </div>
      )}
    </div>
  );
}
