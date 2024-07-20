const express = require('express');


const multer = require('multer');
const xlsx = require('xlsx');
const { MongoClient, } = require('mongodb');


const app = express();
const port = 4000;


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const mongoURL = 'mongodb://127.0.0.1:27017';

const dbName = 'exe';
console.log('concted sucessful!....')

app.post('/upload', upload.single('excelFile'), async (req, res) => {
    try {
        const excelBuffer = req.file.buffer;
        const workbook = xlsx.read(excelBuffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const excelData = xlsx.utils.sheet_to_json(sheet);

        const client = new MongoClient(mongoURL);
        await client.connect();
        const db = client.db(dbName);

        const collection = db.collection('exe');
        await collection.insertMany(excelData);

        await client.close();

        res.status(200).json({ message: 'Excel data uploaded successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during upload.' });
    }
});
app.get('/get_by_id/:id', async (req, res) => {



    try {
        const client = new MongoClient(mongoURL);
        await client.connect();
        const db = client.db(dbName);

        const collection = db.collection('exe');
        const id = req.params.id; // Get the ID from the URL parameter

        const query = { _id: new ObjectID(id) }; // Build a query based on the ID
        const data = await collection.findOne(query);

        await client.close();


        if (!data) {
            res.status(404).json({ error: 'Data not found.' });
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving data.' });
    }
});







app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});















