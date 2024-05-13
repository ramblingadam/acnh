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
const bgAudioSunny = document.querySelector('#bgMusicSunny')
const bgAudioRainy = document.querySelector('#bgMusicRainy')

// Grab music toggle button
const musicToggle = document.querySelector('#musicToggle')
const infoBtn = document.querySelector('#infoBtn')
// Grab now playing window
const nowPlayingBox = document.querySelector('.nowPlayingBox')
const nowPlayingSong = document.querySelector('#nowPlayingSong')

// Grab hemisphere toggle button
const hemisphereToggle = document.querySelector('#hemisphereToggle')

// * Grab main menu items
const btnList = document.querySelectorAll('nav ul li')
const btnVillagers = document.querySelectorAll('.btnVillagers')
const btnFish = document.querySelectorAll('.btnFish')
const btnSea = document.querySelectorAll('.btnSea')
const btnBugs = document.querySelectorAll('.btnBugs')
const btnFossils = document.querySelectorAll('.btnFossils')
const btnArt = document.querySelectorAll('.btnArt')
// const btnSongs = document.querySelector('#btnSongs')

// ? ------------ CONTENT GRID AREA ELEMENTS ----------------
// Grab search bar
const searchBar = document.querySelector('#search')

// Grab content grid
const contentGrid = document.querySelector('#contentGrid')

// ? ------------- BLATHERS FULL TEXT --------------------
const blathersFullWindow = document.querySelector('.blathersFullWindow')
const blathersFullCritterName = document.querySelector(
  '#blathersFullCritterName'
)
const blathersFullCritterImg = document.querySelector('#blathersFullCritterImg')
const blathersFullCritterText = document.querySelector(
  '#blathersFullCritterText'
)

// ! ----------------- EVENT LISTENERS ---------------
// ? ------------ Welcome Screen -------------
welcomeScreen.addEventListener('click', hideWelcome)
infoBtn.addEventListener('click', showWelcome)
// ? ------------ Header UI -------------
// Music Toggle
musicToggle.addEventListener('click', toggleMusic)
// Hemisphere Toggle
hemisphereToggle.addEventListener('click', toggleHemisphere)

// Main Menu Buttons
btnVillagers.forEach((btn) =>
  btn.addEventListener('click', () => {
    updateCategory('Villagers')
    displayVillagers()
  })
)

btnFish.forEach((btn) =>
  btn.addEventListener('click', () => {
    updateCategory('Fish')
    displayFish()
  })
)

btnSea.forEach((btn) =>
  btn.addEventListener('click', () => {
    updateCategory('Sea')
    displaySea()
  })
)
btnBugs.forEach((btn) =>
  btn.addEventListener('click', () => {
    updateCategory('Bugs')
    displayBugs()
  })
)
btnFossils.forEach((btn) =>
  btn.addEventListener('click', () => {
    updateCategory('Fossils')
    displayFossils()
  })
)
btnArt.forEach((btn) =>
  btn.addEventListener('click', () => {
    updateCategory('Art')
    displayArt()
  })
)

// ? -----------Content Grid Area UI --------------
// Active search
searchBar.addEventListener('input', search)
searchBar.addEventListener('search', (e) => e.preventDefault)

// Blathers Full Text - Hide when clicked
blathersFullWindow.addEventListener('click', hideBlathersOverlay)

// ! ---------------- GLOBAL VARIABLES --------------
// API root route. change this if API hosting location changes- ie, from localhost to heroku, or from heroku to something that's still free. :)
// const API_ROOT = 'http://localhost:8000'
const API_ROOT = 'https://acnh-mini-api.herokuapp.com'
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
let allFossils
let allArt
let allMusic
let weather = 'Sunny'

let searchCategory

// Turn on music by default.
let musicOn = true

// Set default hemisphere.
let hemisphere = 'northern'

// Store current date to check birthdays and critter availability
let now = new Date()

// ! --------------- RUN INITIAL FUNCTIONS -------------
// Start by loading villagers by default.
getMusic()
getVillagers()
updateCategory('Villagers')

// Fetch data for other categories.
setTimeout(getFish, 150)
setTimeout(getSea, 300)
setTimeout(getBugs, 450)
setTimeout(getFossils, 600)
setTimeout(getArt, 750)

