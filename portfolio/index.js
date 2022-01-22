window.addEventListener("load", function () {
    const navList = document.querySelector(".nav-list");
    const navLinks = document.querySelector(".nav-link");
    const overlay = document.querySelector(".overlay");
    const button = document.getElementById("menu-button");

    const toggleMenu = () => {
        if (navList.classList.contains("open")) {
            overlay.setAttribute("aria-hidden", "true");
        } else overlay.setAttribute("aria-hidden", "");

        button.classList.toggle("active");
        navList.classList.toggle("open");
    };

    const closeMenuLink = (event) => {
        if (event.target.classList.contains("nav-link")) {
            closeMenu();
        }
    };

    const closeMenu = () => {
        button.classList.remove("active");
        navList.classList.remove("open");
        overlay.setAttribute("aria-hidden", "true");
    };

    button.addEventListener("click", toggleMenu);
    navList.addEventListener("click", closeMenuLink);
    overlay.addEventListener("click", closeMenu);

    //window.addEventListener("resize", closeMenu);
});
