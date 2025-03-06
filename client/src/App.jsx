import React, { useState } from "react";
import MovieCard from "./components/MovieCard";
import SearchIcon from "./assets/search.svg";
import "./App.css";
import API_URL from "./config/constants";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null); // Gère l'affichage d'un seul film

  const getMovies = async (title) => {
    try {
      const response = await fetch(`${API_URL}/movies?title=${title}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
      const data = await response.json();
      setMovies(data.Search || []);
      setMessage(
        data.Search && data.Search.length > 0
          ? ""
          : "Désolé, nous n'avons rien trouvé avec ce nom."
      );
    } catch (error) {
      console.error("Une erreur est survenue:", error);
      setMessage("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
  };

  const handleTerm = (e) => {
    const searchTerm = e.target.value;

    const validate = (term) => {
      const regex = /^[a-zA-Z0-9\s-_]*$/i;

      // Si le terme de recherche contient des caractères spéciaux
      if (!regex.test(term)) {
        setMessage(`Les caractères spéciaux ne sont pas autorisés.`);
        return false;
      }
      // Si le terme de recherche est vide
      if (term.trim() === "") {
        setMessage("Veuillez entrer un nom de film ou une série.");
        return false;
      }
      // Si ok, reset le message
      setMessage("");
      return true;
    };
    // Mettre à jour le terme de recherche
    setSearchTerm(searchTerm);

    // Empêcher l'envoi si la validation échoue
    if (!validate(searchTerm)) return;
  };

  return (
    <div className="app">
      <h1>Movie Finder</h1>

      <div className="search">
        <input
          value={searchTerm}
          onChange={handleTerm}
          placeholder="Entrez un nom de film ou une série"
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => {
            if (searchTerm.trim() === "") {
              // Si le terme de recherche est vide empêche la recherche
              setMessage("Veuillez entrer un nom de film ou une série.");
              return;
            }
            getMovies(searchTerm);
          }}
        />
      </div>
      {message && <p className="message">{message}</p>}

      {/* Si un film est sélectionné, afficher uniquement ce film */}
      {selectedMovieId ? (
        <MovieCard
          movie={movies.find((m) => m.imdbID === selectedMovieId)}
          selectedMovieId={selectedMovieId}
          setSelectedMovieId={setSelectedMovieId}
        />
      ) : (
        // Sinon, afficher la liste des films recherchés par le titre
        <div className="container">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              selectedMovieId={selectedMovieId}
              setSelectedMovieId={setSelectedMovieId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