// ! ------------------- USER INTERFACE FUNCTIONS ----------------------
// ? ---------------- HIDE WELCOME SCREEN --------------
function hideWelcome() {
  welcomeScreen.classList.add('blathersHidden')
  setTimeout(welcomeScreen.classList.add('blathersHiddenZ'), 600)
  // ! PLAY MUSIC
  musicOn === true ? music.play() : null
}
function showWelcome() {
  welcomeScreen.classList.remove('blathersHidden')
  welcomeScreen.classList.remove('blathersHiddenZ')
}

// ? --------- HEMISPHERE TOGGLE -----------
function toggleHemisphere() {
  if (hemisphere === 'northern') {
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
function getMusic() {
  // fetch(`https://acnhapi.com/v1/backgroundmusic/`)
  fetch(`${API_ROOT}/api/music`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
      allMusic = data
      music.getCurrentTrack()
    })
    .catch((err) => {
      console.log(`error ${err}`)
    })
}
//  HOURLY MUSIC SELECTION (About time we got some OOP in here)
const music = {
  // ? ---- DETERMINE/PRELOAD CURRENT SUNNY & RAINY TRACKS -----
  async getCurrentTrack(musicData = allMusic) {
    const musicRoute = `${API_ROOT}/api/music/hourly`
    let hour = String(now.getHours())
    this.shortHour = hour
    if (hour.length === 1) hour = '0' + hour

    //// SUNNY
    await fetch(`${musicRoute}/${hour}/sunny`)
      .then((response) => {
        if (response.ok) {
          return response.blob() // Convert the response to a blob
        }
        throw new Error('Network response was not ok.')
      })
      .then((blob) => {
        const musicUrl = URL.createObjectURL(blob)

        let sunnyAudio = document.createElement('audio')
        sunnyAudio.src = musicUrl
        sunnyAudio.preload = 'auto'
        sunnyAudio.loop = true
        sunnyAudio.id = 'sunnyAudio'

        document.body.appendChild(sunnyAudio)
      })
      .catch((error) => {
        console.log('Fetch error:', error.message)
      })

    //// RAINY
    await fetch(`${musicRoute}/${hour}/rainy`)
      .then((response) => {
        if (response.ok) {
          return response.blob()
        }
        throw new Error('Network response was not ok.')
      })
      .then((blob) => {
        const musicUrl = URL.createObjectURL(blob)

        let rainyAudio = document.createElement('audio')
        rainyAudio.src = musicUrl
        rainyAudio.preload = 'auto'
        rainyAudio.loop = true
        rainyAudio.id = 'rainyAudio'

        document.body.appendChild(rainyAudio)
      })
      .catch((error) => {
        console.log('Fetch error:', error.message)
      })

    document.body.appendChild(sunnyAudio)
    document.body.appendChild(rainyAudio)
  },

  play() {
    switch (weather) {
      case 'Sunny':
        document.querySelector('#sunnyAudio').play()
        document.querySelector('#rainyAudio').pause()
        break
      case 'Rainy':
        document.querySelector('#sunnyAudio').pause()
        document.querySelector('#rainyAudio').play()
        break
    }

    // Display Now Playing popup whenever a track starts playing.
    document.querySelectorAll('audio').forEach((audio) =>
      audio.addEventListener('playing', () => {
        displayCurrentMusic(this.shortHour, weather)
      })
    )
  },

  pause() {
    rainyAudio.pause()
    sunnyAudio.pause()
  },
}

// NOW PLAYING WINDOW UPDATE
function displayCurrentMusic(hour, weather) {
  // console.log(hour, weather)
  nowPlayingSong.innerText = `${
    +hour === 0 ? '12' : +hour >= 13 ? +hour - 12 : +hour
  }${+hour >= 0 && hour < 11 ? 'am' : 'pm'} - ${weather}`
  nowPlayingBox.classList.remove('nowPlayingHidden')
  const hidePlayingBox = () => {
    nowPlayingBox.classList.add('nowPlayingHidden')
  }
  setTimeout(hidePlayingBox, 4000)
}

// MUSIC TOGGLE FUNCTION
function toggleMusic() {
  if (musicOn) {
    musicOn = false
    musicToggle.classList.remove('fa-volume-high')
    musicToggle.classList.add('fa-volume-xmark')
    music.pause()
  } else {
    musicOn = true
    musicToggle.classList.remove('fa-volume-xmark')
    musicToggle.classList.add('fa-volume-high')
    music.play()
  }
}

// ? ------------------- WEATHER EFFECTS ------------------
const weatherBtn = document.querySelector('#weatherBtn')
weatherBtn.addEventListener('click', () => {
  weather === 'Sunny' ? rain.start() : rain.stop()
})
const rain = {
  start() {
    weather = 'Rainy'
    weatherBtn.classList.remove('fa-cloud-showers-heavy')
    weatherBtn.classList.add('fa-sun')

    // document.querySelector('header').classList.add('raining')
    document.querySelector('body').classList.add('raining')

    let hrElement
    let counter = 100
    for (let i = 0; i < counter; i++) {
      hrElement = document.createElement('hr')

      hrElement.style.left =
        Math.floor(Math.random() * window.innerWidth) + 'px'
      hrElement.style.animationDuration = 1.6 + Math.random() * 0.3 + 's'
      hrElement.style.animationDelay = Math.random() * 5 + 's'

      document.querySelector('header').appendChild(hrElement)
      // document.querySelector('body').appendChild(hrElement);
    }
    // If music is on, run play function to swap to appropriate weather track.
    musicOn === true ? music.play() : null
  },

  stop() {
    weather = 'Sunny'
    weatherBtn.classList.add('fa-cloud-showers-heavy')
    weatherBtn.classList.remove('fa-sun')

    // document.querySelector('header').classList.remove('raining')
    document.querySelector('body').classList.remove('raining')

    document.querySelectorAll('hr').forEach((raindrop) => raindrop.remove())

    musicOn === true ? music.play() : null
  },
}

// ? -------------------- RANDOM CHARACTER SPY ------------------
let charArray = [
  'blathers',
  'booker',
  'brewster',
  'celeste',
  'chip',
  'cj',
  'copper',
  'cyrus',
  'daisymae',
  'digby',
  'don',
  'flick',
  'franklin',
  'gracie',
  'grams',
  'gulivaar',
  'gulliver',
  'harriet',
  'harvey',
  'isabelle',
  'jack',
  'jingle',
  'joan',
  'kappn',
  'katie',
  'katrina',
  'kicks',
  'kk',
  'kkdj',
  'label',
  'leif',
  'leila',
  'leilani',
  'lottie',
  'luna',
  'lyle',
  'mable',
  'nat',
  'niko',
  'nooklings',
  'orville',
  'pave',
  'pelly',
  'pete',
  'phineas',
  'phyllis',
  'porter',
  'redd',
  'reese',
  'resetti',
  'rover',
  'sable',
  'sahara',
  'shrunk',
  'tom',
  'tortimer',
  'wardell',
  'wendell',
  'wilbur',
  'wisp',
  'zipper',
]
// Awesome shuffle function from https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  let m = array.length
  let t
  let i

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m)
    m--

    // And swap it with the current element.
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }

  return array
}

charArray = shuffle(charArray)
charArrayIndex = 0
setInterval(peekaboo, 25000)

function peekaboo() {
  const spy = document.querySelector('#spy')
  spy.src = `assets/char_${charArray[charArrayIndex]}.png`
  if (charArrayIndex < charArray.length - 1) {
    charArrayIndex += 1
  } else charArrayIndex = 0
  spy.classList.add('peekaboo')
  spy.addEventListener('animationend', removePeekaboo)
}
function removePeekaboo() {
  document.querySelector('#spy').classList.remove('peekaboo')
}

// ! -------------------------- ACTIVE SEARCH ---------------------
function search(e) {
  clearGrid()
  searchString = searchBar.value.toLowerCase()

  if (searchCategory === 'Villagers') {
    const filtered = allVillagers.filter((villager) => {
      if (
        villager.name.toLowerCase().includes(searchString) ||
        villager.personality.toLowerCase().includes(searchString) ||
        villager.species.toLowerCase().includes(searchString) ||
        villager.birthday.toLowerCase().includes(searchString) ||
        villager.birthdayString.toLowerCase().includes(searchString)
      )
        return true
    })
    displayVillagers(filtered)
  } else if (searchCategory === 'Fish') {
    const filtered = allFish.filter((fish) => {
      fishMonths = buildCritterMonthString(fish)

      if (
        fish.name['name-USen'].toLowerCase().includes(searchString) ||
        fish.availability.location.toLowerCase().includes(searchString) ||
        fish.availability.rarity.toLowerCase().includes(searchString) ||
        fishMonths.toLowerCase().includes(searchString)
      )
        return true
    })
    displayFish(filtered)
  } else if (searchCategory === 'Sea') {
    const filtered = allSea.filter((sea) => {
      seaMonths = buildCritterMonthString(sea)

      if (
        sea.name['name-USen'].toLowerCase().includes(searchString) ||
        sea.shadow.toLowerCase().includes(searchString) ||
        sea.speed.toLowerCase().includes(searchString) ||
        seaMonths.toLowerCase().includes(searchString)
      )
        return true
    })
    displaySea(filtered)
  } else if (searchCategory === 'Bugs') {
    const filtered = allBugs.filter((bug) => {
      bugMonths = buildCritterMonthString(bug)

      if (
        bug.name['name-USen'].toLowerCase().includes(searchString) ||
        bug.availability.location.toLowerCase().includes(searchString) ||
        bug.availability.rarity.toLowerCase().includes(searchString) ||
        bugMonths.toLowerCase().includes(searchString)
      )
        return true
    })
    displayBugs(filtered)
  } else if (searchCategory === 'Fossils') {
    const filtered = allFossils.filter((fossil) => {
      if (fossil.name['name-USen'].toLowerCase().includes(searchString))
        return true
    })
    displayFossils(filtered)
  } else if (searchCategory === 'Art') {
    const filtered = allArt.filter((art) => {
      if (art.name['name-USen'].toLowerCase().includes(searchString))
        return true
    })
    displayArt(filtered)
  }
}

