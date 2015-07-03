![Cublet Logo](https://avatars2.githubusercontent.com/u/13155509?v=3&s=100)

# Cublet (Backend)
Cublet is a web app that allows beginners to programming to learn how to program with the Wolfram Language. Considering that the Wolfram Language allows for both imperative and functional style programming, both paradigms of programming can be demonstrated to those planning to get into programming.

This repository holds all the backend server logic of Cublet. Originally, Cublet was just going to parse through results and throw them against a pre-made `APIFunction` Wolfram Cloud API to interpret the Wolfram Language input of the user and get a generated output. As we want the app to be as platform-agnostic as possible, this backend only provides a JSON interface which can then be hooked up to a web, mobile or any other kind of application frontend.

Cublet allows users to

* Create an account through the conventional registration, Google oAuth and Facebook oAuth
* Follow other Cublet users
* Have a repository of Wolfram Language code sessions that they have written
* Share the Wolfram Language code sessions they have written with the rest of the world (or have such sessions be private)

## API endpoints
All API endpoint requests must be prefixed by `/api/<Cublet version number>`. The current version number of the Cublet API backend is `v1`. All API responses are returned in the JSON format by default.

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
	  * `usertoken` parameter for Facebook access token
  * `/login/google`
      * `POST` a Google oAuth access token that can be used to grab user information
	  * `usertoken` parameter for Google access token
	  
2. `/user`
  * `/me`
      * `POST` to edit the current logged in user's information
	  * `GET` to view the current logged in user's information
  * `/<account-id>`
      * View the public information of a user
  * `/<account-id>/follow`
	  * Set the current logged in user to follow the user who has an account id of `<account-id>`
		
3. `/repo`
  * `/<repo-id>`
      * `POST` to edit the current repository
      * `GET` to view the contents of this repository

## Technologies Used:
* Mongo Database
* Mongoose for NodeJS Mongo Schema
* JWT for securing authentication transmission
* Express
* Body-Parser Express Middleware for parsing POST/GET requests
* Express-Session Express Middleware for establishing sessions

* Gulp for build step