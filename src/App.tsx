import "./App.css";
import logo from "./assets/logo_musiquiz.png";

function App() {
  return (
    <div className="bg-container">
      <img src={logo} alt="logo" className="logo"/>
      <h1 className="title">Parties suivantes</h1>
    </div>
  );
}

export default App;