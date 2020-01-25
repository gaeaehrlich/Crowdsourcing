# What's the Dish?
This project is broken up into a backend and a frontend. 

The backend contains the Django project which uses the Django Rest Framework, and holds the Collaborative Filtering algorithm. 

The frontend uses React and queries data from the API.

We hope you enjoy using it. 
We put a lot of effort into small user experience details make that the usability as smooth as possible


## Needed installations
#### `react`
#### `node`
#### `npm`
#### `react-auth`
#### `allauth`
#### `redux`
#### `antd`

## Run the project
You will need to run both backend and frontend server.

To run the frontend, in the project directory, you can run in terminal of path /Crowdsourcing/frontend/src  :

### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

To run the backend server you should run in terminal of path /Crowdsourcing/backend/src   :

### `python3 manage.py runserver`

## Important directories

```
Croudsoursing
│   README.md
└───backend
    └───src
        └───dishes
            └───api
                |   ...
                |   views           -> a view takes a Web request and returns a Web response
            └───engine              -> collaborative filtering algorithm
            |   models.py           -> defines the DB tables
            │   ...  
└───frontend
    └───src
        └───components              -> the components of the app, used by several containers
        └───containers              -> the pages of the app
        └───store                   -> user authentication
        │   ... 
```

## User Interaction Features
### User incentive system

The motive for users to use and re-use our program is the gifts they get from our "sponsors" .
In order to get gifts, the user needs to LEVEL UP! the way to do so is to get "likes" on the reviews he published.
 1 like = 1 level up.
 
Our way to make sure that the user doesn't spam the reviews is the spam button.
Once a review gets 2 spam warnings it gets deleted, and the reviewer's level decreases accordingly.

Rules: the user can't like his own posts and can't mark as spam the same review twice.

There are 4 levels: Beginner, Intermediate, Reliable and Critic.
The user can share his level on social media via the Share button. We did not implement a connection with Facebook,
however this is another motive for the user to level up - show off to his friends.

### Notifications

Once a user is looking into a certain dish, it means he might be ordering it soon. That is why we have a reminder 
mechanism. The next time the user goes to our Homepage he will get a notification asking him to review that dish.
The user will stop receiving notifications for a certain dish once he reviews it, or if he enters the dish's page again. 

## About the DB

This sample data base contains a few restaurants, dishes, tags, constraints and users. The majority of the restaurants
are located at the City Area called "Tel Aviv- North", and one restaurant at a the area "Herzliya Pituah".

Also, this DB contains several users, who reviewed a few dishes and listed few constraints (Chen for example is a
 vegetarian), so every user will get different results for every search, sorted by our estimations.
 
 
 ### Users
 #### `Gaea` `Adi` `Chen` `Orin`
 #### `Slava` 
 (you're allergic to peanuts now)
 
 ### Passwords
 ##### for every username the password is:  `username1234567!`
 ##### where 'username' is the users username with capital letter

 
    
