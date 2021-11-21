const db = require('../models')
const Category = db.Category
const categoryController = {

  getCategories: (req, res) => {
    const categoryId = req.params.id
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (categoryId) {
        Category.findByPk(categoryId).then(category => {
          return res.render('admin/categories', { categories: categories, category: category.toJSON() })
        })
      } else {
        return res.render('admin/categories', { categories: categories })
      }
    })
  },

  postCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      return Category.create({
        name
      })
        .then(category => {
          res.redirect('/admin/categories')
        })
    }
  },

  putCategory: (req, res) => {
    const categoryId = req.params.id
    const { name } = req.body
    if (!name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      return Category.findByPk(categoryId)
        .then(category => {
          category.update({ name })
            .then(category => {
              res.redirect('/admin/categories')
            })
        })
    }
  },

  deleteCategory: (req, res) => {
    const categoryId = req.params.id
    return Category.findByPk(categoryId)
      .then(category => {
        category.destroy()
          .then(category => {
            res.redirect('/admin/categories')
          })
      })
  }
}

module.exports = categoryController
