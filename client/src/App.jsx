import React, { useState } from "react";
import MovieCard from "./components/MovieCard";
import SearchIcon from "./assets/search.svg";
import "./App.css";
import API_URL from "./config/constants";

/**
 * La fonction App est la fonction principale de l'application.
 * Elle gère l'état de l'application, la recherche de films,
 * l'affichage des films et la sélection d'un film.
 * @function
 * @returns {ReactElement} Le composant App.
 */
const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null); // Gère l'affichage d'un seul film

  /**
   * Récupère les films en fonction du titre.
   * @async
   * @function
   * @param {string} title - Le titre du film.
   * @throws {Error} Si la requête API est en erreur.
   */
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

  /**
   * Gère la mise à jour du terme de recherche et sa validation.
   * Met à jour l'état `searchTerm` avec la valeur de l'input.
   * Valide le terme de recherche pour s'assurer qu'il ne contient
   * pas de caractères spéciaux et qu'il n'est pas vide.
   * Affiche un message d'erreur si la validation échoue.
   * @function
   * @param {Object} e - L'événement de saisie de l'utilisateur.
   */
  const handleTerm = (e) => {
    const searchTerm = e.target.value;

    /**
     * Valide le terme de recherche pour s'assurer qu'il ne contient
     * pas de caractères spéciaux et qu'il n'est pas vide.
     * Affiche un message d'erreur si la validation échoue.
     * @param {string} term - Le terme de recherche.
     * @returns {boolean} true si la validation est réussie, false sinon.
     */
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
