const db = require('../../models')
const Category = db.Category

const categoryService = require('../../services/categoryServices')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },
  
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      return res.json(data)
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

}

module.exports = categoryController