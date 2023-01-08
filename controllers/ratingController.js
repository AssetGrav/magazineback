const ApiError = require("../error/ApiError");
const { Rating, Device } = require("../models/models");

class RatingController {
  async create(req, res, next) {
    try {
      const { rate, userId, deviceId } = req.body;
      let checkRate = await Rating.findOne({ where: { userId, deviceId } });
      if (!checkRate) {
        const rating = await Rating.create({ rate, userId, deviceId });
        const findRate = await Rating.findAndCountAll({ where: { deviceId } });
        let ratingArray = findRate.rows.map((elem) => {
          return Number(elem.rate);
        });
        let total = ratingArray.reduce(function (a, b) {
          return a + b;
        });
        console.log("+++++++++", total, Math.round(total / findRate.count));
        const newBasketDevice = await Device.update(
          { rating: Math.floor(total / findRate.count) },
          {
            where: { id: deviceId },
          }
        );
        return res.json({ rate: rating, type: "new" });
      } else {
        return res.json({ rate: checkRate, type: "old" });
      }
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async getOne(req, res) {
    const { deviceId } = req.body;
    const findRate = await Rating.findAndCountAll({ where: { deviceId } });
    return res.json(findRate);
  }
}

module.exports = new RatingController();
