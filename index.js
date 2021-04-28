const express = require('express')
const app = express()
const port = 3001

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://admin:rhkdtjd83**@boilerplate.lje9s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err))

  

//mongodb+srv://admin:<password>@boilerplate.lje9s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
//admin//rhkdtjd83**

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

