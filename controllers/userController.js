const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const fs = require('fs')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

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

  getUser: (req, res) => { console.log('getUser',req.params)
    User.findByPk(req.params.id).then(user => {console.log(user)
      return res.render('profile',{ user: user.toJSON() })
    })
  },

  editUser: (req, res) => { console.log('editUser',req.params, req.user)
    User.findByPk(req.params.id).then(user => {
      return res.render('edit',{ user: user.toJSON() })
    })
  },

  putUser: (req, res) => {
    console.log('puUser',req.params, req.user)
    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return User.findByPk(req.params.id)
          .then(user => { 
            console.log(req.body, user)
            user.update({ ...req.body, image: file ? `/upload/${file.originalname}` : null })
            .then(() => {
              req.flash('success_messages', '使用者資料修改成功')
              return res.redirect(`/users/${ req.params.id }`)
            })
          })
        })
      })
    } else {
      return User.findByPk(req.params.id)
      .then(user => { user.update({ ...req.body, image: req.user.image })
        .then(() => {
          req.flash('success_messages', '使用者資料修改成功')
          return res.redirect(`/users/${ req.params.id }`)
        })
      })
    }
  }
}

module.exports = userController