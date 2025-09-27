import { where } from "sequelize";
import db from "../../models/index.js";
const FetchFrameAvatar = async (req, res) => {
  try {
    const resp = await db.Avatarframe.findAll();
    if (resp) {
      return res.status(200).json({
        RM: "frame avatar list!",
        RC: 200,
        RD: resp,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Internal server!",
      RC: 500,
    });
  }
};

const NewFrameAvatar = async (req, res) => {
  try {
    const { framename, price } = req.body;
    const url = req.file?.filename;
    if (!framename || !price || !url) {
      return res.status(200).json({
        RM: "missing parameter!",
        RC: -203,
      });
    }
    const newframe = {
      framename,
      price,
      url,
    };
    await db.Avatarframe.create(newframe);
    return res.status(200).json({
      RM: "add new frame complete!",
      RC: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Internal server!",
      RC: 500,
    });
  }
};

const EditFrameAvatar = async (req, res) => {
  try {
    const { framename, price, url: oldUrl } = req.body;
    const { id } = req.params;
    const url = req.file?.filename || oldUrl;

    if (!framename || !price || !id) {
      return res.status(400).json({
        RM: "Missing parameter!",
        RC: -203,
      });
    }

    const frame = await db.Avatarframe.findByPk(id);

    if (!frame) {
      return res.status(404).json({
        RM: "Frame not found!",
        RC: -204,
      });
    }

    await frame.update({ framename, price, url });

    return res.status(200).json({
      RM: "Update frame complete!",
      RC: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Internal server!",
      RC: 500,
    });
  }
};

const DeleteFrame = async (req, res) => {
  try {
    const { id } = req?.params;
    const Frame = await db.Avatarframe.findByPk(id);
    if (Frame) {
      await db.Avatarframe.destroy(Frame);
      return res.status(200).json({
        RM: "Frame delete successfuly!",
        RC: 200,
      });
    } else {
      return res.status(404).json({
        RM: "Can't find frame!",
        RC: 404,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Internal server!",
      RC: 500,
    });
  }
};

const Editbackground = async (req, res) => {
  try {
    const url = req.file?.filename;
    const { id } = req.body;
    if (!url || !id) {
      return res.status(400).json({
        RM: "Missing parameter!",
        RC: -203,
      });
    }
    const usframe = await db.UserFrame.findOne({
      where: { UserID: id },
    });
    if (!usframe) {
      return res.status(404).json({
        RM: "UserFrame not found!",
        RC: -204,
      });
    }
    await usframe.update({
      Backgroud: url,
    });
    return res.status(200).json({
      RM: "Background updated!",
      RC: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Internal server!",
      RC: 500,
    });
  }
};

export default {
  FetchFrameAvatar,
  EditFrameAvatar,
  NewFrameAvatar,
  Editbackground,
  DeleteFrame,
};
