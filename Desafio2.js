const { promises: fs } = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }
    
    async addProduct(product) {
        const { title, description, price, thumbnail, code, stock } = product;
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Todos los campos son obligatorios.');
        }
        const products = await getJSONFromFile(this.path);
        if (products.some((p) => p.code === code)) {
            console.log(`Ya se encuetra agregado el code: ${code}`)
        } else {
            const id = this.creoID()
            const newProduct = { id, title, description, price, thumbnail, code, stock };
            products.push(newProduct);
            await saveJSONToFile(this.path, products);
        }
    }

    creoID = () => parseInt(Math.random() * 100000)
    
    getProducts = () =>  getJSONFromFile(this.path)
    
    deleteProductsFile = () =>  deleteToFile(this.path)

    async deleteProduct(id){
        const products = await getJSONFromFile(this.path);
        let index = products.findIndex((p) => p.id === id)
        if (index  > -1 ){
            products.splice(index, 1)
            await saveJSONToFile(this.path, products);
            console.log("Se ha borrado correctamente el producto ")
        } else{
            console.log('No se ha podido borrar el producto');
        }
        
    }

    async getProdcutById(id) { 
        const products = await getJSONFromFile(this.path);
        let productById = products.some(p => p.id === id)
        if (!productById) {
            console.log("Product not found")
        } else {
            console.log("Product found", productById)
        }
    }
    
    async updateProduct(id, newTitle, newDescription, newPrice, newThumbnail, newCode, newStock) {
        const getProducts = await getJSONFromFile(this.path);
        let ProdId = getProducts.some(p => p.id === id)
        if (!ProdId) {
            console.log(`updateProduct: Product not foun, id: ${id}`)
        } else { 
                const products = { id:id, title: newTitle, description: newDescription, price: newPrice, thumbnail: newThumbnail, code: newCode, stock: newStock }
                await saveJSONToFile(this.path, products);
                console.log("Producto actualizado correctamente", products)                      
        }
    }
}

const getJSONFromFile = async (path) => {
    try {
        await fs.access(path);
    } catch (error) {
        return [];
    }
    const content = await fs.readFile(path, 'utf-8');
    try {
        return JSON.parse(content);
    } catch (error) {
        throw new Error(`El archivo ${path} no tiene un formato JSON válido.`);
    }
}

const saveJSONToFile = async (path, data) => {
    const content = JSON.stringify(data, null, '\t'); 
    try {
        await fs.writeFile(path, content, 'utf-8');
    } catch (error) {
        throw new Error(`El archivo ${path} no pudo ser escrito.`);
    }
}  

const deleteToFile = async (path)=> {
    try {
        console.log('Intentando borrar el archivo...')
        await fs.unlink('./products.json') 
        console.log('Finalizó el borrado del archivo.')
    } catch (error) {
        throw new Error(`El archivo ${path} no pudo ser borrado.`);
    }      
}   

const desafio = async () => {
    try {
        const productManager = new ProductManager("./products.json");
        await productManager.addProduct({
            title: "producto prueba",
            description: "Este es un producto prueba",
            price: 10000,
            thumbnail: "imagen no disponible",
            code: "jin475",
            stock: 18
        });
        const products = await productManager.getProducts();
        console.log("getProdcuts", 'Acá los productos:', products);
        productManager.getProdcutById()
        productManager.deleteProduct() 
        await productManager.updateProduct(74739, "Actualizado", "Actualizado", 300, "Actualizado", "Actualizado", 10)
        //productManager.deleteProductsFile()
    } catch (error) {
        console.error(' Ha ocurrido un error. Vuelva a intentar.', error.message);
    }
};
desafio()
  