const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const fs = require('fs')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const helpers = require('../_helpers')


const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同!')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱重覆')
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
              req.flash('success_messages', '成功註冊帳號')
              return res.redirect('/signin')
            })
          }
        })
    }
  },
  
  signInPage: (req, res) => {
    return res.render('signin')
  },
  
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      // raw: true,
      // nest: true,
      include: [ Comment, { model: Comment, include: [Restaurant] }] }).then(user => {
      return res.render('profile',{ user: user.toJSON() })
    })
  },

  editUser: (req, res) => {
    const operatorId = helpers.getUser(req).id
    if (Number(req.params.id) !== operatorId) {
      req.flash('error_messages', '只能編輯自己的資訊 !')
      return res.redirect(`/users/${operatorId}`)
    }
    return User.findByPk(req.params.id).then(user => {
      return res.render('edit',{ user: user.toJSON() })
    })
  },

  putUser: (req, res) => {
    if (!req.body.name || !req.body.email) {
      req.flash('error_messages', '名字與信箱不能為空!')
      res.redirect('back')
    }
    
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
        .then(user => {
          user.update({ ...req.body, image: file ? img.data.link : null })
          .then(() => {
            req.flash('success_messages', '使用者資料編輯成功')
            return res.redirect(`/users/${ req.params.id }`)
          })
        })
      })
    } else {
      return User.findByPk(req.params.id)
      .then(user => {
        user.update({ ...req.body, image: user.image })
        .then(() => {
          req.flash('success_messages', '使用者資料編輯成功')
          return res.redirect(`/users/${ req.params.id }`)
        })
      })
    }
  },

  addFavorite: (req, res) => {console.log(req.params,req.user)
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(restaurant => {
      return res.redirect('back')
    })
  },

  removeFavorite: (req, res) => {console.log(req.params,req.user)
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId 
      }
    }).then(favorite => {
      favorite.destroy()
      return res.redirect('back')
    })
  }
}

module.exports = userController