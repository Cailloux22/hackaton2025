import "./App.css";
import logo from "./assets/logo_musiquiz.png";

function App() {
  return (
    <div className="bg-container">
      <img src={logo} alt="logo" className="logo"/>
      <div>
        <h1 className="title">Partie en cours</h1><br></br>
        <h1 className="title2">Parties suivantes</h1>
      </div>
    </div>
  );
}

export default App;