#What's the Dish?
This project is broken up into a backend and frontend. 

The backend contains the Django project which uses the Django Rest Framework, and hold the Collaborative Filtering algorithm. 

The frontend uses React and queries data from the API.


##Needed installations
####`react`
####`node`
####`npm`
####`react-auth`
####`allauth`
####`redux`
####`antd`

##Run the project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run in terminal of path /Crowdsourcing/frontend/src  :

### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

To run the server you should run in terminal of path /Crowdsourcing/backend/src   :

### `python3 manage.py runserver`

##Important directories

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