const Product = require('../models/Product');

const resolvers = {
  Product: {
    id: (parent) => parent.id || (parent._id && parent._id.toString())
  },
  Query: {
    products: async (_, { category, minPrice, maxPrice }) => {
      const filter = {};
      
      if (category) {
        filter.category = category;
      }
      
      if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};
        if (minPrice !== undefined) filter.price.$gte = minPrice;
        if (maxPrice !== undefined) filter.price.$lte = maxPrice;
      }
      
      return await Product.find(filter);
    },
    product: async (_, { id }) => {
      return await Product.findById(id);
    }
  },
  Mutation: {
    createProduct: async (_, args) => {
      const newProduct = new Product(args);
      return await newProduct.save();
    },
    updateProduct: async (_, { id, ...updates }) => {
      return await Product.findByIdAndUpdate(id, updates, { new: true });
    },
    deleteProduct: async (_, { id }) => {
      const result = await Product.findByIdAndDelete(id);
      return result ? true : false;
    }
  }
};

module.exports = resolvers;