// ! ------------------- UPDATE CURRENT CATEGORY-------------------
function updateCategory(category) {
  btnList.forEach((btn) => {
    if (btn.matches(`.btn${category}`)) {
      btn.classList.add('currentCategory')
      updateSearchBar(category)
    } else {
      btn.classList.remove('currentCategory')
    }
  })
  searchCategory = category
}

// UPDATE SEARCHBAR TO CURRENT CATEGORY
function updateSearchBar(category) {
  const categoryClasses = [
    'villagers',
    'fish',
    'sea',
    'bugs',
    'fossils',
    'art',
    'songs',
  ]
  if (category === 'Fish') {
    searchBar.placeholder = 'Search species, location, rarity, month...'
    categoryClasses.forEach((categoryClass) => {
      searchBar.classList.remove(categoryClass)
    })
    searchBar.classList.add(category.toLowerCase())
  } else if (category === 'Villagers') {
    searchBar.placeholder = 'Search name, species, personality, birthday...'
    categoryClasses.forEach((categoryClass) => {
      searchBar.classList.remove(categoryClass)
    })
    searchBar.classList.add(category.toLowerCase())
  } else if (category === 'Sea') {
    searchBar.placeholder = 'Search species, shadow, speed, month...'
    categoryClasses.forEach((categoryClass) => {
      searchBar.classList.remove(categoryClass)
    })
    searchBar.classList.add(category.toLowerCase())
  } else if (category === 'Bugs') {
    searchBar.placeholder = 'Search species, location, rarity, month...'
    categoryClasses.forEach((categoryClass) => {
      searchBar.classList.remove(categoryClass)
    })
    searchBar.classList.add(category.toLowerCase())
  } else if (category === 'Fossils') {
    searchBar.placeholder = 'Search fossil name...'
    categoryClasses.forEach((categoryClass) => {
      searchBar.classList.remove(categoryClass)
    })
    searchBar.classList.add(category.toLowerCase())
  } else if (category === 'Art') {
    searchBar.placeholder = 'Search artwork name...'
    categoryClasses.forEach((categoryClass) => {
      searchBar.classList.remove(categoryClass)
    })
    searchBar.classList.add(category.toLowerCase())
  }
  searchBar.value = ''
}

//  CLEAR CONTENT GRID
function clearGrid() {
  items = document.querySelectorAll('.contentItem')
  items.forEach((item) => item.remove())
}

// ! -------------------- VILLAGERS FUNCTIONS ----------------------

// GRAB VILLAGER DATA
function getVillagers() {
  // fetch(`https://acnhapi.com/v1a/villagers/`)
  fetch(`${API_ROOT}/api/villagers`)
    .then((res) => res.json())
    .then((data) => {
      allVillagers = data

      allVillagers.sort((a, b) => {
        if (a.species !== b.species) return a.species.localeCompare(b.species)
        else return a.name.localeCompare(b.name)
      })
      // Run villager display function
      displayVillagers(allVillagers)
    })
    .catch((err) => {
      console.log(`error ${err}`)
    })
}

