const express = require('express');

const router =  express.Router();

const auth = require('../middleware/auth');

const products = require('../data/products');

let nextId = 3;

function findProductIndex(id){
    return products.findIndex(p => p.id === Number(id));
}

router.get('/',auth,(req,res)=>{
    const {category , sort} = req.query;

    let result = products.slice();

    if(category){
        result = result.filter(p=>p.category === category);
    }

    if(sort === 'price'){
        result.sort((a,b) => a.price - b.price);
    }

    res.json(result);

});

router.get('/:id',auth,(req,res)=>{

    const id = Number(req.params.id);
    const product = products.find(p=>p.id === id);

    if(!product){
        return res.status(404).json({error: "Product not found"});
    }
    res.json(product);

});

router.post('/',auth,(req,res)=>{

    const {name,price,category} = req.body;

    if(!name || price === undefined || !category){
        return res.status(400).json({error:"Missing required fields : name,price,category"});
    }

    const newProduct = {id : nextId++,  name,price:Number(price) , category};
    products.push(newProduct);
    res.status(201).json(newProduct);

});

router.put('/:id',auth,(req,res)=>{

    const {name,price,category} = req.body;

    const idx = findProductIndex(req.params.id);
    
    if(idx==-1){
        return res.status(404).json({error: "Product not found"});
    }

    if(!name || price === undefined || !category){
        return res.status(400).json({error:"Missing required fields : name,price,category"});
    }

    const updated = {id : products[idx].id , name , price: Number(price), category};

    products[idx] = updated;

    res.json(updated);


});


router.patch('/:id',auth,(req,res)=>{

    const idx = findProductIndex(req.params.id);

    if(idx==-1){
        return res.status(404).json({error: "Product not found"});
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

});

router.delete('/:id',auth,(req,res)=>{

    const idx = findProductIndex(req.params.id);

    if(idx==-1){
        return res.status(404).json({error:  "Product not found"});
    }

    products.splice(idx,1);
    res.status(204).send();


});

router.get('/:id/related',auth,(req,res)=>{

    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);
    if(!product){
        return res.status(404).json({error: "product not found"});
    }
    const related = products.filter(p => p.category === product.category && p.id!== id);
    res.json(related);
    
});

module.exports = router;