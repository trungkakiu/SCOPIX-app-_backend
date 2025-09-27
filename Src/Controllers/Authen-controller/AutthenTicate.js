import db from "../../models/index.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import JwtAction from "../../config/JwtAction.js";

const HashPassWordUser = (PassWord) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash(PassWord, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });
};
const LoginActive = async (req, res) => {
  try {
    console.log(req?.body);
    const { email, password } = req?.body;

    if (!email) {
      return res.status(200).json({
        RM: "Oops, missing email parameters!",
        RC: -203,
      });
    }
    if (!password) {
      return res.status(200).json({
        RM: "Oops, missing password parameters!",
        RC: -203,
      });
    }

    const user = await db.Account.findOne({
      where: { email },
      include: [
        {
          model: db.UserFrame,
          as: "ownedFrames",
          include: [
            {
              model: db.Avatarframe,
              as: "avatarFrame",
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(200).json({
        RM: "Oops, email wrong!",
        RC: -204,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({
        RM: "Oops, password wrong!",
        RC: -203,
      });
    }

    const token = await JwtAction.JwtSign({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    console.log(user);
    return res.status(200).json({
      RM: "Login successfully!",
      RC: 200,
      RD: {
        Token: token,
        User: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          sucmanh: user.sucmanh,
          coin: user.coin,
          tuvi: user.tuvi,
          background: user.background || null,
          frames: user.ownedFrames.map((frame) => ({
            id: frame.id,
            isused: frame.IsUsed,
            frameData: frame.avatarFrame
              ? {
                  id: frame.avatarFrame.id,
                  framename: frame.avatarFrame.framename,
                  url: frame.avatarFrame.url,
                  price: frame.avatarFrame.price,
                }
              : null,
          })),
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Oops, server error!",
      RC: -500,
    });
  }
};

const RegisterActive = async (req, res) => {
  try {
    const { username, email, password } = req?.body;
    console.log("username: ", username);
    if (!email) {
      return res.status(200).json({
        RM: "Oops, missing email parameters!",
        RC: -203,
      });
    }
    if (!password) {
      return res.status(200).json({
        RM: "Oops, missing password parameters!",
        RC: -203,
      });
    }
    if (!username) {
      return res.status(200).json({
        RM: "Oops, missing username parameters!",
        RC: -203,
      });
    }

    const user = await db.Account.findOne({
      where: { email: email },
    });

    if (user) {
      return res.status(200).json({
        RM: "Oops, email already exists!",
        RC: -204,
      });
    } else {
      const hashPassword = await HashPassWordUser(password);
      await db.Account.create({
        email: email,
        name: username,
        password: hashPassword,
        tuvi: "Phàm Nhân",
        sucmanh: 10,
        avatar: "null",
        role: "user",
      });
      return res.status(200).json({
        RM: "Register successfuly!",
        RC: 200,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Oops, server error!",
      RC: -500,
    });
  }
};

const LoginAdminActive = async (req, res) => {
  try {
    const { email, password } = req?.body;
    if (!email) {
      return res.status(200).json({
        RM: "Oops, missing email parameters!",
        RC: -203,
      });
    }
    if (!password) {
      return res.status(200).json({
        RM: "Oops, missing email parameters!",
        RC: -203,
      });
    }
    const Admin = await db.Account.findOne({
      where: { email: email, role: "admin" },
    });

    if (Admin) {
      const isMatch = await bcrypt.compare(password, Admin.password);
      if (!isMatch) {
        return res.status(200).json({
          RM: "Oops, password wrong!",
          RC: -203,
        });
      }
      const token = await JwtAction.JwtSign({
        id: Admin.id,
        email: Admin.email,
        name: Admin.name,
        role: Admin.role,
      });

      return res.status(200).json({
        RM: "Login successfuly!",
        RC: 200,
        RD: {
          Token: token,
          Admin: {
            name: Admin.name,
            email: Admin.email,
            id: Admin.id,
            avatar: Admin.avatar,
            role: Admin.role,
          },
        },
      });
    } else {
      return res.status(200).json({
        RM: "Oops, email wrong!",
        RC: -204,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Oops, server!",
      RC: -500,
    });
  }
};

const UploadAvatar = async (req, res) => {
  try {
    const { UserID } = req.body;
    if (!UserID) {
      return res.status(200).json({
        RM: "Oops, missing parameters!",
        RC: -203,
      });
    }
    if (!req.file) {
      return res.status(200).json({
        RM: "Oops, missing file!",
        RC: -204,
      });
    }
    const user = await db.Account.findOne({
      where: { id: UserID },
    });

    if (!user) {
      return res.status(200).json({
        RM: "User not found!",
        RC: -204,
      });
    }

    if (!req.newAvatar) {
      return res.status(200).json({
        RM: "Missing new avatar filename!",
        RC: -205,
      });
    }
    user.avatar = req.newAvatar;
    await user.save();

    return res.status(200).json({
      RM: "Avatar updated successfully!",
      RC: 200,
      RD: { avatar: user.avatar },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Oops, server error!",
      RC: -500,
    });
  }
};

const UploadBackground = async (req, res) => {
  try {
    const { UserID } = req.body;
    if (!UserID) {
      return res.status(200).json({
        RM: "Oops, missing parameters!",
        RC: -203,
      });
    }
    if (!req.file) {
      return res.status(200).json({
        RM: "Oops, missing file!",
        RC: -204,
      });
    }
    const user = await db.Account.findOne({
      where: { id: UserID },
    });

    if (!user) {
      return res.status(200).json({
        RM: "User not found!",
        RC: -204,
      });
    }

    if (!req.newBackground) {
      return res.status(200).json({
        RM: "Missing new background filename!",
        RC: -205,
      });
    }
    user.background = req.newBackground;
    await user.save();

    return res.status(200).json({
      RM: "background updated successfully!",
      RC: 200,
      RD: user.background,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Oops, server error!",
      RC: -500,
    });
  }
};

const fecthMe = async (req, res) => {
  try {
    const { UserID } = req.params;
    if (!UserID) {
      return res.status(200).json({
        RM: "Oops, missing parameters!",
        RC: -203,
      });
    }
    const user = await db.Account.findOne({
      where: { id: UserID },
      include: [
        {
          model: db.UserFrame,
          as: "ownedFrames",
          include: [
            {
              model: db.Avatarframe,
              as: "avatarFrame",
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(200).json({
        RM: "User not found!",
        RC: -204,
      });
    }

    return res.status(200).json({
      RM: "User fetched successfully!",
      RC: 200,
      RD: {
        Token: "",
        User: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          sucmanh: user.sucmanh,
          tuvi: user.tuvi,
          background: user.background || null,
          frames: user.ownedFrames.map((frame) => ({
            id: frame.id,
            isused: frame.IsUsed,
            frameData: frame.avatarFrame
              ? {
                  id: frame.avatarFrame.id,
                  framename: frame.avatarFrame.framename,
                  url: frame.avatarFrame.url,
                  price: frame.avatarFrame.price,
                }
              : null,
          })),
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Oops, server error!",
      RC: -500,
    });
  }
};

const generateResetCode = (length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
};

const chancePassWordStep1 = async (req, res) => {
  try {
    const { UserID, oldPass } = req.body;
    if (!UserID || !oldPass) {
      return res.status(200).json({
        RM: "Oops, missing parameters!",
        RC: -203,
      });
    }

    const user = await db.Account.findOne({
      where: { id: UserID },
    });
    if (!user) {
      return res.status(200).json({
        RM: "User not found!",
        RC: -204,
      });
    }
    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) {
      return res.status(200).json({
        RM: "Oops, password wrong!",
        RC: -203,
      });
    }

    const resetCode = generateResetCode(8);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await db.PasswordResetCode.create({
      userid: UserID,
      resetcode: resetCode,
      used: false,
      expiresAt: expiresAt,
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "trungkakiu@gmail.com",
        pass: "cuoz gsex rqhp dksj",
      },
    });

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Xin chào ${user.name},</h2>
      <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
      <p>Mã xác thực của bạn là: <strong>${resetCode}</strong></p>
      <a href="https://example.com/reset-password" style="color: white; background-color: #4CAF50; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Đặt lại mật khẩu
      </a>
      <p>Trân trọng,<br/>SCOPIX Team</p>
    </div>
  `;

    const mailOptions = {
      from: '"SCOPIX" <trungkakiu@gmail.com>',
      to: user.email,
      subject: "Yêu cầu đặt lại mật khẩu",
      text: resetCode,
      html: htmlContent,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          RM: "Failed to send email",
          RC: -500,
        });
      }
      console.log("Email sent:", info.response);
      return res.status(200).json({
        RM: "Email sent successfully",
        RC: 200,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Oops, server error!",
      RC: -500,
    });
  }
};

const chancePassWordStep2 = async (req, res) => {
  try {
    const { UserID, newPass, resetCode } = req.body;
    if (!UserID || !newPass || !resetCode) {
      return res.status(200).json({
        RM: "Oops, missing parameters!",
        RC: -203,
      });
    }
    const user = await db.Account.findOne({
      where: { id: UserID },
    });
    if (!user) {
      return res.status(200).json({
        RM: "User not found!",
        RC: -204,
      });
    }
    const resetEntry = await db.PasswordResetCode.findOne({
      where: {
        userid: UserID,
        resetCode: resetCode,
        used: false,
        expiresAt: {
          [db.Sequelize.Op.gt]: new Date(),
        },
      },
    });

    if (!resetEntry) {
      return res.status(200).json({
        RM: "Invalid or expired reset code!",
        RC: -205,
      });
    }

    if (resetEntry.expiresAt && resetEntry.expiresAt < new Date()) {
      return res.status(200).json({
        RM: "Reset code has expired!",
        RC: -205,
      });
    }

    const hashedPassword = await HashPassWordUser(newPass);
    user.password = hashedPassword;
    await user.save();
    resetEntry.used = true;
    await resetEntry.save();
    return res.status(200).json({
      RM: "Password reset successfully!",
      RC: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Oops, server error!",
      RC: -500,
    });
  }
};

const fetchCoinTransaction = async (req, res) => {
  try {
    const { UserID } = req.params;
    if (!UserID) {
      return res.status(200).json({
        RM: "Oops, missing parameters!",
        RC: -203,
      });
    }
    const user = await db.Account.findOne({
      where: { id: UserID },
    });
    if (!user) {
      return res.status(200).json({
        RM: "User not found!",
        RC: -204,
      });
    }
    const transactions = await db.CoinTransaction.findAll({
      where: { userid: UserID },
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["updatedAt", "UserID"] },
      limit: 50,
    });
    return res.status(200).json({
      RM: "Transactions fetched successfully!",
      RC: 200,
      RD: transactions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Oops, server error!",
      RC: -500,
    });
  }
};

export default {
  LoginActive,
  RegisterActive,
  fecthMe,
  chancePassWordStep1,
  chancePassWordStep2,
  LoginAdminActive,
  fetchCoinTransaction,
  UploadAvatar,
  UploadBackground,
};
