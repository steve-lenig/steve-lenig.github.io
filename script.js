document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("gallery-icon-link").style.display = "none";
    document.getElementById("vhiqosad-icon-link").style.display = "none";

    const visitedJournal = localStorage.getItem("visitedJournal");
    const visitedShop = localStorage.getItem("visitedShop");
    if (visitedJournal || visitedShop) {
        document.getElementById("gallery-icon-link").style.display = "block";
    }

    const visitedAbout = localStorage.getItem("visitedAbout");
    if (visitedAbout) {
        document.getElementById("vhiqosad-icon-link").style.display = "block";
    }

    document.getElementById("journal-icon-link").addEventListener("click", function() {
        localStorage.setItem("visitedJournal", true);
    });

    document.getElementById("shop-icon-link").addEventListener("click", function() {
        localStorage.setItem("visitedShop", true);
    });

    document.getElementById("about-icon-link").addEventListener("click", function() {
        localStorage.setItem("visitedAbout", true);
    });
});