// DISPLAY VILLAGERS
function displayVillagers(villagerArray = allVillagers) {
  clearGrid()
  villagerArray.forEach((villager) => {
    const li = document.createElement('li')
    li.classList.add('contentItem')
    li.classList.add('villager')

    const {
      name,
      gender,
      personality,
      photoImage,
      iconImage,
      catchphrase,
      favoriteSaying,
      birthdayString,
      birthdayDateString,
    } = villager

    const birthdayDate = new Date(birthdayDateString)

    if (birthdayDate.getMonth() === now.getMonth()) {
      li.classList.add('birthdayMonth')
      if (birthdayDate.getDate() === now.getDate()) {
        li.classList.add('birthdayDay')
      }
    }

    // Determine gender
    let genderString
    if (gender === 'Male') genderString = '<i class="fa-solid fa-mars"></i>'
    else genderString = '<i class="fa-solid fa-venus"></i>'

    li.innerHTML = `<h2 class="name">${name}</h2><h4 class="personality">${genderString}${personality}</h4><h4 class="birthday"><i class="fa-solid fa-cake-candles"></i> ${birthdayString}</h4><div class="villagerImgBox"><img src="${photoImage}"><div class="catchphraseBox"><span class="catchphrase">"${catchphrase}!"</span><img src="${iconImage}"></div></div><p class="quote">${favoriteSaying}</p>`

    contentGrid.appendChild(li)
  })
}

// ! -------------------------- FISH FUNCTIONS ---------------------------

// GRAB FISH DATA
function getFish() {
  // fetch(`https://acnhapi.com/v1a/fish/`)
  fetch(`${API_ROOT}/api/fish/`)
    .then((res) => res.json())
    .then((data) => {
      allFish = data
    })
    .catch((err) => {
      console.log(`error ${err}`)
    })
}

