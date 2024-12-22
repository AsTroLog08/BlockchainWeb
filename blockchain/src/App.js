import Home from "./pages/home/Home.js";
import "./styles/styles.css";

function App() {
  let component
  switch (window.location.pathname){
    case "/":
      component = <Home />
      break
  }
  return (
    <>
      {component}
    </>
  );
}

export default App;
