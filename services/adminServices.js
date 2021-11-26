const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
      }).then(restaurants => {
        callback({ restaurants: restaurants})
      })
  },

  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] }).then(
      (restaurant) => {
        callback({ restaurant: restaurant.toJSON() })
      }
    )
  },

  postRestaurant: (req, res, callback) => {
    const { categoryId } = req.body
    if (!req.body.name) {
      return callback({ status: 'error', message: 'name didn`t exist'})
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          ...req.body,
          image: file ? img.data.link : null,
          CategoryId: categoryId
        }).then((restaurant) => {
          callback({ status: 'success', message: 'restaurant was successfully created'})
        })
      })
    } else {
      return Restaurant.create({
        ...req.body,
        image: null,
        CategoryId: categoryId
      }).then((restaurant) => {
        callback({ status: 'success', message: 'restaurant was successfully created' })
      })
    }
  },

  putRestaurant: (req, res, callback) => {
    const { categoryId } = req.body
    if (!req.body.name) {
      return callback({ status: 'error', message: 'name didn`t exist'})
      // req.flash('error_messages', 'name didn`t exist')
      // return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then((restaurant) => {
          restaurant
            .update({
              ...req.body,
              image: file ? img.data.link : restaurant.image,
              CategoryId: categoryId
            })
            .then((restaurant) => {
              callback({ status: 'success', message: 'restaurants was successfully update'})
              // req.flash('success_messages', 'restaurants was successfully update')
              // res.redirect('/admin/restaurants')
            })
        })
      })
    } else {
      return Restaurant.findByPk(req.params.id).then((restaurant) => {
        restaurant
          .update({
            ...req.body,
            image: restaurant.image,
            CategoryId: categoryId
          })
          .then(restaurant => {
            callback({ status: 'success', message: 'restaurants was successfully update'})
            // req.flash('success_messages', 'restaurant was successfully update')
            // res.redirect('/admin/restaurants')
          })
      })
    }
  },

  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            callback({ status: 'success', message: '己成功刪除!'})
          })
      })
  },
}

module.exports = adminService