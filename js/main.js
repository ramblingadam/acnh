// ACNH DATABASE by ADAM MORSA
// twitter.com/ramblingadam
// github.com/ramblingadam 

// All fetched images, audio, and data displayed by this project are copyright Nintendo.

// Copyright Adam Morsa. All rights reserved. The code for this project is licensed under the GNU GPL v2.0 License (https://github.com/ramblingadam/acnh/blob/main/LICENSE.md)

// ! --------------- GRAB HTML ELEMENTS --------------------
// ? -------------- WELCOME SCREEN ------------------
const welcomeScreen = document.querySelector('.welcomeWindowBG')
// ? -------------- HEADER ELEMENTS ------------------
// Grab audio element for BG Music
const bgAudio = document.querySelector('#bgMusic')

// Grab music toggle button
const musicToggle = document.querySelector('#musicToggle')
// Grab now playing window
const nowPlayingBox = document.querySelector('.nowPlayingBox')
const nowPlayingSong = document.querySelector('#nowPlayingSong')

// Grab hemisphere toggle button
const hemisphereToggle = document.querySelector('#hemisphereToggle')

// * Grab main menu items
const btnList = document.querySelectorAll('nav ul li')
const btnVillagers = document.querySelector('#btnVillagers')
const btnFish = document.querySelector('#btnFish')
const btnSea = document.querySelector('#btnSea')
const btnBugs = document.querySelector('#btnBugs')
// const btnFossils = document.querySelector('#btnFossils')
// const btnArt = document.querySelector('#btnArt')
// const btnSongs = document.querySelector('#btnSongs')

// ? ------------ CONTENT GRID AREA ELEMENTS ----------------
// Grab search bar
const searchBar = document.querySelector('#search')

// Grab content grid
const contentGrid = document.querySelector('#contentGrid')


// ? ------------- BLATHERS FULL TEXT --------------------
const blathersFullWindow = document.querySelector('.blathersFullWindow')
const blathersFullCritterName = document.querySelector('#blathersFullCritterName')
const blathersFullCritterImg = document.querySelector('#blathersFullCritterImg')
const blathersFullCritterText = document.querySelector('#blathersFullCritterText')

// ! ----------------- EVENT LISTENERS ---------------
// ? ------------ Welcome Screen -------------
welcomeScreen.addEventListener('click', hideWelcome)
// ? ------------ Header UI -------------
// Music Toggle
musicToggle.addEventListener('click', toggleMusic)
// Hemisphere Toggle
hemisphereToggle.addEventListener('click', toggleHemisphere)

// Main Menu Buttons
// btnVillagers.addEventListener('click', () => {displayVillagers()})
btnVillagers.addEventListener('click', () => {
  updateCategory('Villagers')
  displayVillagers()
})
// btnFish.addEventListener('click', () => {displayFish()})
btnFish.addEventListener('click', () => {
  updateCategory('Fish')
  displayFish()
})
// btnSea.addEventListener('click', () => {displaySea()})
btnSea.addEventListener('click', () => {
  updateCategory('Sea')
  displaySea()
})
// btnBugs.addEventListener('click', () => {displayBugs()})
btnBugs.addEventListener('click', () => {
  updateCategory('Bugs')
  displayBugs()
})

// ? -----------Content Grid Area UI --------------
// Active search
searchBar.addEventListener('input', search)
searchBar.addEventListener('search', e => e.preventDefault)

// Blathers Full Text - Hide when clicked
blathersFullWindow.addEventListener('click', hideBlathersOverlay)

// ! ---------------- GLOBAL VARIABLES --------------
// Declare month reference cache. Fish, Diving, and Bugs will use this.
const monthCache = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
}
// Declare local data storage
let allVillagers
let allFish
let allSea
let allBugs

let searchCategory

// Turn on music by default.
let musicOn = true

// Set default hemisphere.
let hemisphere = 'northern'

// Store current date to check birthdays and critter availability
let now = new Date()


// ! --------------- RUN INITIAL FUNCTIONS -------------
// Start by loading villagers by default.
getVillagers()

// Grab fish data.
setTimeout(getFish, 500)
setTimeout(getSea, 750)
setTimeout(getBugs, 1000)

// Play music.
// setTimeout(musicSelection, 1200)


// ! ------------------- USER INTERFACE FUNCTIONS ----------------------
// ? ---------------- HIDE WELCOME SCREEN --------------
function hideWelcome() {
  welcomeScreen.classList.add('blathersHidden')
  setTimeout(welcomeScreen.classList.add('blathersHiddenZ') , 600)
  // ! PLAY MUSIC
  musicSelection()
}


