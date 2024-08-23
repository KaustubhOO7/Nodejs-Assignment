import mysql from 'mysql2';

const con = mysql.createConnection({
    host : "your host",
    user : "your name",
    password : "your password",
    database : "your db name",
    port : "port number"
});

con.connect((err)=>{
    if(err) throw new Error("An Error has Occured");
    
    console.log("Success");
});

export default con;

