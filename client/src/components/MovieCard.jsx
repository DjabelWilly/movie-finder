import React, { useState, useEffect } from "react";
import API_URL from "../config/constants";

/**
 * Affiche un film avec ses détails ou un aperçu
 * en fonction de si le film est sélectionné ou non.
 * @function
 * @param {Object} movie - Les détails du film.
 * @param {string} selectedMovieId - L'ID du film sélectionné.
 * @param {Function} setSelectedMovieId - La fonction pour mettre à jour l'état `selectedMovieId`.
 */
const MovieCard = ({ movie, selectedMovieId, setSelectedMovieId }) => {
  const { imdbID, Year, Poster, Title, Type } = movie;
  const [movieDetails, setMovieDetails] = useState(null);

  const isSelected = selectedMovieId === imdbID; // Vérifie si ce film est sélectionné

  useEffect(() => {
    if (isSelected) {
      /**
       * Récupère les détails d'un film en fonction de son ID
       * et mets à jour l'état `movieDetails` en conséquence.
       * @function
       * @async
       * @throws {Error} Si la requête API est en erreur.
       */
      const fetchMovieDetails = async () => {
        try {
          const response = await fetch(`${API_URL}/movieDetails?id=${imdbID}`);
          if (!response.ok) throw new Error(`Erreur API: ${response.status}`);

          const data = await response.json();
          setMovieDetails(data);
        } catch (error) {
          console.error("Erreur de récupération des détails:", error);
        }
      };
      fetchMovieDetails();
    }
  }, [isSelected, imdbID]);

  return (
    <>
      {/* Affiche les films recherchés par le titre */}
      {!isSelected ? (
        <div className="movie" onClick={() => setSelectedMovieId(imdbID)}>
          <div>
            <p>{Year}</p>
          </div>
          <div className="img-container">
            <img
              src={
                Poster === "N/A" ? "https://via.placeholder.com/400" : Poster
              }
              alt={Title}
            />
          </div>
          <div className="bottom-card">
            <h2>{Type}</h2>
            <h3>{Title}</h3>
          </div>
        </div>
      ) : (
        // Affiche les détails du film sélectionné
        movieDetails && (
          <div className="movie-details">
            <button onClick={() => setSelectedMovieId(null)}>✖</button>
            <h2>{movieDetails.Title}</h2>
            <img
              src={
                movieDetails.Poster === "N/A"
                  ? "https://via.placeholder.com/400"
                  : movieDetails.Poster
              }
              alt={movieDetails.Title}
            />
            <p>
              <strong>Synopsis:</strong> {movieDetails.Plot}
            </p>
            <p>
              <strong>Genre:</strong> {movieDetails.Genre}
            </p>
            <p>
              <strong>Actors:</strong> {movieDetails.Actors}
            </p>
            <p>
              <strong>Director:</strong> {movieDetails.Director}
            </p>
            <p>
              <strong>Writer:</strong> {movieDetails.Writer}
            </p>
            <p>
              <strong>Awards:</strong> {movieDetails.Awards}
            </p>
            <p>
              <strong>Country:</strong> {movieDetails.Country}
            </p>
            <p>
              <strong>Language:</strong> {movieDetails.Language}
            </p>
            <p>
              <strong>Released:</strong> {movieDetails.Released}
            </p>
            <p>
              <strong>Runtime:</strong> {movieDetails.Runtime}
            </p>
            <p>
              <strong>Rated:</strong> {movieDetails.Rated}
            </p>
            <p>
              <strong>Metascore:</strong> {movieDetails.Metascore}
            </p>
            <p>
              <strong>imdbRating:</strong> {movieDetails.imdbRating}
            </p>
            <p>
              <strong>imdbVotes:</strong> {movieDetails.imdbVotes}
            </p>
            {movieDetails.totalSeasons && (
              <p>
                <strong>Total Seasons:</strong> {movieDetails.totalSeasons}
              </p>
            )}
            {movieDetails.Ratings?.length > 0 && (
              <div>
                <strong>Ratings:</strong>
                <ul>
                  {movieDetails.Ratings.map((rating, index) => (
                    <li key={index}>
                      {rating.Source}: {rating.Value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      )}
    </>
  );
};

export default MovieCard;
