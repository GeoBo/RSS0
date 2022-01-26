
import i18Obj from './assets/js/translate.js';


window.addEventListener("load", function () {
    addMenuEvent ();
    addGalleryEvent ();
    preloadImages ();
    addLangEvent ();
    addThemeEvent ();
});

function addThemeEvent (){
    const button = document.querySelector (".theme-switcher");
    const use = button.querySelector ("use");
    //const elems = ['.header', '#hero', '.section-title'];
    const elems = ['body'];

    const toggleTheme = () => {
        if (button.classList.contains ("white-theme")) {
            use.setAttribute ("xlink:href","assets/svg/sprite.svg#sun")
            button.classList.remove ("white-theme");

            document.documentElement.style.setProperty('--body-color', '#000');
            document.documentElement.style.setProperty('--text-color', '#FFF');
            
            elems.forEach (elem => {
                const el = document.querySelectorAll (elem);
                el.forEach (e => {
                    e.classList.remove ("white-theme");
                })  
            });         
        }
        else {
            use.setAttribute ("xlink:href","assets/svg/sprite.svg#moon");
            button.classList.add ("white-theme");

            document.documentElement.style.setProperty('--body-color', '#FFF');
            //document.documentElement.style.setProperty('--text-color', '#000');
            document.documentElement.style.setProperty('--text-color', '#1C1C1C');

            elems.forEach (elem => {
                const el = document.querySelectorAll (elem);
                el.forEach (e => {
                    e.classList.add ("white-theme");
                })                 
            });  
        }
    }

    button.addEventListener("click", toggleTheme);
}

function convertHtmlEntity (str){
    var div = document.createElement ('div');
    div.innerHTML = str;
    return div.textContent;
}

function addLangEvent () {
    const langSwitcher = document.querySelector(".lang-switcher");
    const btns = langSwitcher.querySelectorAll('.btn');
    const textObjs = document.querySelectorAll('[data-lang]');

    
    const changeLang = (event) => {

        let activeBtn = event.target;
        let aBtnClass = activeBtn.classList;
        let lang = activeBtn.textContent.toLowerCase();
        
        if (aBtnClass.contains("btn") && !aBtnClass.contains("active")) {
            
            btns.forEach (button => {
                button.classList.remove("active");
            });

            aBtnClass.add("active");
            
            textObjs.forEach (obj => {
                let text = convertHtmlEntity (i18Obj [lang][obj.dataset.lang]);
                if (obj.placeholder) obj.placeholder = text;
                else obj.textContent = text;                
            });
        }
    }

    langSwitcher.addEventListener("click", changeLang);
}

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
