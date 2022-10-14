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
          callback({ categories, category: category.toJSON() })
        })
      } else {
        callback({ categories })
      }
    })
  },

  postCategory: (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      return callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      return Category.create({
        name
      })
        .then(category => {
          callback({ status: 'success', message: 'category was successfully created' })
        })
    }
  },

  putCategory: (req, res, callback) => {
    const categoryId = req.params.id
    const { name } = req.body
    if (!name) {
      return callback({ status: 'error', message: 'name didn\'t exist' })
    } else {
      return Category.findByPk(categoryId)
        .then(category => {
          category.update({ name })
            .then(category => {
              callback({ status: 'success', message: 'name didn\'t exist' })
            })
        })
    }
  },

  deleteCategory: (req, res, callback) => {
    const categoryId = req.params.id
    return Category.findByPk(categoryId)
      .then(category => {
        category.destroy()
          .then(category => {
            callback({ status: 'success', message: '己成功刪除' })
          })
      })
  }
}

module.exports = categoryService