// HEMISPHERE TOGGLE FUNCITON
function toggleHemisphere() {
  if(hemisphere === 'northern') {
    hemisphere = 'southern'
    hemisphereToggle.classList.remove('fa-earth-americas')
    hemisphereToggle.classList.add('fa-earth-oceania')
    search()
  } else {
    hemisphere = 'northern'
    hemisphereToggle.classList.remove('fa-earth-oceania')
    hemisphereToggle.classList.add('fa-earth-americas')
    search()
  }
}

// ? ----------------------- MUSIC -------------------
//  HOURLY MUSIC SELECTION
function musicSelection() {
  let weather = 'Sunny'
  let hour = String(now.getHours())
  let shortHour = hour
  if(hour.length === 1) hour = '0' + hour

  fetch(`https://acnhapi.com/v1/backgroundmusic/`)
  .then(res => res.json())
  .then(data => {
      // console.log(data)
      const musicData = data
      const musicURI = musicData[`BGM_24Hour_${hour}_${weather}`]['music_uri']
      bgAudio.src = musicURI
      bgAudio.play()
      bgAudio.addEventListener('playing', () => {displayCurrentMusic(shortHour, weather)})

  })
  .catch(err => {
      console.log(`error ${err}`)
  })
}


// NOW PLAYING WINDOW UPDATE
function displayCurrentMusic(hour, weather) {
  // console.log(hour, weather)
  nowPlayingSong.innerText = `${+hour === 0 ? '12' : +hour >= 13 ? +hour - 12 : +hour}${+hour >= 0 && hour < 11 ? 'am' : 'pm'} - ${weather}`
  nowPlayingBox.classList.remove('nowPlayingHidden')
  const hidePlayingBox = () => {nowPlayingBox.classList.add('nowPlayingHidden')}
  setTimeout(hidePlayingBox, 5000)
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
    musicSelection()
  }
}

// ACTIVE SEARCH FUNCTION
function search(e) {
  clearGrid()
  searchString = searchBar.value.toLowerCase()
  if(searchCategory === 'Villagers') {
      const filtered = allVillagers.filter(villager => {
        if(villager.name['name-USen'].toLowerCase().includes(searchString)
        || villager.personality.toLowerCase().includes(searchString)
        || villager.species.toLowerCase().includes(searchString)
        || villager['birthday-string'].toLowerCase().includes(searchString)) return true
      })
      displayVillagers(filtered)
  }
  else if(searchCategory === 'Fish') {

    const filtered = allFish.filter(fish => {

      fishMonths = buildFishMonthString(fish)

      if(fish.name['name-USen'].toLowerCase().includes(searchString)
      || fish.availability.location.toLowerCase().includes(searchString)
      || fish.availability.rarity.toLowerCase().includes(searchString)
      || fishMonths.toLowerCase().includes(searchString)
      ) return true
    })
    displayFish(filtered)
  }
  else if(searchCategory === 'Sea') {

    const filtered = allSea.filter(sea => {

      seaMonths = buildFishMonthString(sea)

      if(sea.name['name-USen'].toLowerCase().includes(searchString)
      || sea.shadow.toLowerCase().includes(searchString)
      || sea.speed.toLowerCase().includes(searchString)
      || seaMonths.toLowerCase().includes(searchString)
      ) return true
    })
    displaySea(filtered)
  }
  else if(searchCategory === 'Bugs') {

    const filtered = allBugs.filter(bug => {

      bugMonths = buildFishMonthString(bug)

      if(bug.name['name-USen'].toLowerCase().includes(searchString)
      || bug.availability.location.toLowerCase().includes(searchString)
      || bug.availability.rarity.toLowerCase().includes(searchString)
      || bugMonths.toLowerCase().includes(searchString)
      ) return true
    })
    displayBugs(filtered)
  }
}



// ! ------------------- UPDATE CURRENT CATEGORY-------------------
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
  searchCategory = category
  console.log('we in here')
  // searchBar.value = ''
}

// UPDATE SEARCHBAR TO CURRENT CATEGORY
function updateSearchBar(category) {
  const categoryClasses = ['villagers', 'fish', 'sea', 'bugs', 'fossils', 'art', 'songs']
  if(category === 'Fish') {
    searchBar.placeholder = 'Search species, location, rarity, month...'
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
  else if(category === 'Sea') {
    searchBar.placeholder = 'Search species, shadow, speed, month...'
    categoryClasses.forEach(categoryClass => {
      searchBar.classList.remove(categoryClass)
    })
    searchBar.classList.add(category.toLowerCase())
  }
  else if(category === 'Bugs') {
    searchBar.placeholder = 'Search species, location, rarity, month...'
    categoryClasses.forEach(categoryClass => {
      searchBar.classList.remove(categoryClass)
    })
    searchBar.classList.add(category.toLowerCase())
  }
  searchBar.value = ''

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
    // console.log(data)
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
  // updateCategory('Villagers')
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
    // console.log(data)
    allFish = data  
  })
  .catch(err => {
    console.log(`error ${err}`)
})
}

