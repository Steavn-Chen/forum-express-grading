// const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant
const User = db.User

const adminService = require('../services/adminServices')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants',data )
    })
  },

  
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
    // return Restaurant.findByPk(req.params.id, { include: [Category] }).then(
    //   (restaurant) => {
    //     return res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
    //   }
    // )
  },

  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', { categories: categories })
    })
  },

  postRestaurant: (req, res) => {console.log(req.body)
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    }) 
  },

  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(
        (restaurant) => {
          return res.render('admin/create', {
            categories: categories,
            restaurant: restaurant.toJSON()
          })
        })
    })
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res , (data) => {
      if (data['status' === 'error']) {
      req.flash('error_messages', data['message'])
      return res.redirect('back')
      }
      req.flash('success_message', data['message'])
      return res.redirect('/admin/restaurants')
    })
  
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },

  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then(users => {
      return res.render('admin/users', { users: users })
    })
  },

  toggleAdmin: (req, res) => {
    const id = req.params.id
    return User.findByPk(id)
      .then(user => {
        if (user.name === 'root' || user.name === 'admin') {
          req.flash('error_messages', '禁止變更管理者權限')
          return res.redirect('back')
        }
        return user.update({ isAdmin: !user.isAdmin }).then(user => {
          req.flash('success_messages', '使用者權限變更成功')
          res.redirect('/admin/users')
        })
      })
  }
}

module.exports = adminController
