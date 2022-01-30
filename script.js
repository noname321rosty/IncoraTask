class User {
    constructor(name, balance) {
      this.name = name;
      this.balance = balance;
      this.cart = new Cart(this);
    }
  
    getCart() {
      return this.cart;
    }
  
    addProductToCart(product) {
      this.cart.addProduct(product);
    }
  
    substractBalance(amount) {
      if (this.balance - amount < 0) {
        throw new Error(`Sorry, ${this.name} don't have enough money`);
      }
      this.balance = this.balance - amount;
    }
  
    addOrder(info) {
      this.substractBalance(info.totalPrice);
  
      return new Order(info);
    }
  }
  
  class Admin extends User {
    createProduct(name, price, amountOfProducts) {
      const product = new Product(name, price, amountOfProducts);
  
      return product;
    }
  }
  
  class Product {
    constructor(name, price, amountOfProducts) {
      this.name = name;
      if (amountOfProducts > 0) {
        this.price = price;
        this.amountOfProducts = amountOfProducts;
      } else {
        throw new Error('Please, input valid amount!');
      }
    }
  
    substractAmount() {
      if ((this.amountOfProducts - 1) < 0) {
        throw new Error(`${this.name} is sold`);
      }
      this.amountOfProducts = this.amountOfProducts - 1;
    }
  }
  
  class Cart {
    constructor(user) {
      this.cart = [];
      this.user = user;
    }
  
    addProduct(product) {
      return this.cart.push(product);
    }
  
    removeProduct(name) {
      const productIndex = this.cart.findIndex(item => item.name === name);
      this.cart.splice(productIndex, 1);
  
      return this.cart;
    }
  
    withdraw() {
      this.cart = [];
  
      return this.cart;
    }
  
    checkout() {
      const dateOfOrder = new Date().toLocaleString();
      const totalPrice = this.cart.reduce((acc, product) => {
        product.substractAmount();
  
        return acc + product.price;
      }, 0);
  
      const info = {
        orderedProducts: this.cart,
        totalPrice,
        dateOfOrder,
      };
  
      return this.user.addOrder(info);
    }
  }
  
  class Order {
    constructor(info) {
      this.orderedProducts = info.orderedProducts.map(product => product.name);
      this.totalPrice = info.totalPrice;
      this.dateOfOrder = info.dateOfOrder;
    }
  }
  
  const admin = new Admin('Ostap', 1000);
  console.log(`Admin ${admin.name} was created`);
  const banana = admin.createProduct('banana', 10, 5);
  const milk = admin.createProduct('milk', 130, 2);
  const apple = admin.createProduct('apple', 50, 3);
  console.log('Admin Bodya created some products');
  const user = new User('Oleh', 500);
  console.log(`User ${user.name} was created`);
  user.addProductToCart(banana);
  user.addProductToCart(milk);
  user.cart.removeProduct('milk');
  console.log('Buy only fruits, remove milk');
  user.addProductToCart(apple);
  console.log('Oleh added banana, milk, apple to cart');
  console.log('Oleh created order: ', user.cart.checkout());
  console.log('Oleh\'s balance:', user.balance);
