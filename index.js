const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors =require('cors');



const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.adlv3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('DB connected')
        const database = client.db("AirCloudTours");
        const servicesCollection = database.collection('services');

        //GET API 
        app.get('/services', async (req, res) =>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
    }
    finally{
        //await client.close();
    }
}
run().catch(console.dir);

//U:  AirCloudTours
//P:  uOVBNI5RJqsGVS48

app.get ('/', (req, res) =>{
    res.send('AirCloud Tours - Node Server running');
})
/* app.get ('/hello', (req, res) =>{
    res.send('hrkoku server running');
}) */

app.listen(port, ()=> {
    console.log('Listening Port', port);
})