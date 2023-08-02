const { productsCollection } = require("../..");

// Create a new product (for admin)
exports.createProduct = async (req, res) => {
    try {
      // Check if the MongoDB connection is established
      if (!req.productsCollection) {
        return res.status(500).json({ message: 'MongoDB connection not established' });
      }
  
      // Check if the user is an admin (if required)
      /* if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      } */
  
      const { name, price, description, category } = req.body;
  
      // Use the 'productsCollection' to insert the new product
      await req.productsCollection.insertOne({ name, price, description, category });
  
      res.status(201).json({ message: 'Product created successfully' });
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Get all products
  exports.getAllProducts = async (req, res) => {
    try {
      // Check if the MongoDB connection is established
      if (!req.productsCollection) {
        return res.status(500).json({ message: 'MongoDB connection not established' });
      }
  
      const products = await req.productsCollection.find().toArray();
      res.status(200).json(products);
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Get a single product by ID
exports.getSingleProduct = async (req, res) => {
    try {
      // Check if the MongoDB connection is established
      if (!req.productsCollection) {
        return res.status(500).json({ message: 'MongoDB connection not established' });
      }
  
      const { productId } = req.params;
  
      // Find the product by ID
      const product = await req.productsCollection.findOne({ _id: productId });
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json(product);
    } catch (err) {
      console.error('Error fetching product:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Update a product by ID
  exports.updateProduct = async (req, res) => {
    try {
      // Check if the MongoDB connection is established
      if (!req.productsCollection) {
        return res.status(500).json({ message: 'MongoDB connection not established' });
      }
  
      const { productId } = req.params;
      const { name, price, description, category } = req.body;
  
      // Find the product by ID
      const product = await req.productsCollection.findOne({ _id: productId });
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Update the product details
      await req.productsCollection.updateOne({ _id: productId }, { $set: { name, price, description, category } });
  
      res.status(200).json({ message: 'Product updated successfully' });
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Delete a product by ID
  exports.deleteProduct = async (req, res) => {
    try {
      // Check if the MongoDB connection is established
      if (!req.productsCollection) {
        return res.status(500).json({ message: 'MongoDB connection not established' });
      }
  
      const { productId } = req.params;
  
      // Find the product by ID
      const product = await req.productsCollection.findOne({ _id: productId });
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Delete the product
      await req.productsCollection.deleteOne({ _id: productId });
  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };