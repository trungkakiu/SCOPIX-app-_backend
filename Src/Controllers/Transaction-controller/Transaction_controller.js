import crypto from "crypto";
import QRCode from "qrcode";
import db from "../models";
import { CreateNotification } from "../User-controller/User_notification_controller.js";

const CoinAddrequest = (req, res) => {
  try {
    const { UserID, cardSerri, cardNumber, price } = req.body;
    if (!UserID || !cardSerri || !cardNumber || !price) {
      return res.status(200).json({
        RM: "Missing parameters!",
        RC: -203,
      });
    }
    const newTransaction = db.CoinTransaction.create({
      UserID: UserID,
      amount: price,
      type: "deposit",
      status: "pending",
    });

    const noteRes = CreateNotification(
      UserID,
      "Đã tiếp nhận yêu cầu",
      "info",
      "Yêu cầu nạp coin"
    );
    if (!noteRes) {
      console.error("Failed to create notification");
    }

    return res.status(200).json({ RM: "Transaction created", RC: 200 });
  } catch (error) {
    console.error("Error adding coins:", error);
    return res.status(500).json({
      RM: "Internal server error",
      RC: -500,
    });
  }
};

export function generateTransferCode(userId) {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 4);
  const uid = (userId ?? 0).toString(36).toUpperCase().slice(-3);
  return `NAP${ts}${uid}${rand}`.slice(0, 12);
}

const bankingCreateTransaction = async (req, res) => {
  const { userId, amount, bank } = req.body;

  if (!userId || !amount || !bank) {
    return res.status(200).json({
      RM: "Missing parameters!",
      RC: -203,
    });
  }
  const transferCode = generateTransferCode(userId);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  const trx = await db.TopupTransaction.create({
    user_id: userId,
    transfer_code: transferCode,
    amount,
    bank,
    account_number: "19012345678901",
    account_name: "SCOPIX VTB",
    status: "pending",
    expires_at: expiresAt,
  });

  const memo = transferCode;
  const payload = `ACCOUNT:19012345678901;NAME:SCOPIX VTB;AMOUNT:${amount};MEMO:${memo}`;

  const qrDataUrl = await QRCode.toDataURL(payload);

  trx.qr_data = qrDataUrl;
  await trx.save();

  return res.json({
    RC: 200,
    RM: "Transaction created",
    RD: {
      transferCode,
      qrDataUrl,
      expiresAt,
    },
  });
};

export { CoinAddrequest, bankingCreateTransaction };
