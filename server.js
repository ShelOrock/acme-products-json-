const express = require('express')
const path = require('path');
const app = express()

const db = require('./db')('./products.json', (item, items) => {
    console.log('item1', items)
    if(!item.name) {
        return 'name is required';
    }
    
    if(!item.productPrice) {
        return 'price is required'
    }

    if(items.map( i => i.name).includes(item.name)) {
        return 'name must be unique';
    }
})

app.use(express.json())

app.use((req, res, next) => {
    console.log(`you called ${req.url} as a ${req.method}`)
    next();
})

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/api/products/', async (req, res, next) => {
    try {
        res.send(await db.findAll())
    }
    catch(ex) {
        next(ex);
    }
})

app.post('/api/products', async(req, res, next) => {
    try {
        res.send(await db.create(req.body));
    }
     catch(ex) {
         next(ex);
     }
})

app.delete('/api/products/:id', async (req, res, next) => {
    try {
        await db.destroy(req.params.id);
        res.sendStatus(204);
    }
    catch(ex) {
        console.log(ex);
        next();
    }

    // res.sendFile(path.join(__dirname, 'products.json'))
})

app.listen(3000);