// DISPLAY FISH
function displayFish(fishArray = allFish) {
  clearGrid()
  fishArray.forEach((fish) => {
    const li = document.createElement('li')

    li.classList.add('contentItem')
    li.classList.add('fish')

    // Convert months into string
    const monthArray = [
      null,
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    const fishMonths = fish.availability[`month-array-${hemisphere}`]
    let monthString
    if (fishMonths.length === 12) {
      monthString = 'All Year'
    } else {
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
    if (
      buildCritterMonthString(fish).includes(monthCache[now.getMonth() + 1])
    ) {
      li.classList.add('availableNow')
    }

    // Add fish.id class so Blathers overlay can find and display the right info
    li.classList.add(`${fish.id}`)

    // * CREATING FISH TILES
    li.innerHTML = `<h2 class="name">${
      fish.name['name-USen']
    }</h2><h4 class="location">${
      fish.id === 80 ? 'Sea (Raining)' : fish.availability.location
    } • ${
      fish.availability.rarity
    }</h4><h4 class="months"><i class="fa-solid fa-calendar-days"></i> ${monthString}</h4><h4 class="time"><i class="fa-solid fa-clock"></i> ${
      fish.availability.time || 'All Day'
    }</h4><div class="critterImgBox"><img src="${
      fish['icon_uri']
    }"><p id="salesPrice"><img src="assets/bellBag_sm1.png">&nbsp;${
      fish.price
    }</p><div class="critterHoverBox"><span class="blathersQuote">${museumStringPreview}</span><img src="assets/Blathers_Icon.png"></div></div><p class="quote">${
      fish['catch-phrase']
    }</p>`

    contentGrid.appendChild(li)
  })
  // Add Blathers Overlay Listeners
  addBlathersOverlayListeners()
}

// ! ----------------------- SEA CREATURES --------------------

function getSea() {
  // fetch(`https://acnhapi.com/v1a/sea/`)
  fetch(`${API_ROOT}/api/sea/`)
    .then((res) => res.json())
    .then((data) => {
      allSea = data
    })
    .catch((err) => {
      console.log(`error ${err}`)
    })
}

function displaySea(seaArray = allSea) {
  clearGrid()
  seaArray.forEach((sea) => {
    const li = document.createElement('li')

    li.classList.add('contentItem')
    li.classList.add('sea')

    // Convert months into string
    const monthArray = [
      null,
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    const seaMonths = sea.availability[`month-array-${hemisphere}`]
    let monthString
    if (seaMonths.length === 12) {
      monthString = 'All Year'
    } else {
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
    if (buildCritterMonthString(sea).includes(monthCache[now.getMonth() + 1])) {
      li.classList.add('availableNow')
    }

    // Add sea.id class so Blathers overlay can find and display the right info
    li.classList.add(`${sea.id}`)

    // * CREATING SEA TILES
    li.innerHTML = `<h2 class="name">${
      sea.name['name-USen']
    }</h2><h4 class="location">${sea.shadow} • ${
      sea.speed
    }</h4><h4 class="months"><i class="fa-solid fa-calendar-days"></i> ${monthString}</h4><h4 class="time"><i class="fa-solid fa-clock"></i> ${
      sea.availability.time || 'All Day'
    }</h4><div class="critterImgBox"><img src="${
      sea['icon_uri']
    }"><p id="salesPrice"><img src="assets/bellBag_sm1.png">&nbsp;${
      sea.price
    }</p><div class="critterHoverBox"><span class="blathersQuote">${museumStringPreview}</span><img src="assets/Blathers_Icon.png"></div></div><p class="quote">${
      sea['catch-phrase']
    }</p>`

    contentGrid.appendChild(li)
  })
  // Add Blathers Overlay Listeners
  addBlathersOverlayListeners()
}

// ! ----------------------------- BUGS ----------------------------
function getBugs() {
  // fetch(`https://acnhapi.com/v1a/bugs/`)
  fetch(`${API_ROOT}/api/bugs/`)
    .then((res) => res.json())
    .then((data) => {
      allBugs = data
    })
    .catch((err) => {
      console.log(`error ${err}`)
    })
}

function displayBugs(bugArray = allBugs) {
  clearGrid()
  bugArray.forEach((bug) => {
    const li = document.createElement('li')

    li.classList.add('contentItem')
    li.classList.add('bug')

    // Convert months into string
    const monthArray = [
      null,
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    const bugMonths = bug.availability[`month-array-${hemisphere}`]
    let monthString
    if (bugMonths.length === 12) {
      monthString = 'All Year'
    } else {
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
    if (buildCritterMonthString(bug).includes(monthCache[now.getMonth() + 1])) {
      li.classList.add('availableNow')
    }

    // Add sea.id class so Blathers overlay can find and display the right info
    li.classList.add(`${bug.id}`)

    // * CREATING BUG TILES
    li.innerHTML = `<h2 class="name">${
      bug.name['name-USen']
    }</h2><h4 class="location">${
      bug.id === 4 ? 'Flying' : bug.availability.location
    } • ${
      bug.availability.rarity
    }</h4><h4 class="months"><i class="fa-solid fa-calendar-days"></i> ${monthString}</h4><h4 class="time"><i class="fa-solid fa-clock"></i> ${
      bug.availability.time || 'All Day'
    }</h4><div class="critterImgBox"><img src="${
      bug['icon_uri']
    }"><p id="salesPrice"><img src="assets/bellBag_sm1.png">&nbsp;${
      bug.price
    }</p><div class="critterHoverBox"><span class="blathersQuote">${museumStringPreview}</span><img src="assets/Blathers_Icon.png"></div></div><p class="quote">${
      bug['catch-phrase']
    }</p>`

    contentGrid.appendChild(li)
  })
  // Add Blathers Overlay Listeners
  addBlathersOverlayListeners()
}

// !-------------------------- FOSSILS -----------------------
function getFossils() {
  // fetch(`https://acnhapi.com/v1a/fossils/`)
  fetch(`${API_ROOT}/api/fossils/`)
    .then((res) => res.json())
    .then((data) => {
      allFossils = data
    })
    .catch((err) => {
      console.log(`error ${err}`)
    })
}
function displayFossils(fossilArray = allFossils) {
  clearGrid()
  fossilArray.forEach((fossil) => {
    const li = document.createElement('li')

    li.classList.add('contentItem')
    li.classList.add('fossil')

    // Create museum string preview
    museumString = fossil['museum-phrase']
    museumStringArray = museumString.split(' ')
    museumStringArray.length = 5
    museumStringPreview = museumStringArray.join(' ') + '...'

    // Add fossil.id class so Blathers overlay can find and display the right info
    li.classList.add(`${fossil['file-name']}`)

    // * CREATING FOSSIL TILES
    li.innerHTML = `<h2 class="name">${fossil.name['name-USen']}</h2><div class="critterImgBox"><img src="${fossil['image_uri']}"><p id="salesPrice"><img src="assets/bellBag_sm1.png">&nbsp;${fossil.price}</p><div class="critterHoverBox"><span class="blathersQuote">${museumStringPreview}</span><img src="assets/Blathers_Icon.png"></div></div>`

    contentGrid.appendChild(li)
  })
  // Add Blathers Overlay Listeners
  addBlathersOverlayListeners()
}

// ! -------------------- WORKS OF ART ----------------------
function getArt() {
  // fetch(`https://acnhapi.com/v1a/art/`)
  fetch(`${API_ROOT}/api/art/`)
    .then((res) => res.json())
    .then((data) => {
      allArt = data
    })
    .catch((err) => {
      console.log(`error ${err}`)
    })
}
function displayArt(artArray = allArt) {
  clearGrid()
  artArray.forEach((art) => {
    const li = document.createElement('li')

    li.classList.add('contentItem')
    li.classList.add('art')

    // Create museum string preview
    museumString = art['museum-desc']
    museumStringArray = museumString.split(' ')
    museumStringArray.length = 5
    museumStringPreview = museumStringArray.join(' ') + '...'

    // Add art.id class so Blathers overlay can find and display the right info
    li.classList.add(`${art.id}`)

    // * CREATING ART TILES
    li.innerHTML = `<h2 class="name">${art.name['name-USen']}</h2><div class="critterImgBox"><img src="${art['image_uri']}"><div class="critterHoverBox"><span class="blathersQuote">${museumStringPreview}</span><img src="assets/Blathers_Icon.png"></div></div>`

    contentGrid.appendChild(li)
  })
  // Add Blathers Overlay Listeners
  addBlathersOverlayListeners()
}

// !------------------------- BLATHERS OVERLAY --------------------------------

// *Adds event listeners for Blathers overlay to all critters
function addBlathersOverlayListeners() {
  document.querySelectorAll('#contentGrid li').forEach((critter) => {
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

  // Iterate through each element in the event path (except the last two, which are always #document and Window), searching for the
  let path = e.path || e.composedPath()

  for (let i = 0; i < path.length - 2; i++) {
    const element = path[i]

    if (element.matches('li')) {
      critterLiElement = element
    }
  }

  let critterLiElementClasses = Array.from(critterLiElement.classList) // Grab classlist of the content item and convert that list into an array

  const critterID =
    searchCategory === 'Fossils'
      ? critterLiElementClasses.pop()
      : +critterLiElementClasses.pop() // Grab the last item from the classlist, which should be the fish ID num- unless we're looking at fossils

  switch (searchCategory) {
    case 'Fish':
      critterArray = allFish
      break
    case 'Sea':
      critterArray = allSea
      break
    case 'Bugs':
      critterArray = allBugs
      break
    case 'Fossils':
      critterArray = allFossils
      break
    case 'Art':
      critterArray = allArt
      break
  }

  // If we're in fossils, find the index of the clicked-on-fossil by searching for the fossil within the API array with the same name as the critterID (file-name). Needed because the API didnotinclude ID nums for fossils.
  // If we in anything BUT fossils, grab the data based on the nice easy-to-use ID.
  // This one-liner makes me feel like a genius btw.
  const currentCritter =
    searchCategory === 'Fossils'
      ? critterArray[
          critterArray.indexOf(
            critterArray.find((fossil) => fossil['file-name'] === critterID)
          )
        ]
      : critterArray[critterID - 1]

  // Update information in Blathers overlay
  blathersFullCritterImg.src = ''
  blathersFullCritterImg.src = currentCritter['image_uri']
  blathersFullCritterName.innerText = currentCritter.name['name-USen']
  blathersFullCritterText.innerText =
    searchCategory === 'Art'
      ? currentCritter['museum-desc']
      : currentCritter['museum-phrase']

  // Remove hidden classes to display Blathers overlay
  blathersFullWindow.classList.remove('blathersHiddenZ')
  blathersFullWindow.classList.remove('blathersHidden')
}

// * HELPER FUNCTION - BUILD CRITTER MONTH STRING
function buildCritterMonthString(fish) {
  let fishMonths = []
  if (fish.availability.isAllYear === true) {
    for (let key in monthCache) fishMonths.push(monthCache[key])
  } else {
    fish.availability[`month-array-${hemisphere}`].forEach((monthNum) => {
      fishMonths.push(monthCache[monthNum])
    })
  }
  fishMonths = fishMonths.join('')
  return fishMonths
}
