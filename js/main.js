// ! INITIALIZATION ---------
// Declare villager data storage
let allVillagers
let allFish
let allSea
let allBugs

let currentCategory

// Turn on music by default.
musicOn = true

// Store current date to check birthdays
let now = new Date()

// ! GRAB HTML ELEMENTS
// Grab audio element for BG Music
const bgAudio = document.querySelector('#bgMusic')

// Grab music toggle button
const musicToggle = document.querySelector('#musicToggle')




// Grab main menu items
const btnList = document.querySelectorAll('nav ul li')
const btnVillagers = document.querySelector('#btnVillagers')
const btnFish = document.querySelector('#btnFish')
// const btnSea = document.querySelector('#btnSea')
// const btnFossils = document.querySelector('#btnFossils')
// const btnArt = document.querySelector('#btnArt')
// const btnSongs = document.querySelector('#btnSongs')

// Grab search bar
const searchBar = document.querySelector('#search')


// Grab content grid
const contentGrid = document.querySelector('#contentGrid')






// ! EVENT LISTENERS
// Music Toggle
musicToggle.addEventListener('click', toggleMusic)

// Main Menu Buttons
btnVillagers.addEventListener('click', () => {displayVillagers()})
btnFish.addEventListener('click', () => {displayFish()})


// Active search
searchBar.addEventListener('input', search)

// ! RUN INITIAL FUNCTIONS
// Start by loading villagers by default.
getVillagers()
// Play music.
setTimeout(musicSelection, 1000)

// ! MUSIC TOGGLE FUNCITON
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

// ! ACTIVE SEARCH FUNCTION
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


// ! HOURLY MUSIC SELECTION
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



// ! CLEAR CONTENT GRID
function clearGrid() {
  items = document.querySelectorAll('.contentItem')
  items.forEach(item => item.remove())
}

// ! UPDATE CURRENT CATEGORY
function updateCategory(category) {
  btnList.forEach(btn => {
    if(btn.matches(`#btn${category}`)) {
      btn.classList.add('currentCategory')
      currentCategory = category
    }
    else btn.classList.remove('currentCategory')
  })
}

// ! GRAB VILLAGER DATA
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



// ! DISPLAY VILLAGERS
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

// ! GRAB FISH DATA
function getFish() {
  fetch(`https://acnhapi.com/v1a/villagers/`)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    allFish = data

    // Run villager display function
    displayVillagers(allFish)
  
  })
  .catch(err => {
    console.log(`error ${err}`)
})
}

// ! DISPLAY FISH
function displayFish(fishArray = allFish) {
  updateCategory('Fish')
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
    li.innerHTML = `<h2 class="name">${villager.name['name-USen']}</h3><h4 class="personality">${genderString}${villager.personality}</h4><h4 class="birthday${birthdayMonth}"><i class="fa-solid fa-cake-candles"></i> ${villager['birthday-string']}</h4><div class="villagerImgBox"><img src="${villager['image_uri']}"><div class="catchphraseBox"><span class="catchphrase">"${villager['catch-phrase']}!"</span><img src="${villager['icon_uri']}"></div></div><p class="quote">${villager.saying}</p>`

    

    contentGrid.appendChild(li)
    // console.log('-----')
    // console.log(now.toLocaleString())
  })
}