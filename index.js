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

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('DB connected')
        const database = client.db("AirCloudTours");
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');

        //GET API 
        app.get('/services', async (req, res) =>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        //Get single Service
        app.get('/services/:id', async(req, res)=>{
            const id= req.params.id;
           const query = {_id:ObjectId(id)};
           const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        //Get Orders
        app.get('/orders', async (req, res) =>{
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        //POST API
        app.post('/services', async (req, res) =>{
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.send(result)
        });

        //Add Orders POST API
        app.post('/orders', async (req, res) =>{
            const order = req.body;
            //console.log('order processing', order);
            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.send(result)
        });
    }
    finally{
        //await client.close();
    }
}
run().catch(console.dir);

app.get ('/', (req, res) =>{
    res.send('AirCloud Tours - Node Server running');
})
/* app.get ('/hello', (req, res) =>{
    res.send('hrkoku server running');
}) */

app.listen(port, ()=> {
    console.log('Listening Port', port);
})