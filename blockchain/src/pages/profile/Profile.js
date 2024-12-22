import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar.js";
import styles from "./Profile.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [editFolderId, setEditFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState("");

  const userAddress = sessionStorage.getItem("auth");
  const navigate = useNavigate();
  // Fetch folders
  useEffect(() => {
    fetch(`http://localhost:8082/api/folders?userAddress=${userAddress}`)
      .then((res) => res.json())
      .then((data) => setFolders(data))
      .catch((err) => console.error("Error fetching folders:", err));
  }, []);

  // Add folder
  const addFolder = () => {
    if (!newFolderName.trim()) return;

    fetch("http://localhost:8082/api/folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAdress: userAddress,
        name: newFolderName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFolders((prev) => [...prev, data]);
        setNewFolderName("");
      })
      .catch((err) => console.error("Error adding folder:", err));
  };

  // Update folder
  const updateFolder = (id) => {
    if (!editFolderName.trim()) return;

    fetch(`http://localhost:8082/api/folders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: editFolderName,
      }),
    })
      .then(() => {
        setFolders((prev) =>
          prev.map((folder) =>
            folder.id === id ? { ...folder, name: editFolderName } : folder
          )
        );
        setEditFolderId(null);
        setEditFolderName("");
      })
      .catch((err) => console.error("Error updating folder:", err));
  };

  // Delete folder
  const deleteFolder = (id) => {
    fetch(`http://localhost:8082/api/folders/${id}`, {
      method: "DELETE",
    })
      .then(() => setFolders((prev) => prev.filter((folder) => folder.id !== id)))
      .catch((err) => console.error("Error deleting folder:", err));
  };

  return (
    <>
      <Navbar />
      <section className="section-first-profile">
        <h1>My Folders</h1>
        <ul>
          {folders.map((folder) => (
            <li key={folder.id}>
              {editFolderId === folder.id ? (
                <>
                  <input
                    type="text"
                    value={editFolderName}
                    onChange={(e) => setEditFolderName(e.target.value)}
                  />
                  <button onClick={() => updateFolder(folder.id)}>Save</button>
                  <button onClick={() => setEditFolderId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span>{folder.name}</span>
                  <button onClick={() => navigate(`/folder/${folder.id}`)}>View</button>
                  <button onClick={() => setEditFolderId(folder.id)}>Edit</button>
                  <button onClick={() => deleteFolder(folder.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>

        <div>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="New folder name"
          />
          <button onClick={addFolder}>Add Folder</button>
        </div>
      </section>
    </>
  );
}
