import styles from "./styles/Navbar.css"
import logo from "../assets/brand/Logo.svg"
import settings from "../assets/images/Settings.svg"
import { useEffect, useState } from "react"

export default function Navbar(){

    const [navbar, setNavbar] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userAddress, setUserAddress] = useState("");
  
    useEffect(() => {
        // Перевірка стану авторизації при завантаженні сторінки
        const authAddress = sessionStorage.getItem("auth");
        if (authAddress) {
        setIsAuthenticated(true);
        setUserAddress(authAddress);
        }
    
        // Слухач зміни акаунтів
        if (typeof window.ethereum !== "undefined") {
             window.ethereum.on("accountsChanged", handleAccountsChanged);
        }
    
        return () => {
        // Видалення слухача при розмонтуванні компонента
        if (typeof window.ethereum !== "undefined") {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
        };
    }, []);

    const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // Користувач від'єднав гаманець
          logout();
        } else {
          // Користувач переключив акаунт
          const newAddress = accounts[0];
          setUserAddress(newAddress);
          sessionStorage.setItem("auth", newAddress);
        }
      };

    const changeBackground = () =>{
        if (window.scrollY >=80){
            setNavbar(true);
        }else{
            setNavbar(false);
        }
    }
    window.addEventListener('scroll', changeBackground);

    async function login() {
        if(typeof window.ethers !=='undefined'){
            const provider = new window.ethers.BrowserProvider(window.ethereum);

            try{
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                sessionStorage.setItem("auth", address);
                setIsAuthenticated(true); 
                console.log(address);
            }catch(error){
                alert("Metamask is not installed. Please install it");
            }
        }else{
            alert("Metamask is not installed. Please install it");
        }
        
    }

    function logout() {
        sessionStorage.removeItem("auth");
        setIsAuthenticated(false);
      }

    return (
    <nav className={navbar ? "nav active" : "nav"}>
      <a href="/" className="nav-title">
        <img className="nav-logo" src={logo} alt="Logo" />
        Cryptic
      </a>
    <div className="nav-ul-right">
        <ul className="nav-ul">
            {isAuthenticated ? (
            <>
                <li className="search-img">
                <a href="/search">Image search</a>
                </li>
                <li className="upload-img">
                <a href="/upload">Upload image</a>
                </li>
            
            </>
            ) : (
            <>
            </>
            )}
        </ul>
    </div>


      <ul className="nav-ul">
        {isAuthenticated ? (
          <>
            <li className="user-info">
                <a href="/profile">
                    Welcome, {sessionStorage.getItem("auth")?.slice(0, 5) + "..." + sessionStorage.getItem("auth")?.slice(-4)}
                </a>
            </li>
            {/* 
            <li className="log-out">
              <button onClick={logout}>Logout</button>
            </li>
            */}
          </>
        ) : (
          <li className="log-in">
            <button onClick={login}>Log with MetaMask</button>
          </li>
        )}
      </ul>
    </nav>
  );
}