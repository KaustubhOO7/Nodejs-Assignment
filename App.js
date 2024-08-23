import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import con from './Database.js';
import haversine from 'haversine-distance';

const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log("Connected to Port");
});


app.get("/listSchools",(req,res)=>{
    const {latitude,longitude} = req.query;

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    if (typeof userLat !== 'number' || typeof userLon !== 'number') {
        res.send("Invalid latitude or longitude");
   }

    con.query("select * from schools",(error,schools)=>{
        if(error) throw new Error("An error has occured while fetching data");
       
        const schoolsWithDistance = schools.map(school => {
            const schoolCoords = { latitude: school.latitude, longitude: school.longitude };
            const userCoords = { latitude: userLat, longitude: userLon };
            const distance = Math.floor(haversine(userCoords, schoolCoords)/1000); 
            return { ...school, distance };
        });

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.send(schoolsWithDistance);
    });
});

app.post("/addSchool",(req,res)=>{
    const {name,address,latitude,longitude} = req.body;
    
    if (!name || name.trim().length === 0 || !address || address.trim().length === 0) {
        return res.send("Name and address cannot be empty");
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
         res.send("Invalid latitude or longitude");
    }

    con.query("insert into schools(name,address,latitude,longitude) values(?,?,?,?)",[name,address,latitude,longitude],(error)=>{
        if(error) throw new Error("An error has occured while fetching data");
        res.send("School Added Successfully");
    });
});


