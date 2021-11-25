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

}

module.exports = categoryService