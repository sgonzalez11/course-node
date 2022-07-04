const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            if (this.id) {
                const existingProduct = products.findIndex(prod => prod.id === this.id);
                const updateProducts = [...products];
                updateProducts[existingProduct] = this;
                fs.writeFile(p, JSON.stringify(updateProducts), (err) => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => {
                return p.id === id;
            });
            cb(product);
        });
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProduct = products.filter(p => p.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProduct), err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }


}
