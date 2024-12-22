import styles from "./SearchImg.css";
import Navbar from "../../components/Navbar.js";
import { useState } from "react";

export default function SearchImg() {
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!searchTerm.trim()) {
      setFiles([])
      setMessage("Please enter a search term.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:8082/api/files/search?searchTerm=${encodeURIComponent(
          searchTerm
        )}&pageNumber=1&pageSize=10`
      );

      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
        if (data.files.length === 0) {
          setMessage("No files found.");
        }
      } else {
        const errorText = await response.text();
        setMessage(`Failed to search files: ${errorText}`);
      }
    } catch (error) {
      console.error("Error searching files:", error);
      setMessage("Error searching files.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="section-first">
        <div className="search-container">
          <h2>Search Files</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Enter file name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>

          {loading && <p>Loading...</p>}

          {message && <p className="message-searh">{message}</p>}

          <div className="files-container">
            {files.map((file) => (
              <div key={file.id} className="file-item">
                <img
                  src={file.s3Url}
                  alt={file.name}
                  className="file-preview"
                />
                <p>{file.name}</p>
                <a
                  href={file.s3Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="open-link"
                >
                  Open
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
