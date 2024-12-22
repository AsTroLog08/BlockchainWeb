import styles from "./UploadImg.css";
import Navbar from "../../components/Navbar.js";
import { useState, useEffect } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";

// ABI для смарт-контракту
const contractABI = [
  "function createMetadata(string memory _imageURL, string memory _author) public",
  "event MetadataCreated(uint256 id, string ImageURL, string Author, uint256 Timestamp)"
];

const contractAddress = "0xcD6a42782d230D7c13A74ddec5dD140e55499Df9";

export default function UploadImg() {
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState("Image");
  const [folders, setFolders] = useState([]);
  const [folderId, setFolderId] = useState("");
  const [message, setMessage] = useState("");
  const [newfileId, setNewfileId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch(
          "http://localhost:8082/api/folders?userAddress=0x9eb4878F60eA745AEB7ECfDad46DDd01B07bD3CE"
        );
        if (response.ok) {
          const data = await response.json();
          setFolders(data);
          if (data.length > 0) {
            setFolderId(data[0].id);
          }
        } else {
          setMessage("Failed to fetch folders.");
        }
      } catch (error) {
        console.error("Error fetching folders:", error);
        setMessage("Error fetching folders.");
      }
    };

    fetchFolders();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleMediaTypeChange = (event) => {
    setMediaType(event.target.value);
  };

  const handleFolderChange = (event) => {
    setFolderId(event.target.value);
  };

  const createMetadataOnBlockchain = async (fileUrl) => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed!");
      }

      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      
      const contract = new Contract(contractAddress, contractABI, signer);
      const authAddress = sessionStorage.getItem("auth");
      
      if (!authAddress) {
        throw new Error("No auth address found in session storage!");
      }

      setMessage("Creating metadata on blockchain...");
      const tx = await contract.createMetadata(fileUrl, authAddress);
      await tx.wait();
      
      setMessage("Metadata successfully created on blockchain!");
      return true;
    } catch (error) {
      console.error("Error creating metadata:", error);
      setMessage(`Error creating metadata: ${error.message}`);
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!file) {
        setMessage("Please select a file before uploading.");
        return;
      }

      if (!folderId) {
        setMessage("Please select a folder.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      // Завантаження файлу
      const response = await fetch(
        `http://localhost:8082/api/files/upload?mediaType=${mediaType}&folderId=${folderId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        setNewfileId(result.id);
        
        // Створення метаданих у блокчейні
        const fileUrl = result.s3Url;
        console.log(fileUrl);
        const metadataCreated = await createMetadataOnBlockchain(fileUrl);
        
        if (metadataCreated) {
          setMessage("File uploaded and metadata created successfully!");
        }
      } else {
        const errorText = await response.text();
        setMessage(`Failed to upload file: ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="section-first">
        <div className="upload-container">
          <h2>Upload Your File</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fileInput">Select a file:</label>
              <input
                type="file"
                id="fileInput"
                accept="image/*,video/*,application/*"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="mediaType">Media Type:</label>
              <select 
                id="mediaType" 
                value={mediaType} 
                onChange={handleMediaTypeChange}
                disabled={isLoading}
              >
                <option value="Image">Image</option>
                <option value="Video">Video</option>
                <option value="Audio">Audio</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="folderId">Select Folder:</label>
              <select 
                id="folderId" 
                value={folderId} 
                onChange={handleFolderChange}
                disabled={isLoading}
              >
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
            <button 
              type="submit" 
              className="upload-button"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Upload"}
            </button>
          </form>
          {message && <p className="upload-message">{message}</p>}
          {newfileId && (
            <a href={`/img/${newfileId}`} className="redirect-to-file">
              See File
            </a>
          )}
        </div>
      </section>
    </>
  );
}