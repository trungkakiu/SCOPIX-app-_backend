import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      RM: "Vui lòng cung cấp token trong tiêu đề xác thực.",
      EC: -401,
      ED: "",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      RM: "Token không được cung cấp.",
      EC: -401,
      ED: "",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey12doto3"
    );
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(403).json({
      RM: "Token không hợp lệ hoặc đã hết hạn.",
      EC: -403,
      ED: "",
    });
  }
};

const isAdmin = (req, res, next) => {
  const user = req.user;
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      RM: " Bạn không có quyền truy cập vào tài nguyên này.",
      EC: -403,
      ED: "",
    });
  }
  next();
};

export default { verifyToken, isAdmin };
