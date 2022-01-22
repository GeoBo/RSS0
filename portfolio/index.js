window.addEventListener("load", function () {

    addMenuEvent ();
    addGalleryEvent ();
    preloadImages ();
});

function preloadImages () {
    const seasons = ['winter', 'spring', 'summer', 'autumn'];

    seasons.forEach (season => {
        for (let i = 1; i <= 6; i++) {
            const img = new Image ();
            img.src = `./assets/img/${season}/${i}.jpg`;
        }
    })     
}

function addGalleryEvent () {
    const buttonBlock = document.querySelector(".button-block");
    const btn = buttonBlock.querySelectorAll(".btn");
    const portfolioImages = document.querySelectorAll(".portfolio-image");
     
    // console.log(btn); 
    const toggleGallery = (event) => {
        let activeBtn = event.target;
        if (activeBtn.classList.contains("btn")) {
            btn.forEach (button => {
                button.classList.remove("active");
            });
            activeBtn.classList.add("active");
            portfolioImages.forEach ((img, index) => 
                img.src = `./assets/img/${activeBtn.dataset.season}/${index + 1}.jpg`
            );
        }
    }

    buttonBlock.addEventListener("click", toggleGallery);
}

function addMenuEvent () {
    const navList = document.querySelector(".nav-list");
    const overlay = document.querySelector(".overlay");
    const button = document.getElementById("menu-button");

    const toggleMenu = () => {
        if (navList.classList.contains("open")) {
            overlay.setAttribute("aria-hidden", "true");
        } 
        else overlay.setAttribute("aria-hidden", "");

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
}
