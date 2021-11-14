// const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant
const User = db.User

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ 
      raw: true,
      nest: true,
      include: [Category]
     }).then((restaurants) => {
      return res.render('admin/restaurants', { restaurants: restaurants })
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', { categories:categories })
    })
  },

  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    if (!req.body.name) {
      req.flash('error_messages', 'name didn`t exist')
      res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: file ? img.data.link : null,
          CategoryId:categoryId
        }).then((restaurant) => {
          req.flash('success_messages', 'restaurant was successfully created')
          res.redirect('/admin/restaurants')
        })
      })
    } else {
      return Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image:  null,
        CategoryId:categoryId
      }).then(restaurant => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
    }
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] }).then(
      (restaurant) => {
        return res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
      }
    )
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
            restaurant: restaurant.toJSON() })
        })
    })
  },

  putRestaurant: (req, res) => {console.log(req.body)
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    if (!req.body.name) {
      req.flash('error_messages', 'name didn`t exist')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then((restaurant) => {
          restaurant
            .update({
              name,
              tel,
              address,
              opening_hours,
              description,
              image: file ? img.data.link : restaurant.image,
              CategoryId:categoryId
            })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurants was successfully update')
              res.redirect('/admin/restaurants')
            })
        })
      })
    } else {
      return Restaurant.findByPk(req.params.id).then((restaurant) => {
        restaurant
          .update({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: restaurant.image,
            CategoryId:categoryId
          })
          .then(restaurant => {
            req.flash('success_messages', 'restaurant was successfully update')
            res.redirect('/admin/restaurants')
          })
      })
    }
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            res.redirect('/admin/restaurants')
          })
    })
  },

  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then(users => {
      return res.render('admin/users', { users: users })
    })
  },
  
  // 交作業寫法 之二 畫面反應有時user/admin正常
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

