const app = require("express")();
const bodyparser = require('body-parser');
const cors = require('cors');
var mysql = require('mysql');
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

var connection = mysql.createConnection({
    // host: 'SG-mysql1-5763-mysql-master.servers.mongodirector.com',
    // user: 'sgroot',
    // password: '7&VhKXTLCZK4RNI5',
    // database:'node_project',
    // port: 3306,  
    host: 'sql12.freemysqlhosting.net',
    user: 'sql12603118',
    password: 'ljJTXmfuBg',
    database:'sql12603118',
    port: 3306,  
    });
    connection.connect(function(err) {
        if (err) {throw err;}
        console.log('Connected');
});

try
{
    console.log("Database connected");
    var q = "SHOW TABLES LIKE 'users'";
    connection.query(q, function (error, result) {
        if(result.length === 0)
        {
            var q = "CREATE TABLE users (username VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL, password VARCHAR(50) NOT NULL, PRIMARY KEY (username,email,password))";
            connection.query(q, function (error, result) {
                console.log("Table is created successfully");
            });
        }
        else{
            console.log("Table is already created");
        }
    });
}
catch(error)
{
    console.log(error);
}

app.get("", (req, res) => {
  res.send("Deployed");
});

app.post('/saveUser',(req,res)=>{
    var q = "INSERT INTO users (username, email, password) VALUES ("+"'"+ req.body.username+"'" +", "+"'"+req.body.email+"'"+", "+"'"+req.body.password+"'"+")";
    connection.query(q, function (error, result) {
        if (error)
        {
            console.log(error);
        }
        else
        {
            res.send("You have successfully signed up")
        }
    });
})
    
app.get('/getUser',(req,res)=>{
    var q = "SELECT password from users WHERE username="+"'"+req.query.username+"'"+" AND password="+"'"+req.query.password+"'";
    connection.query(q, function (error, result) {
        if (result.length===0)
        {
            res.send("User credentials are incorrect");
        }
        else
        {
            var token="";
            var data=JSON.stringify(result);
            if(req.query.password===JSON.parse(data)[0].password){
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                for ( var i = 0; i < 8; i++ ) {
                    token += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                console.log(token);
                res.json({"token":token});
            }
        }
    });
})


app.listen(PORT, ()=>{
    console.log(`Server is listening in port ${PORT}`);
});