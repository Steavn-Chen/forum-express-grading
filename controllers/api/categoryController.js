const db = require('../../models')
const Category = db.Category
const categoryController = {
  getCategories: (req, res) => {
    const categoryId = req.params.id
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      // if (categoryId) {
      //   Category.findByPk(categoryId).then(category => {
      //     return res.render('admin/categories', { categories: categories, category: category.toJSON() })
      //   })
      // } else {
        return res.json({ categories: categories })
      // }
    })
  },

}

module.exports = categoryController