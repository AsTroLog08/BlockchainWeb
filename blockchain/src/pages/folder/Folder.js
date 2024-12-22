import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar.js";
import styles from "./Folder.css";
import { useParams } from "react-router-dom";

export default function Folder() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [editingFileId, setEditingFileId] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const { folderId } = useParams();
  const [mediaType, setMediaType] = useState("image");
  // Отримати файли в папці
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`http://localhost:8082/api/files/folder/${folderId}`);
        if (response.ok) {
          const data = await response.json();
          setFiles(data);
        } else {
          setMessage("Failed to fetch files.");
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        setMessage("Error fetching files.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [folderId]);

  // Видалити файл
  const handleDelete = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:8082/api/files/${fileId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setFiles(files.filter((file) => file.id !== fileId));
        setMessage("File deleted successfully.");
      } else {
        setMessage("Failed to delete file.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setMessage("Error deleting file.");
    }
  };

  // Додати файл
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleMediaTypeChange = (event) => {
    setMediaType(event.target.value);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `http://localhost:8082/api/files/upload?mediaType=${mediaType}&folderId=${folderId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const newFile = await response.json();
        setFiles([...files, newFile]);
        setMessage("File uploaded successfully.");
      } else {
        const errorText = await response.text();
        setMessage(`Failed to upload file: ${errorText}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file.");
    }
  };

  // Почати редагування назви файлу
  const handleEditStart = (fileId, currentName) => {
    setEditingFileId(fileId);
    setNewFileName(currentName);
  };

  // Зберегти оновлену назву файлу
  const handleEditSave = async () => {
    if (!newFileName.trim()) {
      setMessage("File name cannot be empty.");
      return;
    }

    const formData = new FormData();
    formData.append("Id", editingFileId);
    formData.append("FileName", newFileName);

    try {
      const response = await fetch("http://localhost:8082/api/files", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setFiles(
          files.map((file) =>
            file.id === editingFileId ? { ...file, name: newFileName } : file
          )
        );
        setMessage("File name updated successfully.");
      } else {
        setMessage("Failed to update file name.");
      }
    } catch (error) {
      console.error("Error updating file name:", error);
      setMessage("Error updating file name.");
    } finally {
      setEditingFileId(null);
      setNewFileName("");
    }
  };

  return (
    <>
      <Navbar />
      <section className="section-first">
        <h2>Folder Files</h2>
        {loading ? (
          <p>Loading files...</p>
        ) : (
          <div className="files-container">
            {files.length === 0 ? (
              <p>No files in this folder.</p>
            ) : (
              files.map((file) => (
                <div key={file.id} className="file-item">
                  <img src={file.s3Url} alt={file.name} className="file-preview" />
                  {editingFileId === file.id ? (
                    <div>
                      <input
                        type="text"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                      />
                      <button onClick={handleEditSave} className="save-button">
                        Save
                      </button>
                    </div>
                  ) : (
                    <p>{file.name}</p>
                  )}
                  <button onClick={() => handleEditStart(file.id, file.name)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(file.id)} className="delete-button">
                    Delete
                  </button>
                  <a href={file.s3Url} target="_blank" rel="noopener noreferrer">
                    Open
                  </a>
                </div>
              ))
            )}
          </div>
        )}

<form onSubmit={handleUpload} className="upload-form">
          <h3>Add a File</h3>
          <div className="form-group">
            <label htmlFor="mediaType">Select Media Type:</label>
            <select id="mediaType" value={mediaType} onChange={handleMediaTypeChange}>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
          </div>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>

        {message && <p className="message">{message}</p>}
      </section>
    </>
  );
}
