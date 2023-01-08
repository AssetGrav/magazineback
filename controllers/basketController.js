const ApiError = require("../error/ApiError");
const { Basket, BasketDevice, Device } = require("../models/models");

class BasketController {
  async create(req, res, next) {
    try {
      const { deviceId, userId, quantity } = req.body;
      const basket = await Basket.findOne({ where: { userId } });
      try {
        const basketDevice = await BasketDevice.findOne({
          where: { deviceId, basketId: basket.id },
        });
        if (!basketDevice) {
          const newBasketDevice = await BasketDevice.create({
            deviceId: deviceId,
            basketId: basket.id,
            quantity: quantity,
          });
          return res.json(newBasketDevice);
        }
      } catch (error) {
        next(ApiError.badRequest(error.message));
      }
    } catch (error) {
      next(ApiError.badRequest(error.message));
    } finally {
      res.end();
    }
  }

  async getAll(req, res, next) {
    try {
      const { userId } = req.params;
      const basket = await Basket.findOne({ where: { userId } });
      const basketId = basket.id;
      const basketDevices = await BasketDevice.findAndCountAll({
        where: { basketId },
      });
      const devices = await Device.findAndCountAll();
      const endBasket = basketDevices.rows.map((elem) => {
        const devicesFind = devices.rows.find((e) => {
          return e.id === elem.deviceId;
        });
        return { date: devicesFind, quantity: elem.quantity };
      });

      return res.json(endBasket);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    } finally {
      res.end();
    }
  }

  async updateQuantity(req, res) {
    try {
      let { deviceId, basketId, quantity } = req.body;
      const basketDevice = await BasketDevice.findOne({
        where: { deviceId, basketId },
      });
      const id = basketDevice.id;
      const newBasketDevice = await BasketDevice.update(
        { quantity: quantity },
        {
          where: { id },
        }
      );
      const update = await BasketDevice.findOne({
        where: { deviceId, basketId },
      });
      return res.json(update);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new BasketController();
