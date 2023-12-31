# Gameshare

<!-- About the project -->

## About the project

### Description
Gameshare is a social media platform in which users can share their progress in the games they play,
contribute to discussion boards about games, and interact with friends in the platform. User profiles will keep track of each individual game in their collection, their achievement progress in each game (if the game has achievements), their satisfaction of the game, other users they are friends with or interact with, and each board they are subscribed/follow. Each discussion board will center around a singular game (there can be multiple for each game), in which users can discuss lore, fan theories, hard challenges, helpful hints, speedruns, etc. Users can interact with each other via chat messaging directly through their profiles, or posting and replying to one another on a game board.

### Built with

* [![Angular][Angular.io]][Angular-url]
* [Node.js][Node-url]
* [Express][Express-url]
* [MySQL][MySQL-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

<!-- Prerequisites -->
### Prerequisites

todo
This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

<!-- Installation -->
### Installation

todo
_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```

<!-- USAGE EXAMPLES -->
## Usage
todo
Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

<!-- ROADMAP -->
## Roadmap

### Version 1.0
- [x] Login/Signup Functionality
  - [x] Basic CRUD for Roles
  - [x] Basic CRUD for Users
  - [x] Basic CRUD for tokens
  - [x] Login Workflow
  - [x] Signup Workflow
- [x] Game Collection Functionality
  - [x] Basic CRUD for Games
  - [x] Basic CRUD for Achievements
  - [x] Basic CRUD for User Collection
  - [x] Basic Search and pagination for User Collection
  - [x] Basic CRUD for User Achievements
- [x] Board Functionality
  - [x] Basic CRUD for Boards
  - [x] Basic CRUD for Threads
  - [x] Basic CRUD for Thread Items
  - [x] Implement an interactive Boards page
    - [x] Displaying all boards, with searching
    - [x] Creation, editing, and deletion of boards
    - [x] Reroute to individual board on click
    - [x] Allow user to follow and unfollow board
  - [x] Implement an interactive Board page
    - [x] Displaying all threads for a specific board, with searching and sorting
    - [x] Creation, editing, and deletion of threads
    - [x] Reroute to individual thread on click
    - [x] Allow user to follow and unfollow thread
  - [x] Implement an interactive Thread page
    - [x] Displaying all thread items for a specific thread
    - [x] Allow users to edit or delete their own posts/thread items
    - [x] Allow user to post/reply to a thread item

### Version 1.1
- [x] Revamp Game and User Game Page
  - [x] Add cover image to game object
  - [x] Change display from table to material cards containing the image of the game.
  - [x] Make cards clickable and display a pop up containing information on the game along with the achievements.
  - [x] Add a clickable filter icon at top of page that triggers a pop up containing a filter form.
  - [x] Autopopulate achievements when adding a game to a user's collection.
  - [x] Autoremove achievements when removing a game from a user's collection.
  - [x] Update User Game Page to match Game page design wise.
- [ ] Revamp Achievement and User Achievement Page
  - [ ] Add icon image to achievement object
  - [ ] Change display from table to material cards containing the icon and title along with actions.
  - [ ] Add info icon to material card to display the details of this achievement.
  - [ ] Add a clickable filter icon at top of page that triggers a pop up containing a filter form.
- [ ] Revamp User Boards page
  - [ ] Make user board page visually similar to boards page
  - [ ] Add unfollow button to followed boards on user profile
- [ ] Revamp User Threads page
  - [ ] Make user thread page visually similar to thread page
  - [ ] Add unfollow button to followed threads on user profile
  - [ ] Change userID to userName for each post in a thread
  - [ ] Fix depth logic for responses in a thread
- [ ] User Friends Page
  - [ ] Allow users to befriend other users when viewing their profile
  - [ ] Allow users to view anothers profile by clicking thier userName in a thread post
- [x] Revamp User Signup and Edit
  - [x] Restrict input to only allow numbers in phone number input in user creation/edit
  - [x] Add regex to email input in user creation/edit
  - [x] Add minimum date for date of birth in user creation/edit
  - [x] Add restrictions for user role updation in user creation/edit

See the [open issues](https://github.com/shukricqubain/gameshare/issues) for a full list of proposed features (and known issues).

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- ACKNOWLEDGMENTS  -->
## Acknowledgements 
* [Choose an Open Source License](https://choosealicense.com)
* [Img Shields](https://shields.io)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Node-url]: https://nodejs.org/en
[Express-url]: https://expressjs.com/
[MySQL-url]: https://www.mysql.com/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com


