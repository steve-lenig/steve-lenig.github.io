document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("journal-icon-link").style.display = "none";
    document.getElementById("vhiqosad-icon-link").style.display = "none";

    const visitedGallery = localStorage.getItem("visitedGallery");
    const visitedShop = localStorage.getItem("visitedShop");
    const visitedAbout = localStorage.getItem("visitedAbout");
    const visitedJournal = localStorage.getItem("visitedJournal");

    if (visitedGallery || visitedShop || visitedAbout) {
        document.getElementById("journal-icon-link").style.display = "block";
    }

    if (visitedJournal) {
        document.getElementById("vhiqosad-icon-link").style.display = "block";
    }

    document.getElementById("journal-icon-link").addEventListener("click", function() {
      localStorage.setItem("visitedJournal", true);
    });

    document.getElementById("gallery-icon-link").addEventListener("click", function() {
      localStorage.setItem("visitedGallery", true);
    });

    document.getElementById("shop-icon-link").addEventListener("click", function() {
      localStorage.setItem("visitedShop", true);
    });

    document.getElementById("about-icon-link").addEventListener("click", function() {
      localStorage.setItem("visitedAbout", true);
    });

    document.getElementById("vhiqosad-icon-link").addEventListener("click", function() {
      localStorage.setItem("visitedVhiqosad", true);
    });
});