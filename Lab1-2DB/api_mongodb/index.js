const Express = require("express");
const Mongoclient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");
const { ObjectId } = require("mongodb");

const path = require("path");

const app = Express();
app.use(cors());

const CONNECTION_STRING = "mongodb+srv://admin:admin123@cluster0.rtpl0xk.mongodb.net/?retryWrites=true&w=majority";

app.get('/', (req, res) => {
    res.send("<del>Hello world!</del>");
})

app.get('/page1', (req, res) => {
    //res.send("./page1.html");
    res.sendFile(__dirname + "/page1.html")
})

const DATABASENAME = "eventappdb";
let database;

app.listen(5038, () => {
    Mongoclient.connect(CONNECTION_STRING, (error, client) => {
        database = client.db(DATABASENAME);
        console.log("Mongo DB Connection Successful");
    })
});

app.get('/api/eventapp/GetEvents', (request, response) => {
    database.collection("eventappcollection").find({}).toArray((error, result) => {
        response.send(result);
    });
});

app.post('/api/eventapp/AddEvent', multer().none(), (request, response) => {
    database.collection("eventappcollection").count({}, function(error, numOfDocs) {
        database.collection("eventappcollection").insertOne({
            //id: (numOfDocs + 1).toString(),
            //id: new ObjectId(),
            id: new Date().toISOString(),
            description: request.body.newEvent
        });
        response.json("Added Successfully");
    });
});

app.delete('/api/eventapp/DeleteEvent', (request, response) => {
    database.collection("eventappcollection").deleteOne({
        id: request.query.id
    });
    response.json("Deleted Successfully");
});

app.put('/api/eventapp/UpdateEvent', multer().none(), (request, response) => {
    const eventId = request.body.id;
    const newDescription = request.body.description; 

    database.collection("eventappcollection").updateOne(
        { id: eventId },
        { $set: { description: newDescription } }
    );
    response.json("Updated Successfully");
});
