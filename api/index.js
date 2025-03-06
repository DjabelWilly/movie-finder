import dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(json());

const PORT = process.env.PORT || 5000;

// Route pour la recherche de films par le titre
app.get('/movies', async (req, res) => {
    const { title } = req.query;
    if (!title) {
        return res.status(400).json({ message: 'Veuillez entrer un titre de film.' });
    }
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${process.env.API_KEY}&s=${title}`);
        if (!response.ok) {
            throw new Error(`OMDb API request failed with status ${response.status}`);
        }
        const data = await response.json();

        if (data.Response === 'True' && data.Search) {
            res.json({ Search: data.Search }); // Send only the Search array
        } else {
            console.warn("⚠️ Aucun film trouvé.");
            res.status(404).json({ message: `Aucun film trouvé pour "${title}"` });
        }
    } catch (error) {
        console.error("❌ Erreur API:", error.message);
        res.status(500).json({ message: "Erreur lors de la recherche.", error: error.message });
    }
});

// Route pour obtenir les détails d'un film par son ID
app.get('/movieDetails', async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ message: 'Veuillez entrer un ID de film.' });
    }
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${process.env.API_KEY}&i=${id}`);
        if (!response.ok) {
            throw new Error(`OMDb API request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (data.Response === 'True') {
            res.json(data);
        } else {
            console.warn("⚠️ Aucun film trouvé.");
            res.status(404).json({ message: `Aucun film trouvé pour l'ID ${id}` });
        }
    } catch (error) {
        console.error("❌ Erreur API:", error.message);
        res.status(500).json({ message: "Erreur lors de la récupération des détails.", error: error.message });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});