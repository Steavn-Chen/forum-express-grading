const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    const categoryId = req.params.id
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (categoryId) {
        Category.findByPk(categoryId).then(category => {
          callback({ categories: categories, category: category.toJSON() })
        })
      } else {
        callback({ categories: categories })
      }
    })
  },


  postCategory: (req, res,callback) => {
      const { name } = req.body
    if (!name) {
      return callback({ status: 'error', message: 'name didn\'t exist'})
    } else {
      return Category.create({
        name
      })
        .then(category => {
          callback({ status: 'success', message: 'category was successfully created'})
        })
    }

    // const { name } = req.body
    // if (!name) {
    //   req.flash('error_messages', 'name didn\'t exist')
    //   return res.redirect('back')
    // } else {
    //   return Category.create({
    //     name
    //   })
    //     .then(category => {
    //       res.redirect('/admin/categories')
    //     })
    // }
  },

}

module.exports = categoryService