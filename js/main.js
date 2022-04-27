// ! --------------- GRAB HTML ELEMENTS --------------------
// Grab audio element for BG Music
const bgAudio = document.querySelector('#bgMusic')

// Grab music toggle button
const musicToggle = document.querySelector('#musicToggle')

// Grab hemisphere toggle button
const hemisphereToggle = document.querySelector('#hemisphereToggle')

// * Grab main menu items
const btnList = document.querySelectorAll('nav ul li')
const btnVillagers = document.querySelector('#btnVillagers')
const btnFish = document.querySelector('#btnFish')
// const btnSea = document.querySelector('#btnSea')
// const btnFossils = document.querySelector('#btnFossils')
// const btnArt = document.querySelector('#btnArt')
// const btnSongs = document.querySelector('#btnSongs')


// Grab search bar
const searchForm = document.querySelector('form')
const searchBar = document.querySelector('#search')


// Grab content grid
const contentGrid = document.querySelector('#contentGrid')


// ! ----------------- EVENT LISTENERS ---------------
// Music Toggle
musicToggle.addEventListener('click', toggleMusic)
// Hemisphere Toggle
hemisphereToggle.addEventListener('click', toggleHemisphere)

// Main Menu Buttons
btnVillagers.addEventListener('click', () => {displayVillagers()})
btnFish.addEventListener('click', () => {displayFish()})

// Active search
searchBar.addEventListener('input', search)


// ! ---------------- GLOBAL VARIABLES --------------
// Declare villager data storage
let allVillagers
let allFish
let allSea
let allBugs



// Turn on music by default.
let musicOn = true

let hemisphere = 'northern'

// Store current date to check birthdays
let now = new Date()


// ! --------------- RUN INITIAL FUNCTIONS -------------
// Start by loading villagers by default.
getVillagers()

// Grab fish data.
getFish()

// Play music.
setTimeout(musicSelection, 1000)


// ! ------------------ INITIALIZATION --------------------

//  HOURLY MUSIC SELECTION
function musicSelection() {
  let weather = 'Sunny'
  let hour = String(now.getHours())
  if(hour.length === 1) hour = '0' + hour

  console.log(hour)

  fetch(`https://acnhapi.com/v1/backgroundmusic/`)
  .then(res => res.json())
  .then(data => {
      console.log(data)
      const musicData = data
      const musicURI = musicData[`BGM_24Hour_${hour}_${weather}`]['music_uri']
      console.log(musicURI)
      bgAudio.src = musicURI
      // bgAudio.play()

  })
  .catch(err => {
      console.log(`error ${err}`)
  })
}


// ! ------------------- USER INTERFACE FUNCTIONS ----------------------
// HEMISPHERE TOGGLE FUNCITON
function toggleHemisphere() {
  if(hemisphere === 'northern') {
    hemisphere = 'southern'
    hemisphereToggle.classList.remove('fa-earth-americas')
    hemisphereToggle.classList.add('fa-earth-oceania')
    displayFish()
  } else {
    hemisphere = 'northern'
    hemisphereToggle.classList.remove('fa-earth-oceania')
    hemisphereToggle.classList.add('fa-earth-americas')
    displayFish()
  }
}

// MUSIC TOGGLE FUNCTION
function toggleMusic() {
  if(musicOn) {
    musicOn = false
    musicToggle.classList.remove('fa-volume-high')
    musicToggle.classList.add('fa-volume-xmark')
    bgAudio.pause()
  } else {
    musicOn = true
    musicToggle.classList.remove('fa-volume-xmark')
    musicToggle.classList.add('fa-volume-high')
    bgAudio.play()
  }
}

// ACTIVE SEARCH FUNCTION
function search(e) {
  clearGrid()
  searchString = e.target.value.toLowerCase()
  const filtered = allVillagers.filter(villager => {
    if(villager.name['name-USen'].toLowerCase().includes(searchString)
    || villager.personality.toLowerCase().includes(searchString)
    || villager.species.toLowerCase().includes(searchString)
    || villager['birthday-string'].toLowerCase().includes(searchString)) return true
  })
  displayVillagers(filtered)
}

// UPDATE CURRENT CATEGORY
function updateCategory(category) {
  btnList.forEach(btn => {
    if(btn.matches(`#btn${category}`)) {
      btn.classList.add('currentCategory')
      updateSearchBar(category)
    }
    else {
      btn.classList.remove('currentCategory')
    }
  })
}

