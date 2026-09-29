const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    price: Float!
    stock: Int!
    category: String!
    description: String
  }

  type Query {
    products(category: String, minPrice: Float, maxPrice: Float): [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(
      name: String!
      price: Float!
      stock: Int!
      category: String!
      description: String
    ): Product!

    updateProduct(
      id: ID!
      name: String
      price: Float
      stock: Int
      category: String
      description: String
    ): Product

    deleteProduct(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
