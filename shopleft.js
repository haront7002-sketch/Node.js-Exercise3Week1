import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
app.use(express.json())

const pool = mysql.createPool({
    user:'root',
    host:'localhost', 
    database:'shopleft_database',
    password: 'Taaraa.sql.1'
});

const getusersDB = async () => {
    let [data] = await pool.query('SELECT * FROM users;')

    return data;
}

const getproductsDB = async () => {
    let [data] = await pool.query('SELECT * FROM products;')

    return data;
}

app.get('/users', async (req, res) => {
    res.json({ info: await getusersDB() });
})

app.get('/products', async (req, res) => {
    res.json({ info: await getproductsDB() });
})

const deleteproductsDB = async (product_code) => {
    await pool.query('DELETE FROM `products` WHERE (`product_code` = ?);', [product_code])
}

app.delete('/products', async (req, res) => {
    await deleteproductsDB(req.body.product_code);
    res.json({ message: "Product deleted" });
});

const postproductsDB = async (product_code, product_name, product_price, product_quantity) => {
    await pool.query('INSERT INTO `products` (`product_code`, `product_name`, `product_price`, `product_quantity`) VALUES (?, ?, ?, ?);', [product_code, product_name, product_price, product_quantity]
    )
}

app.post('/products', async (req, res) => {
    let { product_code, product_name, product_price, product_quantity} = req.body;
    await postproductsDB(product_code, product_name, product_price, product_quantity);
    res.json({ message: "Product added" });
});


const patchproductDB = async (product_name, product_price, product_quantity, product_code) => {
        console.log(product_name, product_price, product_quantity, product_code);

    await pool.query(`UPDATE products
         SET
           product_name = COALESCE(?, product_name),
           product_price = COALESCE(?, product_price),
           product_quantity = COALESCE(?, product_quantity)
         WHERE product_code = ?`, [product_name, product_price, product_quantity, product_code])
}

app.patch('/products', async (req, res) => {
    let {  product_name, product_price, product_quantity, product_code} = req.body;
    await patchproductDB( product_name, product_price, product_quantity, product_code);
    res.json({ message: "products update" });
});








app.listen(3030, () => {

  console.log('http://localhost:3030');
});

