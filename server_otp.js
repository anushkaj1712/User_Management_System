const express =  require('express');
const app = express();
const port = 4200;
const path = require('path');

const bodyParser = require('body-parser');
const userRouter = require('./router/router');

const { vote } = require('./controller/controller');

const db = require('./db/db');
app.use(bodyParser.json());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Hello!')
})
app.use('/user', userRouter);

app.listen(port, (err,res) => {
    if(err) {
        console.log('something went wrong')
    }
    else{
        console.log('Server is running on http://localhost:${port}/')    
    }
})

