import express from "express";
import dotenv from "dotenv";
import 'express-async-errors';
import bodyParser = require("body-parser");

dotenv.config();
import './db/index'; // Connection to Database
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


import helmet from "helmet";
import morgan from "morgan";


import materialRouter from "routes/material";
import { sendErrorRes } from "./utils/helper";
import formidable from "formidable";
import path from "path";




app.use(morgan("dev"));
app.disable('x-powered-by'); //  Hide that app is made using express
app.use(helmet());   // adding security to app

// app.get('/', (req, res) => {
//     res.send("Hello World");
// });

app.use("/material", materialRouter);


// Test image upload using Formidable
app.post("/upload-file", async (req, res) => {
    const form = formidable({
        uploadDir: path.join(__dirname, "public"),
        filename(name, ext, part, form) {
            return Date.now() + "_" + part.originalFilename;
        },
    });
    await form.parse(req);

    res.send("ok");
});


app.use(function (err, req, res, next) {
    res.status(500).json({ message: err.message });
} as express.ErrorRequestHandler);

// Not Found Route in case of non-existent routes or wrong METHOD
app.use("*", (req, res) => {
    sendErrorRes(res, "Endpoint Not Found!", 404);
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
})