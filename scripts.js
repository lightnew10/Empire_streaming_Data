
document.addEventListener("DOMContentLoaded", function () {
    const movieListElement = document.getElementById("movie-list");

    chrome.storage.local.get({ watchLater: [] }, function (data) {
        const watchLaterList = data.watchLater;

        if (watchLaterList.length === 0) {
            movieListElement.innerHTML = "<p>Votre liste est vide.</p>";
            return;
        }

        watchLaterList.forEach((movie, index) => {
            const movieItem = document.createElement("div");
            movieItem.className = "movie-item";

            const movieTitle = document.createElement("a");
            const serie = "Saison: " + movie.season + " | Ep: " + movie.episode;
            movieTitle.textContent = movie.title;
            movieTitle.href = "#";
            movieTitle.className = "open-link";
            movieTitle.dataset.url = movie.url;

            const parent = document.createElement("div");
            parent.style.display = "flex";
            parent.style.alignItems = "center";
            const viewButton = document.createElement("a");
            viewButton.textContent = "🎬​";
            viewButton.className = "open-link";
            viewButton.style.cursor = "pointer";
            viewButton.classList.add("list");
            viewButton.dataset.url = movie.url;
            const deleteButton = document.createElement("span");
            deleteButton.textContent = "❌";
            deleteButton.className = "delete-btn";
            deleteButton.addEventListener("click", function () {
                watchLaterList.splice(index, 1);
                chrome.storage.local.set({ watchLater: watchLaterList }, function () {
                    movieItem.remove();
                });
            });
            
            parent.appendChild(viewButton);
            parent.appendChild(deleteButton);
            movieItem.appendChild(movieTitle);
            if (movie.season != undefined) {
                const contentSerie = document.createElement("span");
                contentSerie.textContent = serie;
                movieItem.appendChild(contentSerie);
            }
            movieItem.appendChild(parent);
            movieListElement.appendChild(movieItem);
        });
        document.querySelectorAll(".open-link").forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                const url = event.target.dataset.url;
                chrome.tabs.create({ url: url });
            });
        });
    });
});


