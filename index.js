const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qygdymi.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();
    const collegeCollection = client.db('allCollege').collection('college');
    const subCollegeCollection = client.db('allCollege').collection('subCollege');
    const admissionCollection = client.db('allCollege').collection('admission');
    const ratingCollection = client.db('allCollege').collection('rating');


    app.get('/college',async(req, res) => {
        const cursor  = collegeCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    
    app.get('/college/:id', async (req, res) => {
        const onCollage = req.params.id;
        const query  ={_id: new ObjectId(onCollage)};
        const option ={
            projection: {
                college_name:1,admission_dates:1,events:1,image_url:1,admission_process:1,sports:1,research_history:1,
            },
        }
        const result = await collegeCollection.findOne(query,option)
        res.send(result)
    })

    app.get('/subCollege', async (req, res) => {
        const cursor = subCollegeCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/subCollege/:id', async (req,res) => {
        const onSubCollege = req.params.id;
        const query ={_id: new ObjectId(onSubCollege)};
        const option = {
            projection: {
                admission_date:1,college_image:1,college_name:1,college_rating:1,events:1,research_projects:1,sports_facilities:1,
            },
        }
        const result = await subCollegeCollection.findOne(query,option)
        res.send(result)
    })
    app.post('/admission', async (req, res) => {
        const item = req.body;
        const result = await admissionCollection.insertOne(item)
        res.send(result)
    })

    app.get('/admission', async(req,res)=> {
        const cursor = admissionCollection.find();
        const result = await cursor.toArray()
        res.send(result)
     })

     app.post('/rating', async (req ,res) => {
        const ratingItem = req.body;
        const result = await ratingCollection.insertOne(ratingItem)
        res.send(result);
     })

     app.get('/rating', async (req , res) => {
        const cursor = ratingCollection.find()
        const result = await cursor.toArray()
        res.send(result)
     })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})