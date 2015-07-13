![Cublet Logo](https://avatars2.githubusercontent.com/u/13155509?v=3&s=100)

# Cublet (Backend)
Cublet is a web app that allows beginners to programming to learn how to program with the Wolfram Language. Considering that the Wolfram Language allows for both imperative and functional style programming, both paradigms of programming can be demonstrated to those planning to get into programming.

This repository holds all the backend server logic of Cublet. Originally, Cublet was just going to parse through results and throw them against a pre-made `APIFunction` Wolfram Cloud API to interpret the Wolfram Language input of the user and get a generated output. However, it grew to an idea of creating an entire ecosystem for Wolfram Language beginners. As we want the app to be as platform-agnostic as possible, this backend only provides a JSON interface which can then be hooked up to a web, mobile or any other kind of application frontend.

For authentication, the appropriate `/auth/login/<login-method>` endpoint is hit up and provided with the necessary credentials. If verified, the consumer/user is then given a JSON Web Token that can then be used to authenticate his/her subsequent requests.

Cublet allows users to

* Create an account through the conventional registration, Google oAuth and Facebook oAuth
* Follow other Cublet users
* Have a repository of Wolfram Language code sessions that they have written
* Share the Wolfram Language code sessions they have written with the rest of the world (or have such sessions be private)
* Comment on other site users' Wolfram Language repos
* Create and discuss on forums

## API endpoints
All API endpoint requests must be prefixed by `/api/<Cublet version number>`. The current version number of the Cublet API backend is `v1`. All API responses are returned in the JSON format by default. 

All endpoints demarcated with the label `JWT`, are run through the Auth Express middleware which checks for the JSON Web Token on the Authentication headers. As such, all JWT URL endpoints must have an Authorization Header holding a value of `Bearer <jwtTokenString>`.

1. `/auth`
  * `/signup`
      * `POST` a user's signup information - name, email, username, password
	      * `name` parameter for new user's full name
	      * `email` parameter for new user's email
	      * `username` parameter for new user's username
	      * `password` parameter for new user's password
  * `/login/legacy`
      * `POST` a user's credentials for legacy login - email/username or password
	      * `useridentifier` parameter for email/username
	      * `userpassword` parameter for password
  * `/login/facebook`
      * `POST` a Facebook oAuth access token that can be used to grab user information
	      * `username` parameter for user's username, if this is the first time the user is logging in.
	      * `usertoken` parameter for Facebook access token
	  
2. `/users`
  * `/me` (JWT)
      * `PUT` to edit the current logged in user's information
	      * Parameters: `name`, `username`, `email`, `password`
	  * `GET` to view the current logged in user's information
	      * Returns `name`, `username`, `email`, `facebookId`, `googleId`, `createdAt`, `updatedAt`, `following (Array of User IDs)`, `followers (Array of User IDs)`, `feed (Array: from, action, reference, createdAt), activity (Array: action, reference, createdAt)`
  * `/<user-id>`
      * `PUT` to edit the user with provided `<repo-id>` (JWT)
	      * Parameters: `name`, `username`, `email`, `password`
      * `GET` to view the specific user with `<user-id>`
	      * Returns `name`, `username`, `email`, `facebookId`, `googleId`, `createdAt`, `updatedAt`, `following (Array of User IDs)`, `followers (Array of User IDs)`, `feed (Array: from, action, reference, createdAt)`, 
  * `/<user-id>/follow` (JWT)
      * `POST` to set the current logged in user as following/unfollowing the user who has an account id of `<user-id>`and set the user who has an account id of `<user-id>` to have the current logged in user as a follower/unfollower.
		
3. `/repos`
  * `POST` to add a new repository
      * Parameters: `title`, `description`, `code`, `public`
  * `GET` to get all the repo boards
  * `/<repo-id>`
      * `PUT` to edit the repository with provided `<repo-id>` (JWT)
	      * Parameters: `title`, `description`, `code`, `public`
      * `GET` to view the specific repository with `<repo-id>`
	      * Returns: `title`, `description`, `code`, `comments (Array: message, createdBy, upvotes, createdAt, updatedAt, under)`, `createdBy`, `upvotes (Array)`, `public`, `createdAt`, `updatedAt`
  * `/<repo-id>/upvote`
      * `POST` to toggle the upvote of current user on repo `<repo-id>` (JWT)
  * `/<repo-id>/comments`
      * `POST` to add a new comment to a repository (JWT)
	      * Parameters: `message`
  * `/<repo-id>/comments/<comment-id>`
	  * `PUT` to edit the specific comment at the specific repository (JWT)
	      * Parameters: `message`
  * `/<repo-id>/comments/<comment-id>/upvote`
      * `POST` to toggle the upvote of current user on comment `<comment-id>` on repo `<repo-id>` (JWT)
	  
4. `/forums`
  * `POST` to add a new forum board
      * Parameters: `title`, `message`
  * `GET` to get all the forum boards
  * `/<forum-id>`
      * `PUT` to edit the forum with provided `<forum-id>` (JWT)
	      * Parameters: `title`, `message`
	  * `GET` to view the specific forum with `<forum-id>`
	      * Returns: `title`, `message`, `createdBy`, `createdAt`, `updatedAt`, `comments (Array: message, createdBy, upvotes, createdAt, updatedAt, under)`
  * `/<forum-id>/upvote`
      * `POST` to toggle the upvote of current user on forum `<forum-id>` (JWT)
  * `/<forum-id>/comments`
      * `POST` to add a new comment to a forum (JWT)
	      * Parameters: `message`
  * `/<forum-id>/comments/<comment-id>`
	  * `PUT` to edit the specific comment at the specific forum (JWT)
	      * Parameters: `message`
  * `/<forum-id>/comments/<comment-id>/upvote`
      * `POST` to toggle the upvote of current user on comment `<comment-id>` on forum `<forum-id>` (JWT)
	  
## Technologies Used:
* Mongo Database
* Mongoose for NodeJS Mongo Schema
* Express
* Body-Parser Express Middleware for parsing POST/GET requests
* JSONWebToken for creating session/authentication tokens

## Dev Process
* Gulp is used for the build step
* If you plan to spin up an instance of Cublet's Backend-API for experimental reasons, just edit the settings in config.js and watch the magic!