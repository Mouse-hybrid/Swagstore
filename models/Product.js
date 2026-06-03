'use strict';

const fs = require('fs');
const path = require('path');
const Category = require('./Category');
const types = require('../data/types.json');

const dataFile = path.join(__dirname, '..', 'data', 'products.json');

function readProducts() {
  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function writeProducts(products) {
  fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));
}

class Product {
  static getAll() { 
    return readProducts(); 
  }
  
  static getById(id) { 
    return readProducts().find(p => p.id === Number(id)); 
  }
  
  static getCategories() {
    return Category.getAll();
  }
  
  static getTypes() {
    return types;
  }

  // --- THÊM MỚI: Các hàm CRUD dành cho Staff ---
  static add({ name, price, category, type, image }) {
    if (!name || !price || !category || !type) {
      throw new Error('Name, price, category, and type are required.');
    }
    const products = readProducts();
    const newProduct = {
      id: Date.now(),
      name: String(name).trim(),
      price: Number(price),
      category: String(category).trim(),
      type: String(type).trim(),
      image: image || '/images/default.jpg'
    };
    products.push(newProduct);
    writeProducts(products);
    return newProduct;
  }

  static update(id, fields) {
    const products = readProducts();
    const idx = products.findIndex(p => p.id === Number(id));
    if (idx === -1) throw new Error('Product not found.');
    
    products[idx] = { ...products[idx], ...fields };
    if (fields.price) products[idx].price = Number(fields.price);
    
    writeProducts(products);
    return products[idx];
  }

  static delete(id) {
    const products = readProducts();
    const filtered = products.filter(p => p.id !== Number(id));
    if (products.length === filtered.length) throw new Error('Product not found.');
    writeProducts(filtered);
    return true;
  }
}

module.exports = Product;