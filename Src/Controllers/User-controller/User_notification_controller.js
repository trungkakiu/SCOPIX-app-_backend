import userClients from "../../Services/Singleton/userClients.js";
import WebSocket from "ws";
import db from "../../models/index.js";

const CreateNotification = async (UserID, Message, Type, Title) => {
  try {
    if (!UserID || !Message || !Type || !Title) return false;

    await db.Notification.create({
      userid: UserID,
      title: Title,
      type: Type,
      link: "",
      message: Message,
      isRead: false,
      status: "active",
    });

    const payload = {
      type: Type,
      message: Message,
      title: Title,
      user: UserID,
      time: new Date().toISOString(),
    };

    const ws = userClients.get(String(UserID.toString()));

    if (ws) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload), (err) => {
          if (err) {
            console.error(`Gửi notification thất bại cho user ${UserID}:`, err);
          } else {
            console.log(`Notification đã gửi thành công cho user ${UserID}`);
          }
        });
      } else {
        console.log(`User ${UserID} WS chưa open, readyState=${ws.readyState}`);
      }
    } else {
      console.log(`User ${UserID} chưa kết nối WS`);
    }

    return true;
  } catch (error) {
    console.error("Error creating notification:", error);
    return false;
  }
};
export { CreateNotification };
