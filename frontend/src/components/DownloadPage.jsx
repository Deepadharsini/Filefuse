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
      // Corrected URL to include VITE_API_BASE_URL from the environment
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/download/${id}`, {
        params: { password },
      });
      setDownloadURL(res.data.downloadURL);
      setFilename(res.data.filename);

      // Automatically trigger download
      const link = document.createElement("a");
      link.href = res.data.downloadURL;
      link.download = res.data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Error: " + (err.response?.data || "Something went wrong"));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-semibold text-center">Filefuse - Download File</h2>
      <input
        type="text"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button onClick={fetchFile} className="w-full bg-green-600 text-white py-2 rounded">
        Get File
      </button>

      {downloadURL && (
        <div className="text-center mt-4 text-green-700 font-medium">
          If unable to download file, <a href={downloadURL} download={filename} className="underline">click here</a>.
        </div>
      )}
    </div>
  );
}
