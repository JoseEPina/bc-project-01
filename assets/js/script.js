// Spotify API Processing

// Variables needed to handle raw data from API
var genreList = []; // array to hold list of Spotify genres
var prevList = []; // array to hold the last shown list of tracks
// object to hold the last shown playlist, that includes the list name/ genre and the list of tracks
var prevPlaylistObj = {
   genre: "",
   prevList: [],
};
// initialize array of last 3 playlists. (these are initialized empty at first)
var prevPlaylists = [prevPlaylistObj, prevPlaylistObj, prevPlaylistObj];
var prevGenre = ""; // last selected genre
var token; // Spotify API refresh token

// Create single track <li> DOM element and appends it to <ul> ulElement
function createTrackEl(ulElement, track) {
   var trackPreview = track.trackPreview;
   var trackURL = track.trackURL;
   var trackName = track.trackName;
   var artistName = track.artistName;

   var liElement = document.createElement("li");
   liElement.className = "playlist-item";
   liElement.id = "playlist-item";

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
   var detailsElArtist = document.createElement("details");
   var summaryElArtist = document.createElement("Summary")
   var lyricsEl = document.createElement('p')
   lyricsEl.className = "lyricsClass"
   summaryElArtist.textContent = ", " + artistName;
   detailsElArtist.setAttribute('onclick', `getTrackLyrics("${artistName}", "${trackName}")`)

   // Completes 'child' to 'parent' relationship in DOM
   liElement.appendChild(anchorElPreview);
   liElement.appendChild(anchorElSong);
   liElement.appendChild(detailsElArtist);
   detailsElArtist.appendChild(summaryElArtist)
   detailsElArtist.appendChild(lyricsEl)

   ulElement.appendChild(liElement);
   // Adds current track to array object
   prevList.push(track);
}

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

   // Object to persist previous genre and previous playlists
   prevPlaylistObj = {
      genre: prevGenre,
      prevList: prevList,
   };

   // Remove oldest playlist
   prevPlaylists.shift();
   // Adds previous genre name and playlist to array of prevPlaylists
   prevPlaylists.push(prevPlaylistObj);

   // Persist previous playlists. Use this key: "spotify-prev-lists"
   // to recover previous playlists
   localStorage.setItem("spotify-prev-lists", JSON.stringify(prevPlaylists));
   // Prepares current list to become prevList.
   prevGenre = genre;
   prevList = [];
   // Raw data comes as an array. We are using the 'tracks' portion only
   var tempDataLength = playlistData.tracks.length; // to read playlist size
   // Loop through array length to build playlist DOM elements
   for (var i = 0; i < tempDataLength; i++) {
      // These are the actual 4 items we need from Spotify to process our list,
      var track = {
         artistName: playlistData.tracks[i].artists[0].name,
         trackName: playlistData.tracks[i].name,
         trackURL: playlistData.tracks[i].external_urls.spotify,
         trackPreview: playlistData.tracks[i].preview_url,
      };
      // skip song, if trackPreview is null
      if (track.trackPreview) {
         // The following call processes one track at a time.
         createTrackEl(ulElement, track); // This call can be used to display the previous lists
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
   var tempLength = genreList.length; // assign genre list size to new variable

   // Builds the genres into a list for <select> element
   for (var i = 0; i < tempLength; i++) {
      var optionElement = document.createElement("option");
      optionElement.textContent = genreList[i]; // writes the genre names from our array
      optionElement.className = "genre-list-item";
      optionElement.id = "genre-list-options";

      document.getElementById("genre-list-group").appendChild(optionElement);
   }
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