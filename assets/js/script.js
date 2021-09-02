var genreList = [];

function getGenreList() {
   fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
      headers: {
         Accept: "application/json",
         Authorization:
            "Bearer BQBIHx9qhjBKUbsE3yMuKUWbEjZE1OhU7aB0N-xtENwNw5sosmKws9iJkyO8JtRjp-Exv0uA2avhlt7ho7-IofG4i-KSNR_lTH3Dnw2SG-20mBJcgZHuvXq9HHHjK_-yy9MzvN63-fc",
         "Content-Type": "application/json",
      },
   })
      .then((response) => response.json())
      .then((data) => {
         genreList = data.genres;
         localStorage.setItem("myGenreList", JSON.stringify(genreList));
         console.log("ls out", genreList);
      });
   genreList = JSON.parse(localStorage.getItem("myGenreList"));
}

function createGenreDOM() {
   var divElement = document.createElement("div");
   divElement.className = "container";

   var labelElement = document.createElement("label");
   labelElement.for = "genre-list-group";
   labelElement.textContent = "Choose a music genre : ";

   var selectElement = document.createElement("select");
   selectElement.className = "genre-names";
   selectElement.id = "genre-names";

   var tempLength = genreList.length;

   for (var i = 0; i < tempLength; i++) {
      var optionElement = document.createElement("option");
      optionElement.textContent = genreList[i];
      optionElement.className = "genre-list-item";
      selectElement.appendChild(optionElement);
      console.log(optionElement);
   }

   document.getElementById("spotify-header").after(divElement);
   divElement.appendChild(labelElement);
   divElement.appendChild(selectElement);
}

function generatePlaylist() {
   getGenreList();
   createGenreDOM();
}

generatePlaylist();
