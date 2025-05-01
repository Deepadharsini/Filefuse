import { useState } from "react";
import axios from "axios";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [expiresInMinutes, setExpiresInMinutes] = useState(60); // Default to 1 hour
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fileId, setFileId] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
  
    const expiresIn = expiresInMinutes * 60;  // Convert to seconds
    const formData = new FormData();
    formData.append("file", file);
    formData.append("expiresIn", expiresIn);  // Send as seconds
    formData.append("password", password);
    formData.append("email", email);
  
    try {
      const res = await axios.post("http://localhost:3000/api/upload", formData);
      setFileId(res.data.fileId);
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded space-y-6">
      <h2 className="text-2xl font-semibold text-center text-blue-700">FileFuse - Upload File</h2>

      {/* File Upload UI */}
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded cursor-pointer hover:bg-gray-100 transition duration-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-gray-600 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0l-4 4m4-4l4 4m4 4v8m0 0l4-4m-4 4l-4-4"
          />
        </svg>
        <span className="text-gray-600">Click to select a file</span>
        <input
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>

      {file && <p className="text-sm text-gray-700 text-center">Selected: {file.name}</p>}

      {/* Input Fields */}
      <input
        type="number"
        placeholder="Expiration time (in minutes)"
        value={expiresInMinutes}
        onChange={(e) => setExpiresInMinutes(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Optional password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="email"
        placeholder="Notify me at (optional email)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
      >
        Upload
      </button>

      {/* Download Link */}
      {fileId && (
        <div className="text-center mt-4">
          <p className="font-medium">Your download link:</p>
          <code className="break-all text-blue-700">
            http://localhost:5173/download/{fileId}
          </code>
        </div>
      )}
    </div>
  );
}
