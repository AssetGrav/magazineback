const uuid = require("uuid");
const path = require("path");
const { Device, DeviceInfo } = require("../models/models");
const ApiError = require("../error/ApiError");

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));

      const device = await Device.create({
        name,
        price,
        rating,
        brandId,
        typeId,
        img: fileName,
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((i) => {
          DeviceInfo.create({
            title: i.title,
            description: i.description,
          });
        });
      }

      return res.json(device);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    } finally {
      res.end();
    }
  }
  async getAll(req, res) {
    try {
      let { brandId, typeId, page, limit } = req.query;
      console.log("device query", req.query);
      page = page || 1;
      limit = limit || 9;
      let offset = page * limit - limit;
      let devices;
      if (!brandId && !typeId) {
        devices = await Device.findAndCountAll({ limit, offset });
      }
      if (brandId && !typeId) {
        devices = await Device.findAndCountAll(
          { where: { brandId } },
          limit,
          offset
        );
      }
      if (!brandId && typeId) {
        devices = await Device.findAndCountAll(
          { where: { typeId } },
          limit,
          offset
        );
      }
      if (brandId && typeId) {
        devices = await Device.findAndCountAll(
          { where: { typeId, brandId } },
          limit,
          offset
        );
      }
      return res.json(devices);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    } finally {
      res.end();
    }
  }
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const device = await Device.findOne({
        where: { id },
        include: [{ model: DeviceInfo, as: "info" }],
      });
      return res.json(device);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    } finally {
      res.end();
    }
  }
}

module.exports = new DeviceController();
