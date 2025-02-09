(function () {
    const url = window.location.href;

    function isInsideBody(element) {
        while (element) {
            if (element.tagName === "BODY") return true;
            element = element.parentNode;
        }
        return false;
    }
    function removeIframe() {
        document.querySelectorAll("iframe").forEach(iframe => {
            if (!isInsideBody(iframe)) {
                console.log("iframe retiré");
                iframe.remove();
            }
            const ads = document.getElementsByClassName("container-banner-ads");
            for (const element of ads) {
                console.info(ads);
                element.remove();
            }
            const donation = document.getElementById("donation");
            if (donation)
                donation.remove();
        });
    }
    const observer = new MutationObserver(() => {
        removeIframe();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    let checkIntervalIframe = setInterval(() => {
        removeIframe();
    }, 500);

    const regexSerieFilm = /^https?:\/\/empire-stream\.[a-z]+\/(serie|film)\/.+/;
    const regexHome = /^https?:\/\/empire-stream\.[a-z]+(\/.*)?$/;

    function showNotification(message, type = "success") {
        const existingNotification = document.querySelector(".custom-notification");
        if (existingNotification) {
            existingNotification.remove();
        }
    
        const notification = document.createElement("div");
        notification.className = `custom-notification ${type}`;
        notification.textContent = message;
        notification.style.position = "absolute";
        notification.style.inset = "0";
        notification.style.zIndex = "999999999";
        notification.style.backgroundColor = "rgb(100 20 26)";
        notification.style.color = "white";
        notification.style.width = "30rem";
        notification.style.height = "5rem";
        notification.style.borderRadius = "5px";
        notification.style.top = "10px";
        notification.style.left = "50%";
        notification.style.display = "flex";
        notification.style.left = "50%";
        notification.style.alignItems = "center";
        notification.style.justifyContent = "center";
        notification.style.transform = "translate(-50%, -6rem)";
        notification.style.transition = "opacity 0.5s ease, transform 0.5s ease";

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = "1";
            notification.style.transform = "translate(-50%)";
        }, 500);
    
        setTimeout(() => {
            notification.style.opacity = "0";
            notification.style.transform = "translate(-50%, -6rem)";
            setTimeout(() => notification.remove(), 500);
        }, 3500);
    }

    if (regexSerieFilm.test(url)) {
        if (document.getElementById("watch-later-btn")) return;

        let target = document.getElementById("target_add_list");
        let head = document.getElementById("header_nav_top");

        //BUILD BUTTON ADD LIST
        const button = document.createElement("button");
        target.style.display = "flex";
        target.style.alignItems = "center";
        button.id = "watch-later-btn";
        button.textContent = "Ajouter à regarder plus tard";
        button.style.backgroundColor = "rgba(229,34,47,.45)";
        button.style.color = "white";
        button.style.border = "none";
        button.style.padding = "10px 15px";
        button.style.fontSize = "16px";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.marginLeft = "10px";

        const parent = document.createElement("div");
        parent.classList.add("mrw-1p2");
        const listButton = document.createElement("button");
        listButton.id = "view-list-btn";
        listButton.classList.add("d-f", "ai-c", "item-link-nav", "button_search_target");
        const span = document.createElement("span");
        span.classList.add("icon-custom-m", "icon-custom", "d-b", "item-nav-icon", "mr-1");
        const img = document.createElement("img");
        img.src = chrome.runtime.getURL("clipboard.png");
        img.alt = "icone list"
        span.appendChild(img);
        const p = document.createElement("p");
        p.textContent = "Voir ma liste";
        p.classList.add("mb-0","fs-14","c-w","item-link-p");

        button.onmouseover = function() {
            button.style.backgroundColor = "rgba(152, 24, 32, 0.45)";
        };
        
        button.onmouseout = function() {
            button.style.backgroundColor = "rgba(229,34,47,.45)";
        };

        target.appendChild(button);

        head.appendChild(parent);
        parent.appendChild(listButton);
        listButton.appendChild(span);
        listButton.appendChild(p);

        button.addEventListener("click", function () {
            const title = document.getElementById("title_media").innerText.trim();
            const movieData = { title, url };

            chrome.storage.local.get({ watchLater: [] }, function (data) {
                const watchLaterList = data.watchLater;

                if (watchLaterList.some(item => item.title === title)) {
                    showNotification("⚠️ Ce film est déjà dans la liste !", "error");
                    return;
                }

                watchLaterList.push(movieData);

                chrome.storage.local.set({ watchLater: watchLaterList }, function () {
                    showNotification("✅ Ajouté à la liste !", "success");
                });
            });
        });

        listButton.addEventListener("click", function () {
            chrome.runtime.sendMessage({ action: "openListPopup" });
        });
    
        function addWatchLaterButton() {
            let suggestions = document.getElementsByClassName("d-f card-sugegst-link fd-c mb-3");

            if (suggestions.length > 0) {
                for (let element of suggestions) {
                    const linkElement = element.querySelector("a").href;
                    let title = element.querySelector(".container-info p").innerText.trim();
                    let target = element.getElementsByClassName("d-f ai-c mt-auto")[0];

                    //BUILD BUTTON
                    const button = document.createElement("button");
                    button.id = "watch-later-btn";
                    button.textContent = "Ajouter à regarder plus tard";
                    button.style.backgroundColor = "rgba(229,34,47,.45)";
                    button.style.color = "white";
                    button.style.border = "none";
                    button.style.fontSize = "13px";
                    button.style.marginTop = "5px";
                    button.style.borderRadius = "5px";
                    button.style.cursor = "pointer";
                    button.style.marginLeft = "10px";

                    button.onmouseover = function() {
                        button.style.backgroundColor = "rgba(152, 24, 32, 0.45)";
                    };
                    
                    button.onmouseout = function() {
                        button.style.backgroundColor = "rgba(229,34,47,.45)";
                    };

                    target.appendChild(button);

                    button.addEventListener("click", function () {
                        console.log("info -> " + title + " | link -> " + linkElement);
                        const movieData = { title, url:linkElement };

                        chrome.storage.local.get({ watchLater: [] }, function (data) {
                            const watchLaterList = data.watchLater;
                            console.log(watchLaterList);

                            if (watchLaterList.some(item => item.title === title)) {
                                showNotification("⚠️ Ce film est déjà dans la liste !", "error");
                                return;
                            }

                            watchLaterList.push(movieData);

                            chrome.storage.local.set({ watchLater: watchLaterList }, function () {
                                showNotification("✅ Ajouté à la liste !", "success");
                            });
                        });
                    });
                }
                return true;
            }
            return false;
        }

        let checkInterval = setInterval(() => {
            if (addWatchLaterButton()) {
                clearInterval(checkInterval);
            }
        }, 3000);
    } else if (regexHome.test(url)) {
        let head = document.getElementById("header_nav");
        const parent = document.createElement("div");
        parent.classList.add("mrw-1p2");
        parent.id = "header-parent-list";
        const listButton = document.createElement("button");
        listButton.id = "view-list-btn";
        listButton.classList.add("d-f", "ai-c", "item-link-nav", "button_search_target");
        const span = document.createElement("span");
        span.classList.add("icon-custom-m", "icon-custom", "d-b", "item-nav-icon", "mr-1");
        const img = document.createElement("img");
        img.src = chrome.runtime.getURL("clipboard.png");
        img.alt = "icone list";
        span.appendChild(img);
        const p = document.createElement("p");
        p.textContent = "Voir ma liste";
        p.classList.add("mb-0","fs-14","c-w","item-link-p");

        head.appendChild(parent);
        parent.appendChild(listButton);
        listButton.appendChild(span);
        listButton.appendChild(p);

        listButton.addEventListener("click", function () {
            chrome.runtime.sendMessage({ action: "openListPopup" });
        });
    }

    let oldSaisonEpisode = "0-0";
    function checkURLParams() {
        const params = new URLSearchParams(window.location.search);
        const saison = params.get("saison");
        const episode = params.get("episode");
        const combined = saison + "-" + episode;
    
        if ((saison && episode) && oldSaisonEpisode != combined) {
            console.log(`Nouvel épisode détecté : Saison ${saison}, Épisode ${episode}`);
            oldSaisonEpisode = combined;
    
            chrome.storage.local.get({ watchLater: [] }, function (data) {
                let watchLaterList = data.watchLater;
                const title = document.getElementById("title_media").innerText.trim();
                const movieData = { title, url: window.location.href, season: saison, episode };

                watchLaterList = watchLaterList.filter(item => item.title !== title);
                watchLaterList.push(movieData);
                
                chrome.storage.local.set({ watchLater: watchLaterList }, function () {
                    showNotification("📢 Actualisation de la série ! (actualisation de l'épisode dans votre liste)", "success");
                });
            });
        }
    }
    
    
    
    let checkURLParameter = setInterval(() => checkURLParams(), 500);
})();
