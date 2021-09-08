// Spotify API Processing

// Variables needed to handle raw data from API
var genreList = [];
var prevList = [];
var prevPlaylistObj = {
   genre: "",
   prevList: [],
};
var prevPlaylists = [prevPlaylistObj, prevPlaylistObj, prevPlaylistObj];
console.log(prevPlaylists);
var prevGenre = "";
var listCount = 0;
var token;

// This function is used as Proof of Concept to validate that
// we are recovering the Spotify API data correctly.
// This function code should be adapted to match
// the final project design and styling. The accompanying
// index.html file is also intended to be a proof of concept.
function createPlaylistDOM(playlistData) {
   // <ul> container
   var ulElement = document.createElement("ul");
   ulElement.className = "playlist-group";
   ulElement.id = "playlist-group";

   // Persist previous playlists. Use this key: "spotify-prev-lists"
   // to recover previous playlists

   prevPlaylistObj = {
      genre: prevGenre,
      prevList: prevList,
   };

   prevPlaylists.shift();
   prevPlaylists.push(prevPlaylistObj);

   localStorage.setItem("spotify-prev-lists", JSON.stringify(prevPlaylists));
   prevList = [];
   prevGenre = genre;
   // Raw data comes as an array. We are using the 'tracks' portion only
   var tempDataLength = playlistData.tracks.length; // to read playlist size
   // Loop through array length to build playlist DOM elements
   for (var i = 0; i < tempDataLength; i++) {
      var trackPreview = playlistData.tracks[i].preview_url;
      if (trackPreview) {
         var liElement = document.createElement("li");
         liElement.className = "playlist-item";
         liElement.id = "playlist-item";

         // These are the actual items we need from Spotify to process our list.
         var artistName = playlistData.tracks[i].artists[0].name;
         var trackName = playlistData.tracks[i].name;
         var trackURL = playlistData.tracks[i].external_urls.spotify;

         // Temporary Anchor link for a 30 sec music preview. Shows as
         // <span> when preview track is NOT available.
         // We may want to replace this with HTML audio element with a play button
         var anchorElPreview;
         // if Track preview is available, then create link.
         // if it is not available, create span element.
         anchorElPreview = document.createElement("a");
         anchorElPreview.className = "playlist-item-preview";
         anchorElPreview.href = trackPreview;
         anchorElPreview.textContent = "Song Preview -- ";
         anchorElPreview.target = "_blank"; // Open new browser tab
         anchorElPreview.rel = "noreferrer noopener"; // Recommended security option from MDN

         // Track title link opens song in Spotify website
         var anchorElSong = document.createElement("a");
         anchorElSong.className = "playlist-item-song";
         anchorElSong.href = trackURL;
         anchorElSong.textContent = trackName;
         anchorElSong.target = "_blank"; // Open new browser tab
         anchorElSong.rel = "noreferrer noopener"; // Recommended security option from MDN

         // Adds Artist name
         var spanElArtist = document.createElement("span");
         spanElArtist.textContent = ", " + artistName;

         // Completes 'child' to 'parent' relationship in DOM
         liElement.appendChild(anchorElPreview);
         liElement.appendChild(anchorElSong);
         liElement.appendChild(spanElArtist);

         ulElement.appendChild(liElement);

         // Prepares data to persist as "previous list"
         var prevListEl = {
            trackPreview: trackPreview,
            trackName: trackName,
            trackURL: trackURL,
            artistName: artistName,
         };
         prevList.push(prevListEl); // Adds current track to array object
         // Persist currentList as "previous list"
      }
   }

   // Removes the last generated playlist from DOM
   var removeUl = document.getElementById("playlist-group");
   // Check if a list is present in DOM. If present, then Remove.
   if (removeUl) {
      removeUl.remove();
   }
   // Adds newly generated playlist to DOM
   document.getElementById("song-container").appendChild(ulElement); //change the ID to song-container and appended the ulElement
}

async function getPlaylistData() {
   // Fetches list of songs that match end-users' selected genre
   const response = await fetch("https://api.spotify.com/v1/recommendations?limit=60&market=US&seed_genres=" + genre, {
      headers: {
         Accept: "application/json",
         Authorization: "Bearer " + token,
         "Content-Type": "application/json",
      },
   });

   const playlistData = await response.json(); // playlistData is not a global var
   // Build DOM display for playlist (with playlistData as a parameter due to local scope)
   createPlaylistDOM(playlistData);
}

// This function is used as Proof of Concept to validate that
// we are recovering the Spotify API data correctly.
// This function code should be adapted to match
// the final project design and styling. The accompanying
// index.html file is also intended to be a proof of concept.
function createGenreDOM() {
   // Creates container element

   // Creates label & select elements

   var tempLength = genreList.length; // assign genre list size to new variable

   // Builds the genres into a list for <select> element
   for (var i = 0; i < tempLength; i++) {
      var optionElement = document.createElement("option");
      optionElement.textContent = genreList[i]; // writes the genre names from our array
      optionElement.className = "genre-list-item";
      optionElement.id = "genre-list-options";

      document.getElementById("genre-list-group").appendChild(optionElement);
   }

   // Completes 'child' to 'parent' relationship in DOM

   // uses .after() method instead of append to prevent attaching the genre list at end of <body>
}

async function getGenreData() {
   // Fetches Spotify's list of genres. (This is within the scope of refreshAuthorizationToken() ).
   const response = await fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
      headers: {
         Accept: "application/json",
         Authorization: "Bearer " + token,
         "Content-Type": "application/json",
      },
   });
   const genreData = await response.json(); // transform response/promise into json data
   genreList = genreData.genres; // genreList (from API data)

   createGenreDOM(); // Creates genre list in DOM

   // Listener for genre selection
   document.getElementById("genre-list-group").addEventListener("change", function () {
      // Gets selected genre from select/option elements
      genre = document.getElementById("genre-list-group").value;

      getPlaylistData(); // use 'genre' to generate playlist from Spotify
   });
}

async function refreshAuthorizationToken() {
   // Fetch new access token from Spotify
   // Use 'await' to force the program to WAIT for a response/promise from Spotify
   const response = await fetch("https://accounts.spotify.com/api/token", {
      body: "grant_type=client_credentials",
      headers: {
         Authorization:
            "Basic ZjVlMDNhMWMzNjVhNDZmOGI1OThmNjRhYTkyYjgyNmI6NDM2ZGEzYmNhNGVlNGI1ZGJlNDU1YWQ4OTRhMzcwMjI=",
         "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
   });
   // same concept as above. WAIT for response from .json() method
   const tokenData = await response.json(); // pass raw data into .json structure
   token = tokenData.access_token; // token assignment (from API data)

   getGenreData(); // uses token to get genre list data from Spotify.
}

function startGenreSounds() {
   const TOKEN_LIFE = 59 * 60 * 1000; // refresh token every 59 mins.
   refreshAuthorizationToken(); // Refreshes Spotify's Authorization token
   var intervalControl = setInterval(refreshAuthorizationToken, TOKEN_LIFE);
}

startGenreSounds();
