var apiKey = "ebd5f559316479fee95ab51cbb0ffad5";

function getTrackLyrics(songArtist, songTitle) {
   //format the api url
   var apiUrl = "https://api.vagalume.com.br/search.php?art=" + songArtist + "&mus=" + songTitle + "&apikey=" + apiKey;
   fetch(apiUrl)
      .then(function (response) {
         if (response.ok) {
            response.json().then(function (data) {
               // Create Collection for the lyrics
               var lyricsDiv = document.getElementsByClassName("lyricsClass");

               for (i = 0; i < lyricsDiv.length; i++) {
                  // If there are not lyrics found, display message
                  if (data.type === "song_notfound" || data.type === "notfound") {
                     lyricsDiv[i].innerHTML =
                        "Sorry, we could not find the lyrics to " + songTitle + " by " + songArtist;
                  } else {
                     lyricsDiv[i].innerHTML = data.mus[0].text;
                  }
               }
            });
         } else {
            alert("Error: Cannot Find Lyrics");
            console.log(apiUrl);
         }
      })
      .catch(function (error) {
         alert("Unable to connect to the Lyrics Database");
      });
}

// function to close details tag when another is opened
function closeOtherLyrics() {
   // fetch all the details elements
   const lyricsDetails = document.querySelectorAll("details");
   // add the onclick listeners
   lyricsDetails.forEach((targetDetail) => {
      // Close all the details that are not targetDetail
      lyricsDetails.forEach((detail) => {
         if (detail !== targetDetail) {
            detail.removeAttribute("open");
         }
      });
   });
}
