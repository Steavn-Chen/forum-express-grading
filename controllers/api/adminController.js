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
      // if (data['status'] === 'error') {
      //   req.flash('error_messages', data['message'])
      //   return res.redirect('back')
      // }
      // req.flash('success_messages', data['message'])
      // res.redirect('/admin/restaurants')
    }) 
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      res.json({ status: 'success', message: '己成功刪除。'})
    })
  },
}

module.exports = adminController