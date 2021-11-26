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
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      return res.json(data)
    }) 
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res , (data) => {
      return res.json(data)
      // if (data['status' === 'error']) {
      // req.flash('error_messages', data['message'])
      // return res.redirect('back')
      // }
      // req.flash('success_message', data['message'])
      // return res.redirect('/admin/restaurants')
    })
    // const { categoryId } = req.body
    // if (!req.body.name) {
    //   req.flash('error_messages', 'name didn`t exist')
    //   return res.redirect('back')
    // }
    // const { file } = req
    // if (file) {
    //   imgur.setClientID(IMGUR_CLIENT_ID)
    //   imgur.upload(file.path, (err, img) => {
    //     return Restaurant.findByPk(req.params.id).then((restaurant) => {
    //       restaurant
    //         .update({
    //           ...req.body,
    //           image: file ? img.data.link : restaurant.image,
    //           CategoryId: categoryId
    //         })
    //         .then((restaurant) => {
    //           req.flash('success_messages', 'restaurants was successfully update')
    //           res.redirect('/admin/restaurants')
    //         })
    //     })
    //   })
    // } else {
    //   return Restaurant.findByPk(req.params.id).then((restaurant) => {
    //     restaurant
    //       .update({
    //         ...req.body,
    //         image: restaurant.image,
    //         CategoryId: categoryId
    //       })
    //       .then(restaurant => {
    //         req.flash('success_messages', 'restaurant was successfully update')
    //         res.redirect('/admin/restaurants')
    //       })
    //   })
    // }
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      return res.json(data)
      // res.json({ status: 'success', message: '己成功刪除。'})
    })
  },
}

module.exports = adminController