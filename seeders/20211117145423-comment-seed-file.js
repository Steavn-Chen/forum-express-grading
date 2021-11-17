'use strict';
const faker = require('faker')

const commentSeeder =  Array.from({ length: 10 }).map((d, i) => ({
  text: faker.commerce.productDescription(),
  UserId: 10,
  RestaurantId: Math.floor((Math.random() * (172+1-123)) +123),
  createdAt: new Date(),
  updatedAt: new Date()
}), {}).concat(Array.from({ length: 10 }).map((d, i) => ({
  text: faker.commerce.productDescription(),
  UserId: 11,
  RestaurantId: Math.floor((Math.random() * (172+1-123)) +123),
  createdAt: new Date(),
  updatedAt: new Date()
}), {}),Array.from({ length: 10 }).map((d, i) => ({
  text: faker.commerce.productDescription(),
  UserId: 12,
  RestaurantId: Math.floor((Math.random() * (172+1-123)) +123),
  createdAt: new Date(),
  updatedAt: new Date()
}), {}))

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',commentSeeder
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
