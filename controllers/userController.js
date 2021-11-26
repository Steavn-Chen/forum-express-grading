const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const helpers = require('../_helpers')
const { Op } = require("sequelize");

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
      DISTINCT : [
        { model: Comment, attributes : 'RestaurantId' }
      ], 
      include: [
        Comment,
        { model: Comment, include: [Restaurant] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Restaurant, as: 'FavoritedRestaurants' },
      ]})
      .then((user) => {
      const set = new Set()
      let userComments = user.Comments
      userComments = userComments.map(d => {
       console.log(d)
        return {
        CommentId: d.id ,
        RestaurantId: d.RestaurantId,      
        RestaurantImage: d.Restaurant.image ? d.Restaurant.image : null
      }})
      userComments = userComments.filter(item=> !set.has(item.RestaurantId)? set.add(item.RestaurantId) : false)

      const FollowerCount = user.Followers.length 
      const FollowingCount = user.Followings.length
      const FavoriteRestaurantsCount = user.FavoritedRestaurants.length
      const isFollower = user.Followers.map(d => d.id).includes(req.user.id)
      const anotherUserId = Number(req.params.id)
      const userId = req.user.id
      return res.render('profile', { user: user.toJSON(), anotherUserId, userId, isFollower ,FollowerCount, FollowingCount, FavoriteRestaurantsCount, userComments })
    })
  },

  editUser: (req, res) => {
    const operatorId = helpers.getUser(req).id
    if (Number(req.params.id) !== operatorId) {
      req.flash('error_messages', '只能編輯自己的資訊 !')
      return res.redirect(`/users/${operatorId}`)
    }
    return User.findByPk(req.params.id).then(user => {
      return res.render('edit', { user: user.toJSON() })
    })
  },

 
  putUser: (req, res) => {
    User.findAll({
      where: {
        email: { [Op.not]: [req.user.email] }
      }
    }).then(userData => {
      let isEmailCheck = userData.map(d =>  d.email ).includes(req.body.email)
      if (!req.body.name || !req.body.email) {
        req.flash('error_messages', '名字與信箱不能為空!')
        res.redirect('back')
      }
       else if (isEmailCheck) { 
        req.flash('error_messages', '此信箱己經有人註冊!')
        return res.redirect('back')
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
                  return res.redirect(`/users/${req.params.id}`)
                })
            })
        })
      } else {
        return User.findByPk(req.params.id)
          .then(user => {
            user.update({ ...req.body, image: user.image })
              .then(() => {
                req.flash('success_messages', '使用者資料編輯成功')
                return res.redirect(`/users/${req.params.id}`)
              })
          })
      }
    })
  },

  addFavorite: (req, res) => {
    const operatorId = helpers.getUser(req).id ? helpers.getUser(req).id : req.user.id
    return Favorite.create({
      UserId: operatorId,
      RestaurantId: req.params.restaurantId
    }).then(restaurant => {
      return res.redirect('back')
    })
  },

  
  removeFavorite: (req, res) => {
    // 設 operatorId 為測試跟本地端的 userId， userId 是從 1 開始所以找不到時設為 0 
    const operatorId = 0 ? 0 : req.user.id
    return Favorite.destroy({
      where: {
        UserId: operatorId,
        RestaurantId: req.params.restaurantId,
      },
    }).then((favorite) => {
        return res.redirect('back')
    })
  },

  addLike: (req, res) => {
    const operatorId = helpers.getUser(req).id ? helpers.getUser(req).id : req.user.id
    return Like.create({
      UserId: operatorId,
      RestaurantId: req.params.restaurantId
    }).then(restaurant => {
      return res.redirect('back')
    })
  },

  removeLike: (req, res) => {
    const operatorId = helpers.getUser(req).id ? helpers.getUser(req).id : req.user.id
    return Like.destroy({
      where: {
        UserId: operatorId,
        RestaurantId: req.params.restaurantId
      }
    })
      .then(likes => {
        return res.redirect('back')
      })
  },

  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers'}
      ]
    }).then(users => {
      users = users.map(user => ({...user.dataValues,
      FollowerCount: user.Followers.length,
      isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
    }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount )
      const userId = req.user.id
      return res.render('topUser', { users: users, userId})
    })
  },

  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    }).then(followship => {
      return res.redirect('back')
    })
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: Number(req.params.userId)
      }
    }).then(followship => {
      followship.destroy()
        .then(followship => {
          return res.redirect('back')
        })
    })
  }
}

module.exports = userController
