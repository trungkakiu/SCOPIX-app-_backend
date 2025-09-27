import { CreateNotification } from "../User-controller/User_notification_controller.js";
import db from "../../models/index.js";

const CreateCoupon = async (req, res) => {
  try {
    const { name, code, coin, date } = req.body;
    console.log(req.body);
    if (!name || !code || !coin || !date) {
      return res.status(400).json({
        RM: "Vui lòng cung cấp đầy đủ thông tin.",
        RC: -203,
      });
    }

    const existingCoupon = await db.Coupon.findOne({ where: { code } });
    if (existingCoupon) {
      return res.status(400).json({
        RM: "Mã đã tồn tại.",
        RC: -200,
      });
    }

    const newCoupon = await db.Coupon.create({
      name,
      code,
      status: "notUsed",
      coin,
      date,
    });

    if (!newCoupon) {
      return res.status(500).json({
        RM: "Tạo mã thất bại, vui lòng thử lại.",
        RC: -500,
      });
    }

    return res.status(201).json({
      RM: "Tạo mã thành công.",
      RC: 200,
      RD: newCoupon,
    });
  } catch (error) {
    console.error("Lỗi khi tạo mã:", error);
    res.status(500).json({
      RM: "Lỗi máy chủ, vui lòng thử lại sau.",
      RC: -500,
    });
  }
};

const GetAllCoupons = async (req, res) => {
  try {
    const coupons = await db.Coupon.findAll();
    return res.status(200).json({
      RM: "Lấy danh sách mã thành công.",
      RC: 200,
      RD: coupons,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách mã :", error);
    res.status(500).json({
      RM: "Lỗi máy chủ, vui lòng thử lại sau.",
      RC: -500,
    });
  }
};

const UseCoupon = async (req, res) => {
  try {
    const { code, userId } = req.body;
    if (!code || !userId) {
      return res.status(400).json({
        RM: "Vui lòng cung cấp đầy đủ thông tin.",
        RC: -203,
      });
    }
    const coupon = await db.Coupon.findOne({ where: { code } });
    if (!coupon) {
      return res.status(404).json({
        RM: "Mã không tồn tại.",
        RC: -200,
      });
    }

    if (coupon.status === "Used") {
      return res.status(400).json({
        RM: "Mã đã được sử dụng.",
        RC: -201,
      });
    }

    const user = await db.Account.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        RM: "Người dùng không tồn tại.",
        RC: -205,
      });
    }

    user.coin += coupon.coin;
    await user.save();
    coupon.status = "Used";
    await coupon.save();

    await db.CoinTransaction.create({
      UserID: userId,
      type: "gift",
      status: "success",
      content: `Đã Sử dụng mã ${code}`,
      amount: coupon.coin,
      date: new Date(),
    });

    await CreateNotification(
      userId,
      `Bạn đã sử dụng mã ${code} và nhận được ${coupon.coin} coin.`,
      "giftcode",
      "Quà đã đến"
    );

    return res.status(200).json({
      RM: "Sử dụng mã thành công.",
      RC: 200,
      RD: user.coin,
    });
  } catch (error) {
    console.error("Lỗi khi sử dụng mã:", error);
    res.status(500).json({
      RM: "Lỗi máy chủ, vui lòng thử lại sau.",
      RC: -500,
    });
  }
};

export default { CreateCoupon, GetAllCoupons, UseCoupon };
