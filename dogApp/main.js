const recipient = document.querySelector('.catelusi img');
const listaCaini = document.querySelector('#rase');
const selectorsDiv = document.querySelector('.selectors');
const slider = document.querySelector('.slider');
const slider_div = document.querySelector('.slider_div');
const dotsDiv = document.createElement("div");
dotsDiv.classList.add('slider__nav');
let continueFunction = true;
let currentBreed = '';
let set = "";
let dots = '';
let prev = '';




//Random dog img
//Top Pic


setInterval(() => {
    fetch('https://dog.ceo/api/breeds/image/random').then(data => {
        return data.json();
    }).then(link => {

        const link1 = link.message;
        recipient.setAttribute('src', link1);
        return link1;
    })
}, 10000);


function materializeEffect() {
    const kids = [...slider_div.children]; //  search prev circle divs and clean them
    kids.forEach((child) => {
        if (child.classList.contains('circle'))
            slider_div.removeChild(child);
    })
    const circle = document.createElement('div')
    circle.classList.add('circle')
    circle.style.left = '500px';
    circle.style.top = '0px';
    slider_div.appendChild(circle);

}


const moveToSlide = (slider1, currentSlide, targetSlide) => {
    slider1.style.transform = 'translateX(-' + targetSlide.style.left + ')';
    currentSlide.classList.remove('current-slide');
    targetSlide.classList.add('current-slide');
}

const updateDots = (currentDot, targetDot) => {
    currentDot.classList.remove('current-slide');
    targetDot.classList.add('current-slide');
}
dotsDiv.addEventListener('click', e => {


    let slides = [...slider.children];
    const slideWidth = slides[0].getBoundingClientRect().width;
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);
    const targetDot = e.target.closest('button');
    if (!targetDot) return;

    const currentSlide = slider.querySelector('.current-slide');
    const currentDot = dotsDiv.querySelector('.current-slide');
    const targetIndex = dots.findIndex(dot => dot === targetDot);
    const targetSlide = slides[targetIndex];
    moveToSlide(slider, currentSlide, targetSlide);
    currentDot.classList.remove('current-slide');
    targetDot.classList.add('current-slide');
    updateDots(currentDot, targetDot);

});

function addDots(dotsDiv, rasa) {
    const dotEl = document.createElement('button');
    dotEl.classList.add('slider__indicator');
    dotEl.classList.add(rasa);
    dotsDiv.append(dotEl);
}

function getBreeds() {
    return fetch("https://dog.ceo/api/breeds/list/all")
        .then(breeds => {
            return breeds.json();
        }).then(breeds => {
            return breeds.message;
        });
}

function checkSliderReplaceURL(slider, link) {
    let imaginiSliderCurent = slider.querySelectorAll('img');
    imaginiSliderCurent.forEach((img) => {
        if (img.classList.contains(currentBreed)) {
            img.setAttribute('src', link); //gasim imaginea care are deja acea rasa si inlocuim url ul pentru reload;
            img.className = '';
            img.className = currentBreed;
        }
    })

}

function fetchReloadBreed(link) {
    //trebuie sa selectam din link1, partea ce contine numele rasei, astel sa putem sa reapelam fetchbreedimg();
    var part = Array.from(link);
    let extractie = '';
    let i = 30; //30 este index ul unde incepe numele rasei in link;
    while (part[i] != '/') {
        if (part[i] === '-') { //aici ne ocupam de cazul in care rasa primita are '-' (este compusa), iar in fetch trebuie trimisa cu '/' ;
            extractie += '/'; //daca pe indexul curent il avem '-' atunci inlocuim cu '/' si incrementam i;
            i++;
        } else {
            extractie += part[i];
            i++;
        }
    };
    return extractie;
}

