'''
Installation Instructions

Clone the Repository

git clone "<REPO_NAME>"

npm install    For installing packages


npm run dev    For running backend in dev mode


Create a .env file with variables


MONGO_URL
CLOUD_NAME
CLOUD_KEY
CLOUD_SECRET


In Postman, hit the endpoints

1. POST   http://localhost:3000/material       BODY   FORM DATA

Values  

imageUrl         sample.png
name             Cement
technology       FDM
colors           ["Black", "Pink"]
applicationTypes ["Wearables"]
pricePerGram     0.02


2. PUT   http://localhost:3000/material/667a66e54ccbe90a4aa9385c          BODY   FORM DATA

Values  ( Image Field is optional, only change whatever fields you want to update)

imageUrl         sample2.png
name             TMT
technology       FDM
colors           ["Black", "Pink"]
applicationTypes ["Construction"]
pricePerGram     0.046




3.  GET  http://localhost:3000/material               BODY     NOT REQUIRED

4. GET   http://localhost:3000/material/667a66e54ccbe90a4aa9385c         BODY     NOT REQUIRED

5. DELETE     http://localhost:3000/material/667a66e54ccbe90a4aa9385c         BODY     NOT REQUIRED

