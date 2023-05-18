<br />
<div align="center">
  <h3 align="center">Bulletin Board System</h3>
</div>


<!-- ABOUT THE PROJECT -->
## About The Project

A system thats alows users to create boards with certain description (Topic), and user can go to any Board that matches their interests
and create threads on thatspecific board. Users can also communicate through threads to a specific Board.

The app provides SignUp/Login features and also roles assigned to each user, supported roles are:
* **Posters** (default role when signed up), they are able to create **Posts/Threads**.
* **Moderators**, can do what **Posters** do but they can also lock **Threads** and ban **Users**.
* **Adminstrators**, can do what **Moderators** do but they can also create/remove **Boards**.

**Users** also have a profile page that displays the following info:
* About User
* Date of Birth
* Hometown
* Location
* Gender & Interests (Optional)

### Features
* Banning Users
    * Only **Moderators** and **Adminstators** can ban other users.
    * To ban a **User** simply have a role as *Admin* or *Mod*, go to a *User* profile and click the ban button.
    * Banned *Users* are not allowed to create *Boards, Threads and Posts*.
* Pages, Sections:
    * Home Page which contains:
        * Link to Registeration.
        * Login/Logout.
        * List of Boards with board's name, description, no. of threads and no. of posts.
    * Registeration Page:
        * Registeration Form
    * Board Page:
        * Contains name of board and description.
        * List of Posts on the Board, and threads.
        * Threads contains creation date, name of the user and icon displaying if the thread is locked.
    * Thread Page
        * Clicking on a Thread, redirects to Thread Page which contains name of Board which the thread belongs to 
          and the list of posts belonging to that thread.
        * Reply Form if the Thread is not Locked.
    *  User Profile:
        * Clicking a user name redirects to his profile page.

### Technologies used
* Backend -> Django, postgresql database and Django-Rest-Knox.
* Frontend -> ReactJs, TypeScript, mobx.
