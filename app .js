
const express = require('express')
const app = express()
const PM = require('./ProductManager')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Poruducts
const products = [];

app.get('/api/products', (req, res) => {
    res.status(200).json(products)
})

app.get('/api/products/:id', (req, res) => {
    const prodId = parseInt(req.params.id);
    try {
        const product = PM.getProductById(prodId);
        res.json(product);
    } catch (error) {
        res.status(404).send('Producto no encontrado.');
    }
})

app.post('/api/products', (req, res) => {

    const body = req.body

    const { title, description, code, price, stock, category, thumbnail, status } = body;

    if (!title || !description || !code || !price || !stock || !category) {
        res.status(400).send({ message: '⛔ Todos los campos deben ser completados.' })
    }

    const newProduct = {
        id: products.length + 1,
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail,
        status: status === false ? false : true
    }
    products.push(newProduct)

    res.status(201).json(newProduct)
})

app.put('/api/products/:pId', (req, res) => {
    const body = req.body;
    const { title, description, code, price, stock, category, thumbnail } = body;
    const { pId } = req.params;
    const product = products.find((u) => u.id === parseInt(pId));

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (title) {
        product.title = title;
    }
    if (description) {
        product.description = description;
    }
    if (code) {
        product.code = code;
    }
    if (price) {
        product.price = price;
    }
    if (stock) {
        product.stock = stock;
    }
    if (category) {
        product.category = category;
    }
    if (thumbnail) {
        product.thumbnail = thumbnail;
    }
    res.status(200).json({ message: '✅ Producto actualizado.', data: product });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.delete('/api/products/:pId', (req, res) => {
    const { pId } = req.params;
    const product = products.find((u) => u.id === parseInt(pId));

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const index = products.indexOf(product);
    products.splice(index, 1);
    res.status(200).json({ message: '✅ Producto eliminado.', data: product });
});


// Cart
const { v4: uuidv4 } = require('uuid');
const carts = [];

app.get('/api/carts', (req, res) => {
    console.log('Received GET request for /api/carts'); // Log a message
    res.status(200).json(carts);
});

app.post('/api/carts', (req, res) => {
    const body = req.body;

    if (!body.products) {
        res.status(400).send({ message: '⛔ Todos los campos deben ser completados.' });
        return;
    }

    const newCart = {
        id: uuidv4(),
        products: body.products
    };
    carts.push(newCart);

    res.status(201).json(newCart);
});

app.get('/api/carts/:cId', (req, res) => {
    const { cId } = req.params;
    const cart = carts.find((c) => c.id === cId);

    if (!cart) {
        res.status(404).send('Carrito no encontrado.');
        return;
    }

    res.json(cart);
});

app.post('/api/carts/:cId/product/:pId', (req, res) => {
    const cid = req.params.cId;
    const pid = req.params.pId;
    const cart = carts.find((c) => c.id === cid);

    if (!cart) {
        res.status(404).json({ message: '⛔ Carrito no encontrado.' });
        return;
    }

    const { id } = req.body;
    const existingProduct = products.find((p) => p.id === id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        const newProduct = { id, quantity: 1 };
        products.push(newProduct);
    }

    res.status(201).json({ message: '✅ Producto agregado al carrito.' });
});

app.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080.');
})
