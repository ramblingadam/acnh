



//------ INITIALIZATION ---------
// Declare villager data storage
let villagers

// Grab current date to check birthdays
let now = new Date()

// GRAB HTML ELEMENTS
const contentGrid = document.querySelector('#contentGrid')










// Start by loading villagers by default.
getVillagers()


function musicSelection() {
  
}


function clearGrid() {
  items = document.querySelectorAll('.contentItem')
  items.forEach(item => item.remove())
}

function getVillagers() {
  fetch(`http://acnhapi.com/v1a/villagers/`)
.then(res => res.json())
.then(data => {
    console.log(data)
    villagers = data

    villagers.forEach(villager => {
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
        console.log(`${villager.name['name-USen']}'s birthday is this month!`)
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
      li.innerHTML = `<h2 class="name">${villager.name['name-USen']}</h3><h4 class="personality">${genderString}${villager.personality}</h4><h4 class="birthday${birthdayMonth}"><i class="fa-solid fa-cake-candles"></i> ${villager['birthday-string']}</h4><div class="villagerImgBox"><img src="${villager['image_uri']}"><div class="catchphraseBox"><span class="catchphrase">${villager['catch-phrase']}</span><img src="${villager['icon_uri']}"></div></div><p class="quote">${villager.saying}</p>`

      

      contentGrid.appendChild(li)
      console.log('-----')
      // console.log(now.toLocaleString())
    })
    

})
.catch(err => {
    console.log(`error ${err}`)
})
}


