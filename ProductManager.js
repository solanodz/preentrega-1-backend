const fs = require("fs");
class ProductManager {
    constructor() {
        this.loadProducts();
        this.id =
            this.products.length > 0
                ? Math.max(...this.products.map((product) => product.id))
                : 0;
    }

    loadProducts() {
        try {
            const data = fs.readFileSync("products.json", "utf8");
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    saveProducts() {
        const data = JSON.stringify(this.products, null, 2);
        fs.writeFileSync("products.json", data, "utf8");
    }

    generateId() {
        this.id++;
        return this.id;
    }

    addProduct(product) {
        const { title, description, thumbnail, code, price, stock } = product;
        if (!title || !description || !thumbnail || !code || !price || !stock) {
            throw new Error("Todos los campos deben ser completados.");
        }
        const newProduct = { id: this.generateId(), ...product };
        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }
    getProducts(limit) {
        if (limit) {
            return this.products.slice(0, parseInt(limit));
        } else {
            return this.products;
        }
    }
    getProductById(id) {
        const product = this.products.find((product) => product.id === id);
        if (!product) {
            throw new Error(`No se encontró el producto con el id ${id}`);
        }
        return product;
    }
    updateProduct(id, updatedProduct) {
        const updatedProducts = this.products.map((product) => {
            if (product.id === id) {
                return { ...product, ...updatedProduct };
            }
            return product;
        });
        this.products = updatedProducts;
        return updatedProducts;
    }
    deleteProduct(id) {
        this.products = this.products.filter((product) => product.id !== id);
        return this.products;
    }
}

const PM = new ProductManager();
module.exports = PM