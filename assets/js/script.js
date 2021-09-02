var genreList = [];

fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
   headers: {
      Accept: "application/json",
      Authorization:
         "Bearer BQDPL4v9lWf2xZDnwvo5vtsuByC2yN1_OHVytpZhuHmyHZzSKl6XQQZIkp48UX4mPLqr4O4swYq1RmBn1evW7iE4PbuOPuN0VTkvnSvfzpxNCX7A-8OU7UstXXY0SPe35GawjbDZi_8",
      "Content-Type": "application/json",
   },
})
   .then((response) => response.json())
   .then((data) => {
      genreList = data.genres;
      localStorage.setItem("myGenreList", JSON.stringify(genreList));
   });

