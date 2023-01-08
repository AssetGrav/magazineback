const ApiError = require("../error/ApiError");
const { Brand } = require("../models/models");

class BrandController {
  async create(req, res) {
    try {
      const { name } = req.body;
      const brand = await Brand.create({ name });
      return res.json(brand);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    } finally {
      res.end();
    }
  }
  async getAll(req, res) {
    try {
      const brands = await Brand.findAll();
      return res.json(brands);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    } finally {
      res.end();
    }
  }
}

module.exports = new BrandController();