function fetchBreedImg(breed) {
    fetch(`https://dog.ceo/api/breed/${breed}/images/random`).then(data => {
        return data.json();
    }).then(link => {

        const link1 = link.message;
        currentBreed = fetchReloadBreed(link1); //afla numele rasei din linkul primit din fetch
        const imgDiv = document.createElement('div');
        const saveButton = document.createElement('div');
        const raceLabel = document.createElement('span');
        imgDiv.classList.add('fetchedDiv');
        saveButton.className = 'save';
        // daca e imagine cu acelasi link pana la poza trebuie sa inlocuiesc poza existenta cu cea care vine asta se face intr un if 
        //in afara eventlistenerului de pe  reload, reload doar apeleaza fetch img breed  iar img breed face restul ;
        let reload = document.createElement("div");
        reload.className = 'reload';
        reload.addEventListener('click', () => {
            materializeEffect();

            reload.style.display = 'none';
            continueFunction = false;
            const br = fetchReloadBreed(link1);
            fetchBreedImg(br);
            setTimeout(() => { reload.style.display = 'block'; }, 2000); //impiedica click ul multiplu timp de 2s, ce ar duce la adaugarea mai multor imagini in slider;

        });

        if (continueFunction) { //acest if are rolul de a impiedica  adaugarea unei noi imagini in slider atunci cand apasam butonul de reload
            const fetchedImg = document.createElement('img'); //am adaugat imaginii clasa cu numele rasei curente (current breed a fost salvata mai sus )
            fetchedImg.classList.add(currentBreed);
            fetchedImg.setAttribute('src', link1);
            raceLabel.innerHTML = `${currentBreed.toLocaleUpperCase()}`;
            raceLabel.className = 'raceLabel';
            imgDiv.append(fetchedImg);
            imgDiv.append(raceLabel);
            imgDiv.append(saveButton);
            imgDiv.append(reload);
            slider.append(imgDiv);
            slider.children[0].classList.add('current-slide');
        } else {
            // apelam functia de inlocuire url a imaginii pe care facem reload;
            checkSliderReplaceURL(slider, link1);
            continueFunction = true;
        }
        return link1;
    })
}



function listBreeds() {
    const lista = getBreeds();
    lista.then(rase => {
        for (const [key, value] of Object.entries(rase)) {
            if (value.length < 1) {
                const optiune = document.createElement('OPTION');
                optiune.innerHTML = key.toUpperCase();
                optiune.value = key;
                listaCaini.append(optiune);
                optiune.id = key;

            } else if (value.length > 0) {

                const optiune = document.createElement('OPTION');
                optiune.innerHTML = `${key.toUpperCase()} (${value.length})`;
                optiune.value = key;
                optiune.id = key;
                optiune.setAttribute('data-storage', value);
                listaCaini.append(optiune);
            }
        }
        return listaCaini;
    }).then(lista0 => {
        lista0.addEventListener('click', (e) => {

            val = e.target.value;
            if (val === 'select1' && val !== prev) {
                slider.innerHTML = "";
                slider_div.style.display = "none";

            } else if (val !== 'select1' && val !== prev) {
                slider_div.style.display = "block";
                dotsDiv.innerHTML = ''; //curatam dotsDiv de indicatoarele selectiei trecute
                slider.style.transform = 'translateX(0px)'; //resetam pozitia slideru lui in caz ca de la selectia precedenta  a ramasa fixat gresit
                const elem = document.querySelector(`#${val}`); //pentru a functiona selectarea dataset ului trebuie folosit query selector
                var hasNumber = /\d/;
                if (hasNumber.test(elem.innerHTML)) { ///verifica daca rasa selectata are alte subrase, astfel incat sa apelam getattribute doar pe optiunile ce au dataset
                    set = elem.getAttribute('data-storage').split(",");
                    slider.innerHTML = ""; ///sterge tot din slider inainte de a randa din nou
                    dotsDiv.innerHTML = ''; //stergem tot din dots div pentru a randa iar
                    set.forEach(element => {
                        const rasaSec = `${val}/${element}`;

                        if (set.length > 1) {
                            addDots(dotsDiv, rasaSec);
                            dots = Array.from(dotsDiv.children);
                            dotsDiv.children[0].classList.add('current-slide');
                            slider_div.appendChild(dotsDiv);
                        }
                        fetchBreedImg(rasaSec);
                    })

                } else if (val !== prev) {
                    slider.innerHTML = "";
                    fetchBreedImg(val);
                }
                prev = val;
            }
        })
    })
}

listBreeds();