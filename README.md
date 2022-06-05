# New Horizons Database

A responsive web app designed to assist and delight players of the popular Nintendo game _Animal Crossing: New Horizons_.

### [**Click here to check it out!**](https://acnh-database.netlify.app/)
![Screenshot](https://user-images.githubusercontent.com/96756923/167181894-17ab1963-4ffa-4dc4-8248-1d02ea2e343d.png)

# How It's Made:
**Tech used:** HTML, CSS, JavaScript

As a decades-long fan of Nintendo's wildly popular Animal Crossing series, when I stumbled across an API which returned data fromtheir latest game, I just HAD to build something it!

The API had tons of data which was distributed over a dozen endpoints, so I set out to use as many of those endpoints as I could to create a beautiful, responsive app which fans of the series could use to search for and view information on any of the games hundreds of villagers, critters, and art pieces.

This project presented me with two large challenges.

The first was converting the complex data returned by the API into a unique, feature-rich display for the user. For example, the app checks the current date, and applies special styling to a villager's information card if it is the birthday or birthday-month of the villager. It does the same for any catchable critters, highlighting those that are currently available in the users region- which can be toggled by pressing the glboe icon next to the search bar. I also wrote code which converts the user's current time into a query I could send to the API in order to fetch a music track which matches the user's current time. (In the actual game, the music changes every hour- and this is reflected in the app as well!)

The second big challenge was creating a beautiful user interface. I wanted the user to be delighted at every turn. I spent much of my time on this project in Photoshop, tweaking assets to match the visual-style of the game. I also set out to cram in as many easter eggs as possible, to keep the user surprised and delighted as they used the app. Keep an eye out for floating presents drifting by on the wind, a seaplane zooming across the sky, an otter paddling along the coast, and a rotating cast of special characters poking their heads out from behind the logo. I am also quite proud of the toggle-able rain effect, which, in addition to the visual change, switches the audio track to a more somber version to match the rainy mood.

### 6/4/2022 UPDATE
Initially, this app was unable to display the 16 new villagers added in the 2.0 update to the game. I searched far and wide but could not find any APIs which returned this new data. So, I set out to build my own public API which could handle this data, and integrated it into the app along with the original API I've been using. By their powers combined, I am happy to say taht this app now displays all 413 villagers, fully searchable by a myriad of query types!

# Features!
## Villagers
- Search villagers by **name**, **species**, **personality**, or **birthday**.
- Enjoy discovering each villager's **personal quote** and **catchphrase**.
- 6/4/22 Update: 2.0 villagers now available via custom API! **Woohoo!**

## Critters
- Search bugs, fish, and sea creatures by **species**, **location**, **rarity**, or **month available**.
- Toggle your hemisphere by clicking the **globe** icon next to the search bar.
- Easily see the **sell price** and **time available** of every critter at a glance.
- Critters that are currently available to catch are **automagically** highlighted.
- Click on a critter to read the **full speech** given by museum curator **Blathers** when that critter is donated.

## Fossils & Art
- Search fossils and art by **name**.
- Click on a fossil to read the **full speech** given by museum curator **Blathers** when that fossil is donated.
- Click on an art piece to read the **museum description**.
- Note: There's more I want do with these sections, but I am limited by the API. **May or may not** become much more awesome in the future.

## Ambience
- Enjoy the **soothing** soundtrack of AC:NH as you browse the database. The track played syncs up to your local time for the **authentic** Animal Crossing experience.
- Oh no, is the **2pm** music playing? Have no fear, toggle the music off with the **speaker button** at the top of the page.
- Prefer the **rain** to the heat of the sun? So do I. Click the **weather icon** at the top to bring on the rain, and enjoy the accompanying rainy music track.

## More to come...?
- Maybe! Follow me on [Twitter](https://twitter.com/ramblingadam) for updates on this and my other **fun** projects!
- **Thanks so much** for visiting! I hope you have as much fun playing with this app as I did building it!

# Usage
The code for this project is licensed under the [GNU GPL v2.0 License](https://github.com/ramblingadam/acnh/blob/main/LICENSE.md).

# Attribution & Disclaimer
Most of the data displayed in this web app is provided via the [ACNH API](https://acnhapi.com/).
The 2.0 villager data is provided by a custom API I wrote, the [ACNH-Mini-API](https://acnh-mini-api.herokuapp.com)

All characters and graphics related to Nintendo and Animal Crossing: New Horizons are the sole property of Nintendo.
