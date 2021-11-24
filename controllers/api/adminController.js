const db = require('../../models')
const User = db.User
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = require('../../services/adminServices')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  // getRestaurants: (req, res) => {
  //   return Restaurant.findAll({
  //     raw: true,
  //     nest: true,
  //     include: [Category]
  //     }).then(restaurants => {
  //       return res.json({ restaurants: restaurants})
  //     })
  }
}

module.exports = adminController