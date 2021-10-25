const loader = document.querySelector('.loader');
const reslutsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imgContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');


// NASA API                  -------------------------------------
const count = 20;
const apiKey = 'SM4XqSFkGfYk4dg8OVRg8vBpNAoiPpIHXwVDljmP'
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let dataArray = [];
let favorites = {};

//Scroll to top, Remove loader, Show content
function showContent(page) {
  window.scrollTo({ top: 0, behavior: 'instant' })
  if (page === 'data') {
    reslutsNav.classList.remove('hidden');
    favoritesNav.classList.add('hidden');
  } else {
    favoritesNav.classList.remove('hidden');
    reslutsNav.classList.add('hidden');
  }
  loader.classList.add('hidden');
}

// Update DOM = Create a card -------------------------------------
function createDomNodes(page) {
  const currentArray = page === 'data' ? dataArray : Object.values(favorites);
  currentArray.forEach((data) => {
    // Card Container
   const card = document.createElement('div');
   card.classList.add('card');
   //Link
   const link = document.createElement('a');
   link.href = data.hdurl;
   link.title = 'View Full Image';
   link.target = '_blank';
   //Image
   const img = document.createElement('img');
   img.src = data.url;
   img.alt = 'NASA Picture of the Day';
   img.loading = 'lazy';
   img.classList.add('card-img-top');
   //Card Body
   const cardBody = document.createElement('div');
   cardBody.classList.add('card-body');
   //Card Title
   const cardTitle = document.createElement('h5');
   cardTitle.classList.add('card-title');
   cardTitle.textContent = data.title;
   //Save Text
   const saveText = document.createElement('p');
   saveText.classList.add('clickable');
    if (page === 'data') {
      saveText.textContent = 'Add To Favorites';
      saveText.setAttribute('onclick', `saveFavorite('${data.url}')`);
    } else {
      saveText.textContent = 'Remove Favorite';
      saveText.setAttribute('onclick', `removeFavorite('${data.url}')`);
   }
   //Card Text
   const cardText = document.createElement('p');
   cardText.classList.add('card-text')
   cardText.textContent = data.explanation;
   //Footer Container
   const footer = document.createElement('small');
   footer.classList.add('text-muted');
   //Date
   const date = document.createElement('strong');
   date.textContent = data.date;
   //Copyright
   const copyrightData = data.copyright === undefined ? '' : data.copyright;
   const copyright = document.createElement('span');
   copyright.textContent = ` ${copyrightData}`;
   //Append
   footer.append(date, copyright);
   cardBody.append(cardTitle, saveText,cardText, footer);
   link.appendChild(img);
   card.append(link, cardBody);
   imgContainer.appendChild(card);
 });
}

function updateDom(page) {
  //Get Favorites from localStorage
  if (localStorage.getItem('nasaFavorites')) {
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
  }
  imgContainer.textContent = '';
  createDomNodes(page);
  showContent(page);
}

//Get 20 images from NASA API ----------------------------
async function getImages() {
  //Show loader
  loader.classList.remove('hidden');
  try {
    const response = await fetch(apiUrl);
    dataArray = await response.json();
    updateDom('data');
  } catch (error){
    //Catch error here
    console.log(error);
  }
}
//Add data to favorites        ----------------------------
function saveFavorite(itemUrl) {
  //Looping through Data Array to select Favorites and see if favorites key already exists
  dataArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      //Show Save Confirmation for 2 secs
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      //Set Favorites in localStorage
      localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    }
  })
}
//Remove item from Favorites
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    updateDom('favorites');
  }
}


//On Load
getImages();