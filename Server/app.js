const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();

app.use(express.json());

const username = "Owner";
const password = "Owner123";
const cluster = "ades.fe4hp";
const dbname = "ADES";

const url = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;

MongoClient.connect(url, (err, db) => {

    if (err) {
        console.log(`Error occured when connecting to MongoClient.`);
    }

    else {

        const myDB = db.db("myDB");
        const collection = myDB.collection("UserTable");

        app.post("/signup", (req, res) => {

            const newUser =
            {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            };

            const query = { email: newUser.email };

            collection.findOne(query, (err, result) => {

                if (result == null) {
                    collection.insertOne(newUser, (err, result) => {
                        res.status(200).send();
                    });
                }

                else {
                    res.status(400).send();
                }

            })

        });

        app.post("/login", (req, res) => {

            const query =
            {
                email: req.body.email,
                password: req.body.password
            }

            collection.findOne(query, (err, result) => {

                if (result != null) {

                    const objToSend =
                    {
                        name: result.name,
                        email: result.email
                    };

                    res.status(200).send(JSON.stringify(objToSend));

                }

                else {
                    res.status(404).send();
                }
            });
        });
    }
});

const port = 3000;

app.listen(port, () => {
    console.log(`Server started and listening on Port ${port}.`)
});