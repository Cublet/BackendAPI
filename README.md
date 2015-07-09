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

All endpoints demarcated with the label `JWT`, are run through the Auth Express middleware which checks for the JSON Web Token on the Authentication headers.

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
	  * `GET` to view the current logged in user's information
  * `/<user-id>`
      * `PUT` to edit the user with provided `<repo-id>` (JWT)
      * `GET` to view the specific user with `<user-id>`
  * `/<user-id>/follow` (JWT)
      * `PUT` to set the current logged in user as following/unfollowing the user who has an account id of `<user-id>`and set the user who has an account id of `<user-id>` to have the current logged in user as a follower/unfollower.
		
3. `/repos`
  * `POST` to add a new repository
  * `/<repo-id>`
      * `PUT` to edit the repository with provided `<repo-id>` (JWT)
      * `GET` to view the specific repository with `<repo-id>`
  * `/<repo-id>/comments`
      * `POST` to add a new comment to a repository (JWT)
	  * `GET` to view all the comments on a repository
  * `/<repo-id>/comments/<comment-id>`
      * `GET` to view the specific comment at the specific repository
	  * `PUT` to edit the specific comment at the specific repository (JWT)
  * `/<repo-id>/comments/<comment-id>/upvote`
      * `POST` to set the current logged in user as upvoting the comment `<comment-id>` on repo `<repo-id>` (JWT)
	  * `DELETE` to remove the current logged in user's upvote for the comment `<comment-id>` on repo `<repo-id>`. (JWT)
	  
4. `/forums`
  * `POST` to add a new forum board
  * `GET` to get all the forum boards
  * `/<forum-id>`
      * `PUT` to edit the forum with provided `<forum-id>` (JWT)
	  * `GET` to view the specific forum with `<forum-id>`
  * `/<forum-id>/comments`
      * `POST` to add a new comment to a forum (JWT)
	  * `GET` to view all the comments on a forum
  * `/<forum-id>/comments/<comment-id>`
      * `GET` to view the specific comment at the specific forum
	  * `PUT` to edit the specific comment at the specific forum (JWT)
  * `/<forum-id>/comments/<comment-id>/upvote`
      * `POST` to set the current logged in user as upvoting the comment `<comment-id>` on forum `<forum-id>` (JWT)
	  * `DELETE` to remove the current logged in user's upvote for the comment `<comment-id>` on forum `<forum-id>`. (JWT)
	  

## Technologies Used:
* Mongo Database
* Mongoose for NodeJS Mongo Schema
* Express
* Body-Parser Express Middleware for parsing POST/GET requests
* JSONWebToken for creating session/authentication tokens

## Dev Process
* Gulp for build step