# Gameshare

<!-- About the project -->

## About the project

### Description
Gameshare is a social media platform in which users can share their progress in the games they play,
contribute to discussion boards about games, and interact with friends in the platform. User profiles will keep track of each individual game in their collection, their achievement progress in each game (if the game has achievements), their satisfaction of the game, other users they are friends with or interact with, and each board they are subscribed/follow. Each discussion board will center around a singular game (there can be multiple for each game), in which users can discuss lore, fan theories, hard challenges, helpful hints, speedruns, etc. Users can interact with each other via chat messaging directly through their profiles, or posting and replying to one another on a game board.

### Built with

* [![Angular][Angular.io]][Angular-url]
* [![Node.js][Node.io]][Node-url]
* [![Express][Express.io]][Express-url]
* [![MySQL][MySQL.io]][MySQL-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]

<!-- GETTING STARTED -->
## Getting Started

Below is a list of instructions to set up this project locally.

<!-- Prerequisites -->
### Prerequisites

Listed below are a list of software you will need to install to run this project.

* Node and npm [Install-Node-npm]
* Angular and Angular Cli [Install-Angular]
* MySQL Workbench [Install-MySQL]


<!-- Installation -->
### Installation

1. Clone the repo
   ```sh
   https://github.com/shukricqubain/gameshare.git
   ```
2. Install NPM packages

   Open two terminals, so we can install npm packages for both the frontend and the backend.
   ```sh
   C:\Users\user\Desktop\gameshare> cd frontend
   C:\Users\user\Desktop\gameshare\frontend>
   C:\Users\user\Desktop\gameshare\frontend> npm install
   ```
   ```sh
   C:\Users\user\Desktop\gameshare> cd backend
   C:\Users\user\Desktop\gameshare\backend>
   C:\Users\user\Desktop\gameshare\backend> npm install
   ```
3. Setup the MySQL database

   Open the following link [Import-MySQL-Database] and follow the import tutorial.
   - At step 2 in the tutorial please select "Import from Self-Contained File" and upload the testdbDump.sql.
      - Note: This file is located in the database folder of gameshare.
   - At step 4 in the tutorial please select the "New" button instead of the default target schema and name the target schema as 'demodb'.
      - Note: If you named it anything else be sure to update the "DB" property in the db.config.js file, so the backend can connect properly.
   - Ignore step 5.
   - At step 6, please select "Dump Structure and Data: include the table structure and the data in the tables."
   - Lastly, at step 7, Click Start Import.


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
- [x] Revamp Achievement and User Achievement Page
  - [x] Add icon image to achievement object
  - [x] Change display from table to material cards containing the icon and title along with actions.
  - [x] Update User Achievement Page to match Achievement page design wise.
  - [x] Add info icon to material card to display the details of this achievement.
  - [x] Add a clickable filter icon at top of page that triggers a pop up containing a filter form.
- [x] Revamp User Boards page
  - [x] Make user board page visually similar to boards page
  - [x] Add unfollow button to followed boards on user profile
- [x] Revamp User Threads page
  - [x] Make user thread page visually similar to thread page
  - [x] Add unfollow button to followed threads on user profile
  - [x] Change userID to userName for each post in a thread
  - [x] Fix depth logic for responses in a thread
- [x] Revamp User Signup and Edit
  - [x] Restrict input to only allow numbers in phone number input in user creation/edit
  - [x] Add regex to email input in user creation/edit
  - [x] Add minimum date for date of birth in user creation/edit
  - [x] Add restrictions for user role updation in user creation/edit
     
### Version 1.2
- [x] User profile page
   - [x] Restrict dimensions in user profile, so the width won't resize.
   - [x] Create and display default message when user has no boards, threads, games, and or achievements.
   - [x] Add pagination to user boards, threads, and games pages.
   - [x] Add a paginator under the material cards, so user doesn't have to click filter icon to paginate data.
   - [x] Add user profile picture.
   - [x] Reorganize User profile tabs into their own components.
   - [x] User Achievements
      - [x] Update user achievements and user games api.
      - [x] Remove Delete and Edit icons/functionality from user Achievement page.
      - [x] Add progress bar displaying the achievement status, so user can view and update the status.
      - [x] Show percentage of people who have obtained the achievement in the application.
      - [x] Show completion date of the achievement.
      - [x] Change the display of the achievement as user makes progress.
   - [x] User Friends Page
     - [x] Allow users to befriend other users when viewing their profile
     - [x] Allow users to view anothers profile by clicking thier userName in a thread post or in user friends page.
     - [x] Basic CRUD for userFriends.

### Version 1.3
- [ ] User Profile Task/Enhancements
   - [x] User Friends
      - [x] Usernames in the friends tab should be clickable and reroute user to View user page.
      - [x] Each friend material card should have their profile picture displayed within a circle icon.
      - [x] Each friend material card should indicate visually if they are currently friends.
      - [x] Each friend material card should display the date two users became friends.
      - [x] Change the accept/reject toggle button to a check and cross icon instead.
      - [x] After becoming friends the check and cross icon should disappear.
      - [x] Upon clicking the friend icon the user may unfriend another user.
      - [x] Each friend material card should display the mutual friends between two users. 
   - [ ] Chat/Messages
      - [x] New tab should be created to display active messages between the current user and each of their friends.
      - [ ] The user should be able to send images in the chat.
      - [x] There should be a clickable icon to create a new chat between one or more friends (Selected via a dropdown).
      - [ ] Each message should display the time it was delivered.
      - [ ] Each chat should visually display whether new messages have been read by the user.
- [ ] View User Page Task/Enhancements
   - [ ] Game Highlights
      - [ ] Should display recently updated games in a vertical list of material cards.
      - [ ] Each game should display its game cover along with the user's enjoyment rating and progress (measured via achievement completion).
      - [ ] Material card should contain an information icon which displays game information when clicked.
   - [ ] Thread Highlights
      - [ ] Should display each thread in a vertical list of material cards a user has been active in recently (measured via posting or editing).
      - [ ] The thread name should be clickable and reroute the user to the thread.
      - [ ] Should display an icon indicting if the user is following threads displayed in the list.
- [ ] Miscellanious Tasks
   - [ ] Add the ability to upload images in a thread.
   - [x] Add user's profile picture to the header icon.

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
[Node.io]: https://img.shields.io/badge/Node.js-%23026e00?style=for-the-badge&logo=node.js&labelColor=%23026e00
[Express-url]: https://expressjs.com/
[Express.io]: https://img.shields.io/badge/Express-%23ffffff?style=for-the-badge&logo=express&labelColor=%23026e00
[MySQL-url]: https://www.mysql.com/
[MySQL.io]: https://img.shields.io/badge/MySQL-%23f29111?style=for-the-badge&logo=mysql&labelColor=%2300758f
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Install-Node-npm]: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
[Install-Angular]: https://angular.io/guide/setup-local
[Install-MySQL]: https://www.mysql.com/products/workbench/
[Import-MySQL-Database]: https://www.databasestar.com/mysql-workbench-export-database/#How_to_Import_a_MySQL_Database