// DISPLAY FISH
function displayFish(fishArray = allFish) {
  // updateCategory('Fish')
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


    // Add .availableNow class if available in current month, for highlight
    if(buildFishMonthString(fish).includes(monthCache[now.getMonth() + 1])) {
      li.classList.add('availableNow')
    }

    // Add fish.id class so Blathers overlay can find and display the right info
    li.classList.add(`${fish.id}`) 
    
     // * CREATING FISH TILES
     li.innerHTML = `<h2 class="name">${fish.name['name-USen']}</h2><h4 class="location">${fish.id === 80 ? 'Sea (Raining)' : fish.availability.location} • ${fish.availability.rarity}</h4><h4 class="months"><i class="fa-solid fa-calendar-days"></i> ${monthString}</h4><h4 class="time"><i class="fa-solid fa-clock"></i> ${fish.availability.time || 'All Day'}</h4><div class="critterImgBox"><img src="${fish['icon_uri']}"><p id="salesPrice"><img src="assets/bellBag_sm1.png">&nbsp;${fish.price}</p><div class="critterHoverBox"><span class="blathersQuote">${museumStringPreview}</span><img src="assets/Blathers_Icon.png"></div></div><p class="quote">${fish['catch-phrase']}</p>`

    // CREATING BLATHERS WINDOWS
   
    

    contentGrid.appendChild(li)
    // console.log('-----')
  })
  // * Add Event Listeners to display Blathers overlay
  addBlathersOverlayListeners()
}



// ! ----------------------- SEA CREATURES --------------------

