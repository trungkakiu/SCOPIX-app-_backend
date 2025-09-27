import db from "../../models/index.js";

const getAllframe = async (req, res) => {
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

const buyframe = async (req, res) => {
  try {
    const { UserID, FrameID } = req.body;
    if (!UserID || !FrameID) {
      return res.status(200).json({ RM: "Missing parameters!", RC: -203 });
    }

    const user = await db.Account.findOne({
      where: { id: UserID },
      include: [
        {
          model: db.UserFrame,
          as: "ownedFrames",
          include: [{ model: db.Avatarframe, as: "avatarFrame" }],
        },
      ],
    });

    if (!user) {
      return res.status(200).json({ RM: "User not found!", RC: -204 });
    }

    const frame = await db.Avatarframe.findOne({ where: { id: FrameID } });
    if (!frame) {
      return res.status(200).json({ RM: "Frame not found!", RC: -204 });
    }

    if (user.coin < frame.price) {
      return res.status(200).json({ RM: "Không đủ xu!", RC: -206 });
    }

    const existingOwnership = await db.UserFrame.findOne({
      where: { UserID, FrameID },
    });
    if (existingOwnership) {
      return res.status(200).json({ RM: "Bạn đã có khung này rồi!", RC: -207 });
    }

    user.coin -= frame.price;
    await user.save();

    await db.UserFrame.create({ UserID, FrameID, IsUsed: false });

    await db.CoinTransaction.create({
      UserID,
      amount: -frame.price,
      status: "success",
      type: "spend",
    });

    const updatedUser = await db.Account.findOne({
      where: { id: UserID },
      include: [
        {
          model: db.UserFrame,
          as: "ownedFrames",
          include: [{ model: db.Avatarframe, as: "avatarFrame" }],
        },
      ],
    });

    return res.status(200).json({
      RM: "Frame purchased successfully!",
      RC: 200,
      RD: {
        coin: updatedUser.coin,
        frames: updatedUser.ownedFrames.map((f) => ({
          id: f.id,
          isused: f.IsUsed,
          frameData: f.avatarFrame
            ? {
                id: f.avatarFrame.id,
                framename: f.avatarFrame.framename,
                url: f.avatarFrame.url,
                price: f.avatarFrame.price,
              }
            : null,
        })),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ RM: "Internal server error!", RC: -500 });
  }
};

const setDefaultFrame = async (req, res) => {
  try {
    const { UserID, FrameID } = req.body;
    if (!UserID || !FrameID) {
      return res.status(200).json({ RM: "Missing parameters!", RC: -203 });
    }
    const isCurrentFrame = await db.UserFrame.findOne({
      where: { UserID, IsUsed: true },
    });
    if (isCurrentFrame) {
      isCurrentFrame.IsUsed = false;
      await isCurrentFrame.save();
    }
    const newFrame = await db.UserFrame.findOne({ where: { UserID, FrameID } });
    if (!newFrame) {
      return res.status(200).json({ RM: "Frame not owned!", RC: -204 });
    }
    newFrame.IsUsed = true;
    await newFrame.save();

    return res.status(200).json({
      RM: "Set default frame successfully!",
      RC: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ RM: "Internal server error!", RC: -500 });
  }
};
export default { getAllframe, buyframe, setDefaultFrame };
