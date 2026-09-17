const express = require('express');

const router =  express.Router();

const auth = require('../middleware/auth');

const products = require('../data/products');

const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

let nextId = 3;

function findProductIndex(id){
    return products.findIndex(p => p.id === Number(id));
}

function validateProductInput({ name, price, category }){
    if(!name){
        throw new AppError("Name is required", 400);
    }

    if(price === undefined || Number.isNaN(Number(price))){
        throw new AppError("Price must be positive", 400);
    }

    if(Number(price) < 0){
        throw new AppError("Price must be positive", 400);
    }

    if(!category){
        throw new AppError("Category is required", 400);
    }
}

router.get('/',auth,asyncHandler(async (req,res)=>{
    const {category , sort} = req.query;

    let result = products.slice();

    if(category){
        result = result.filter(p=>p.category === category);
    }

    if(sort === 'price'){
        result.sort((a,b) => a.price - b.price);
    }

    res.json(result);

}));

router.get('/:id',auth,asyncHandler(async (req,res)=>{

    const id = Number(req.params.id);
    const product = products.find(p=>p.id === id);

    if(!product){
        throw new AppError("Product not found", 404);
    }
    res.json(product);

}));

router.post('/',auth,asyncHandler(async (req,res)=>{

    const {name,price,category} = req.body;

    validateProductInput({ name, price, category });

    const newProduct = {id : nextId++,  name,price:Number(price) , category};
    products.push(newProduct);
    res.status(201).json(newProduct);

}));

router.put('/:id',auth,asyncHandler(async (req,res)=>{

    const {name,price,category} = req.body;

    const idx = findProductIndex(req.params.id);

    if(idx==-1){
        throw new AppError("Product not found", 404);
    }

    validateProductInput({ name, price, category });

    const updated = {id : products[idx].id , name , price: Number(price), category};

    products[idx] = updated;

    res.json(updated);


}));


router.patch('/:id',auth,asyncHandler(async (req,res)=>{

    const idx = findProductIndex(req.params.id);

    if(idx==-1){
        throw new AppError("Product not found", 404);
    }

    if('name' in req.body && !req.body.name){
        throw new AppError("Name is required", 400);
    }

    if('price' in req.body && (Number.isNaN(Number(req.body.price)) || Number(req.body.price) < 0)){
        throw new AppError("Price must be positive", 400);
    }

    const product = products[idx];
    const allowed = ['name','price','category'];
    for(const key of Object.keys(req.body)){
        if(allowed.includes(key)){
            product[key] = key === 'price' ? Number(req.body[key]) : req.body[key];
         }
    }

    products[idx] = product;
    res.json(product);

}));

router.delete('/:id',auth,asyncHandler(async (req,res)=>{

    const idx = findProductIndex(req.params.id);

    if(idx==-1){
        throw new AppError("Product not found", 404);
    }

    products.splice(idx,1);
    res.status(204).send();


}));

router.get('/:id/related',auth,asyncHandler(async (req,res)=>{

    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);
    if(!product){
        throw new AppError("Product not found", 404);
    }
    const related = products.filter(p => p.category === product.category && p.id!== id);
    res.json(related);

}));

module.exports = router;