function getSea() {
  fetch(`https://acnhapi.com/v1a/sea/`)
  .then(res => res.json())
  .then(data => {
    // console.log(data)
    allSea = data  
  })
  .catch(err => {
    console.log(`error ${err}`)
})
}
function displaySea(seaArray = allSea) {
  // updateCategory('Sea')
  clearGrid()
  seaArray.forEach(sea => {
    const li = document.createElement('li')
    // console.log(li)
  
    // console.log(villager)
    li.classList.add('contentItem')
    li.classList.add('sea')   

    // Convert months into string
    const monthArray = [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    
    const seaMonths = sea.availability[`month-array-${hemisphere}`]
    let monthString
    if(seaMonths.length === 12) {
      monthString = 'All Year'
    }
    else {
      const firstMonth = monthArray[seaMonths[0]]
      const lastMonth = monthArray[seaMonths[seaMonths.length - 1]]
      monthString = `${firstMonth} - ${lastMonth}`
    }
    

    // Create museum string preview
    museumString = sea['museum-phrase']
    museumStringArray = museumString.split(' ')
    museumStringArray.length = 5
    museumStringPreview = museumStringArray.join(' ') + '...'


    // Add .availableNow class if available in current month, for highlight
    if(buildFishMonthString(sea).includes(monthCache[now.getMonth() + 1])) {
      li.classList.add('availableNow')
    }

    // Add sea.id class so Blathers overlay can find and display the right info
    li.classList.add(`${sea.id}`) 
    
     // * CREATING SEA TILES
     li.innerHTML = `<h2 class="name">${sea.name['name-USen']}</h2><h4 class="location">${sea.shadow} • ${sea.speed}</h4><h4 class="months"><i class="fa-solid fa-calendar-days"></i> ${monthString}</h4><h4 class="time"><i class="fa-solid fa-clock"></i> ${sea.availability.time || 'All Day'}</h4><div class="critterImgBox"><img src="${sea['icon_uri']}"><p id="salesPrice"><img src="assets/bellBag_sm1.png">&nbsp;${sea.price}</p><div class="critterHoverBox"><span class="blathersQuote">${museumStringPreview}</span><img src="assets/Blathers_Icon.png"></div></div><p class="quote">${sea['catch-phrase']}</p>`

    // CREATING BLATHERS WINDOWS
   
    

    contentGrid.appendChild(li)
    // console.log('-----')
  })
  addBlathersOverlayListeners()
}


// ! ----------------------------- BUGS ----------------------------
function getBugs() {
  fetch(`https://acnhapi.com/v1a/bugs/`)
  .then(res => res.json())
  .then(data => {
    // console.log(data)
    allBugs = data  
  })
  .catch(err => {
    console.log(`error ${err}`)
})
}
function displayBugs(bugArray = allBugs) {
  // updateCategory('Bugs')
  clearGrid()
  bugArray.forEach(bug => {
    const li = document.createElement('li')

    li.classList.add('contentItem')
    li.classList.add('bug')   

    // Convert months into string
    const monthArray = [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    
    const bugMonths = bug.availability[`month-array-${hemisphere}`]
    let monthString
    if(bugMonths.length === 12) {
      monthString = 'All Year'
    }
    else {
      const firstMonth = monthArray[bugMonths[0]]
      const lastMonth = monthArray[bugMonths[bugMonths.length - 1]]
      monthString = `${firstMonth} - ${lastMonth}`
    }
    

    // Create museum string preview
    museumString = bug['museum-phrase']
    museumStringArray = museumString.split(' ')
    museumStringArray.length = 5
    museumStringPreview = museumStringArray.join(' ') + '...'


    // Add .availableNow class if available in current month, for highlight
    if(buildFishMonthString(bug).includes(monthCache[now.getMonth() + 1])) {
      li.classList.add('availableNow')
    }

    // Add sea.id class so Blathers overlay can find and display the right info
    li.classList.add(`${bug.id}`) 
    
     // * CREATING BUG TILES
     li.innerHTML = `<h2 class="name">${bug.name['name-USen']}</h2><h4 class="location">${bug.id === 4 ? 'Flying' : bug.availability.location} • ${bug.availability.rarity}</h4><h4 class="months"><i class="fa-solid fa-calendar-days"></i> ${monthString}</h4><h4 class="time"><i class="fa-solid fa-clock"></i> ${bug.availability.time || 'All Day'}</h4><div class="critterImgBox"><img src="${bug['icon_uri']}"><p id="salesPrice"><img src="assets/bellBag_sm1.png">&nbsp;${bug.price}</p><div class="critterHoverBox"><span class="blathersQuote">${museumStringPreview}</span><img src="assets/Blathers_Icon.png"></div></div><p class="quote">${bug['catch-phrase']}</p>`

    contentGrid.appendChild(li)

  })
  // Add Blathers Overlay Listeners
  addBlathersOverlayListeners()
}


// !------------------------- BLATHERS OVERLAY --------------------------------


// *Adds event listeners for Blathers overlay to all critters
function addBlathersOverlayListeners() {
  document.querySelectorAll('#contentGrid li').forEach(critter => {
    critter.addEventListener('click', displayBlathersOverlay)
  })
}

// *Hide Blathers Overlay when overlay clicked on
function hideBlathersOverlay() {
  blathersFullWindow.classList.add('blathersHidden')
  setTimeout(blathersFullWindow.classList.add('blathersHiddenZ'), 600)
}

// *Display Blathers overlay when critter item clicked
function displayBlathersOverlay(e) {

  let critterLiElement

  // console.log(e.composedPath())

  // Iterate through each element in the event path (except the last two, which are always #document and Window), searching for the
  let path = e.path || (e.composedPath())
  // console.log(path)
  for(let i = 0; i < path.length - 2 ; i++) {
    const element = path[i]
    // console.log(element)
      if(element.matches('li')) {
        critterLiElement = element
      }
  }
  let critterLiElementClasses = Array.from(critterLiElement.classList) // Grab classlist of the content item and convert that list into an array
  // console.log(critterLiElementClasses)
  const critterID = +critterLiElementClasses.pop() // Grab the last item from the classlist, which should be the fish ID num
  // console.log(critterID)

  switch(searchCategory) {
    case 'Fish': critterArray = allFish
    break
    case 'Sea': critterArray = allSea
    break
    case 'Bugs': critterArray = allBugs
    break
    // case 'Fossils': critterArray = allFish
    // break
    // case 'Art': critterArray = allFish
    // break
  }

  const currentCritter = critterArray[critterID - 1]
  // console.log(currentCritter)

  // console.log(critterLiElement)
  // Update information in Blathers overlay
  blathersFullCritterImg.src = ''
  blathersFullCritterImg.src = currentCritter['image_uri']
  blathersFullCritterName.innerText = currentCritter.name['name-USen']
  blathersFullCritterText.innerText = currentCritter['museum-phrase']

  // Remove hidden classes to display Blathers overlay
  blathersFullWindow.classList.remove('blathersHiddenZ')
  blathersFullWindow.classList.remove('blathersHidden')
}

// * HELPER FUNCTION - BUILD CRITTER MONTH STRING
function buildFishMonthString(fish) {
  let fishMonths = []
  if(fish.availability.isAllYear === true) {
    for(let key in monthCache) fishMonths.push(monthCache[key])
  }
  else {
    fish.availability[`month-array-${hemisphere}`].forEach(monthNum => {
      fishMonths.push(monthCache[monthNum])
    })
  }
  fishMonths = fishMonths.join('')
  return fishMonths
}