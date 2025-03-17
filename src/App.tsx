import "./App.css";
import logo from "./assets/logo_musiquiz.png";
import React, { useState, useEffect, useRef } from "react";

function App() {
  const [showVideo, setShowVideo] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // ✅ Fix du type

  // ✅ Déplacer handleVideoEnd hors du useEffect
  const handleVideoEnd = () => {
    setShowVideo(false);

    timerRef.current = setTimeout(() => {
      setShowVideo(true);
    }, 15000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="bg-container">
      {/* Logo en haut à gauche */}
      <img src={logo} alt="logo" className="logo" />

      <div>
        <h1 className="title">Partie en cours</h1>
        <br />
        <h1 className="title2">Parties suivantes</h1>
      </div>

      {/* Vidéo en bas à droite */}
      {showVideo && (
        <video className="video" autoPlay muted onEnded={handleVideoEnd}>
          <source src="/video.m4v" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      )}
    </div>
  );
}

export default App;
