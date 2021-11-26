const db = require('../models')
const Category = db.Category

const categoryService = require('../services/categoryServices')

const categoryController = {

  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories',data)
    })
  },

  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/categories')
    })
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
