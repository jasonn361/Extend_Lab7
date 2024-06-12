# Lab 7 Chatroom App

## Project Description
We implemented a fully functional chatroom, styled through CSS with various features. This project extends the features of Lab7, with features that we are going to discuss below. 


### Working Chatroom
- Users can join chatrooms and send messages in real-time. When a user enters a chatroom, it creates a chatroom with a random 6-letter name for the chatroom. Upon entering a chatroom, you have to submit a Nickname in order to be able to send messages.
- Messages are displayed in the chatroom as they are sent. The messages display the date it was published, and the exact time, including the second(s), in which the message was published.

### CSS Styling
- All pages, buttons, etc, are styled using the bootstrap library to ensure a consistent, visually appealing, and user friendly design.

### Login Page and New Profile Signup
- Signup/Login is done via the same button. Upon clicking the button, it takes you to the page to signup.
- To signup, you input your Username, Email, Password, and confirm your password once again to sign up.
- If you already have an account, you click "Already have an account? Login here" to login.
- Both of the login and signup pages include validation and sanitization checks to ensure data integrity as well as security.

### Profile Management
- Users can update their profile information after signing up.
- Upon entering the profile page which is done by clicking on the "page" button, it displays information like your username and email.
- You can also update your bio and location here.
- Additionally, you can create posts to display additional messages, however this is different from the chatroom.

### Message Editing and Deletion
- Users can edit or delete their messages in the chatroom. If you enter a chatroom where you already typed something prior, and you just signed in again, edit/delete may not display. Simply type another message to be able to confirm you are the same user, and you can edit/delete your messages.
- Upon editing a message, it will say (edited) right next to the message, to display that the message was edited, and is not showing an original message.
- Deleting messages is straight forward: after deleting a message, you cannot see it anymore. When you delete a message, it doesn't confirm if you want to delete the message, so be sure you want to delete a message.

### Message Search
- Users can search for a message by typing the message they want to search for in the searchbar above the chatroom, and clicking enter/the search button.
- Upon clicking enter/the search button, it displays the message, as well as the time and date it was published.

### Validation and Sanitization Checks
- Checks if the username is empty.
Ensures the username only contains letters, numbers, and underscores (/^[a-zA-Z0-9_]+$/).

-  Checks if the email is empty.
Splits the email by "@" and ensures the domain part is present (checkIncompleteEmail function).
Uses a prompt to ask the user to specify the email domain if it's incomplete.
Validates the email format using a regex (/^[^\s@]+@[^\s@]+\.[^\s@]+$/).

- Password Validation:
Checks if the password is empty.
Ensures the password is at least 6 characters long.
Confirms that the password and confirm password fields match.

## Installation and Running the Code

### Installation Steps
1. Clone the repository in whichever directory.
2. Run 
```
npm install
npm install bcrypt mongoose express express-session cookie-parser express-handlebars
npm install -g nodemon
node server.js
```
