import fs from "fs";

const getId = (() => {
  let id = 1;
  return () => {
    return id++;
  };
})();

class MoviesManager {
  constructor() {
    this.movies = [];
  }

  loadMovies() {
    const data = fs.readFileSync("movies.json", "utf8");
    this.movies = JSON.parse(data);
  }

  saveMovies() {
    fs.writeFileSync("movies.json", JSON.stringify(this.movies, null, 2));
  }

  displayMovies() {
    console.log("\n===== Movie Catalog =====");
    this.movies.forEach((movie) => {
      console.log(`ID: ${movie.id}`);
      console.log(`Title: ${movie.title}`);
      console.log(`Director: ${movie.director}`);
      console.log(`Year of Release: ${movie.yearOfRelease}`);
      console.log(`Genre: ${movie.genre}`);
      console.log(`IMDb Rating: ${movie.imdbRating} \n`);
    });
  }

  addMovie(title, director, yearOfRelease, genre, imdbRating) {
    const newMovie = {
      id: getId(),
      title,
      director,
      yearOfRelease,
      genre,
      imdbRating,
    };
    this.movies.push(newMovie);
    this.saveMovies();
  }

  updateMovie(id, updatedData) {
    const movieIndex = this.movies.findIndex((movie) => movie.id === id);
    if (movieIndex !== -1) {
      this.movies[movieIndex] = { ...this.movies[movieIndex], ...updatedData };
      this.saveMovies();
      console.log("Movie details updated successfully.");
    } else {
      console.log("Movie not found.");
    }
  }

  deleteMovie(id) {
    const movieIndex = this.movies.findIndex((movie) => movie.id === id);
    if (movieIndex !== -1) {
      this.movies.splice(movieIndex, 1);
      this.saveMovies();
      console.log("Movie deleted successfully.");
    } else {
      console.log("Movie not found.");
    }
  }

  searchMovies(searchTerm) {
    const matchedMovies = this.movies.filter((movie) => {
      const { title, director, genre } = movie;
      return (
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    if (matchedMovies.length > 0) {
      console.log(`\n===== Search Results for "${searchTerm}" =====`);
      matchedMovies.forEach((movie) => {
        console.log(`ID: ${movie.id}`);
        console.log(`Title: ${movie.title}`);
        console.log(`Director: ${movie.director}`);
        console.log(`Year of Release: ${movie.yearOfRelease}`);
        console.log(`Genre: ${movie.genre}`);
        console.log(`IMDb Rating: ${movie.imdbRating} \n`);
      });
    } else {
      console.log(`No movies found for "${searchTerm}".`);
    }
  }

  filterMovies(criteria, value) {
    const filteredMovies = this.movies.filter((movie) => {
      return movie[criteria] === value;
    });

    if (filteredMovies.length > 0) {
      console.log(`\n===== Filtered Movies (${criteria}: ${value}) =====`);
      filteredMovies.forEach((movie) => {
        console.log(`ID: ${movie.id}`);
        console.log(`Title: ${movie.title}`);
        console.log(`Director: ${movie.director}`);
        console.log(`Year of Release: ${movie.yearOfRelease}`);
        console.log(`Genre: ${movie.genre}`);
        console.log(`IMDb Rating: ${movie.imdbRating} \n`);
      });
    } else {
      console.log(`No movies found for the given ${criteria}: ${value}.`);
    }
  }

  async fetchMoviesData() {
    try {
      const response = await fetch("http://www.omdbapi.com/?s=star&apikey=7ad9dc92");
      const data = await response.json();
  
      if (data.Error) {
        console.log("Error: Failed to fetch movie data.");
        return;
      }
  
      const randomMovies = data.Search.slice(0, 5); // Fetching 5 random movies
      for (const movie of randomMovies) {
        const movieData = await this.fetchMovieDetails(movie.imdbID);
        const { Title, Director, Year, Genre, imdbRating } = movieData;
        this.addMovie(Title, Director, Year, Genre, imdbRating);
      }
  
      this.saveMovies();
      console.log("Random movies fetched and added successfully.");
    } catch (error) {
      console.log("Error: Failed to fetch movie data.", error);
    }
  }
  async getMovieByName(name) {
    try {
      const response = await fetch(`http://www.omdbapi.com/?t=${name}&apikey=7ad9dc92`);
      const data = await response.json();
  
      if (data.Error) {
        console.log("Error: Failed to fetch movie data.");
        return;
      }
  
      console.log("Movie Fetched Successfully successfully." , data);
    } catch (error) {
      console.log("Error: Failed to fetch movie data.", error);
    }
  }
  async fetchMovieDetails(imdbID) {
    try {
      const response = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=7ad9dc92`);
      const data = await response.json();
  
      if (data.Error) {
        console.log(`Error: Failed to fetch movie details for IMDb ID: ${imdbID}`);
        return null;
      }
  
      return data;
    } catch (error) {
      console.log(`Error: Failed to fetch movie details for IMDb ID: ${imdbID}`, error);
      return null;
    }
  }
}

const mv = new MoviesManager();
mv.loadMovies();

// Example usage:
mv.displayMovies();
mv.addMovie("The Shawshank Redemption", "Frank Darabont", 1994, "Drama", 9.3);
mv.addMovie("1917", "lorem Darabont", 2017, "Real", 8.9);
mv.displayMovies();
mv.updateMovie(1, { genre: "Crime/Drama" });
mv.displayMovies();
mv.deleteMovie(2);
mv.displayMovies();
mv.searchMovies("shawshank");
mv.filterMovies("genre", "Drama");
mv.fetchMoviesData();
mv.getMovieByName("1917");
mv.displayMovies();
