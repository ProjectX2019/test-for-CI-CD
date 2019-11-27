const express       = require('express');
const path          = require('path');
const bodyParser    = require('body-parser');
const cors          = require('cors');

const app = express();
const port = 8080;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const profile = require('./routes/profile.route')
const main = require('./routes/main.route')
const system = require('./routes/system.route')

app.use('/profile', profile)
app.use('/main', main)
app.use('/system', system)


app.get('*', function(req, res){
 	res.sendFile(__dirname + '/public/index.html');
})

app.listen(port, function(err) {
    if(err){
        console.log(err)
    } else {
        console.log('Running on port ' + port)
    }
})