// UPDATE SEARCHBAR TO CURRENT CATEGORY
function updateSearchBar(category) {
  const categoryClasses = ['villagers', 'fish', 'sea', 'bugs', 'fossils', 'art', 'songs']
  if(category === 'Fish') {
    searchBar.placeholder = 'Search species, location, month, time...'
    categoryClasses.forEach(categoryClass => {
      searchBar.classList.remove(categoryClass)
    })
    searchBar.classList.add(category.toLowerCase())
    
  }
  else if(category === 'Villagers') {
    searchBar.placeholder = 'Search name, species, personality, birthday...'
    categoryClasses.forEach(categoryClass => {
      searchBar.classList.remove(categoryClass)
    })
    searchBar.classList.add(category.toLowerCase())
  }
}

//  CLEAR CONTENT GRID
function clearGrid() {
  items = document.querySelectorAll('.contentItem')
  items.forEach(item => item.remove())
}


// ! -------------------- VILLAGERS FUNCTIONS ----------------------

// GRAB VILLAGER DATA
function getVillagers() {
  fetch(`https://acnhapi.com/v1a/villagers/`)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    allVillagers = data

    // Run villager display function
    displayVillagers(allVillagers)
  
  })
  .catch(err => {
    console.log(`error ${err}`)
})
}

// DISPLAY VILLAGERS
function displayVillagers(villagerArray = allVillagers) {
  console.log(villagerArray)

  updateCategory('Villagers')
  clearGrid()
  villagerArray.forEach(villager => {
    const li = document.createElement('li')
    // console.log(li)
  
    // console.log(villager)
    li.classList.add('contentItem')
    li.classList.add('villager')   


    // Check if the villager has a birthday this month. If so, add the birthdayMonth class via template literal.
    // First create a birthday string JS can read.
    const birthday = new Date(villager['birthday-string'].slice(0,-2) + ', ' + now.getFullYear())
    // Init birthdayMonth string for template literal to be empty.
    let birthdayMonth = ''
    if(birthday.getMonth() === now.getMonth()) {
      // console.log(`${villager.name['name-USen']}'s birthday is this month!`)
      // birthdayMonth = ' birthdayMonth'
      li.classList.add('birthdayMonth')
      if(birthday.getDate() === now.getDate()) {
        li.classList.add('birthdayDay')
      }
    }    

    // Determine gender
    let genderString
    if(villager.gender === 'Male') genderString = '<i class="fa-solid fa-mars"></i>'
    else genderString = '<i class="fa-solid fa-venus"></i>'

    // CREATING VILLAGER TILES
    li.innerHTML = `<h2 class="name">${villager.name['name-USen']}</h2><h4 class="personality">${genderString}${villager.personality}</h4><h4 class="birthday${birthdayMonth}"><i class="fa-solid fa-cake-candles"></i> ${villager['birthday-string']}</h4><div class="villagerImgBox"><img src="${villager['image_uri']}"><div class="catchphraseBox"><span class="catchphrase">"${villager['catch-phrase']}!"</span><img src="${villager['icon_uri']}"></div></div><p class="quote">${villager.saying}</p>`

    

    contentGrid.appendChild(li)
    // console.log('-----')
    // console.log(now.toLocaleString())
  })
}

// ! -------------------------- FISH FUNCTIONS ---------------------------

// GRAB FISH DATA
function getFish() {
  fetch(`https://acnhapi.com/v1a/fish/`)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    allFish = data  
  })
  .catch(err => {
    console.log(`error ${err}`)
})
}

// DISPLAY FISH
function displayFish(fishArray = allFish) {
  updateCategory('Fish')
  clearGrid()
  fishArray.forEach(fish => {
    const li = document.createElement('li')
    // console.log(li)
  
    // console.log(villager)
    li.classList.add('contentItem')
    li.classList.add('fish')   

    // Convert months into string
    const monthArray = [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    
    const fishMonths = fish.availability[`month-array-${hemisphere}`]
    let monthString
    if(fishMonths.length === 12) {
      monthString = 'All Year'
    }
    else {
      const firstMonth = monthArray[fishMonths[0]]
      const lastMonth = monthArray[fishMonths[fishMonths.length - 1]]
      monthString = `${firstMonth} - ${lastMonth}`
    }
    

    // Create museum string preview
    museumString = fish['museum-phrase']
    museumStringArray = museumString.split(' ')
    museumStringArray.length = 5
    museumStringPreview = museumStringArray.join(' ') + '...'
    
    // CREATING FISH TILES
    li.innerHTML = `<h2 class="name">${fish.name['name-USen']}</h2><h4 class="location">${fish.availability.location} • ${fish.availability.rarity}</h4><h4 class="months">${monthString}</h4><h4 class="time">${fish.availability.time || 'All Day'}</h4><div class="critterImgBox"><img src="${fish['icon_uri']}"><div class="critterHoverBox"><span class="blathersQuote">${museumStringPreview}</span><img src="assets/Blathers_Icon.png"></div></div><p class="quote">${fish['catch-phrase']}</p>`

    

    contentGrid.appendChild(li)
    // console.log('-----')
    // console.log(now.toLocaleString())
  })
}