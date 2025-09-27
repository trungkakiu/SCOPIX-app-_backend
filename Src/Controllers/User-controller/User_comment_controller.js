import { where } from "sequelize";
import db from "../../models/index.js";

function timeStamp() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

const Userpostcomment = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debugging line
    const { UserID, content, ComicID, ParentID } = req.body;
    if (!UserID || !ComicID || !content) {
      return res.status(200).json({
        RM: "Missing parameters!",
        RC: -203,
      });
    }

    const newComment = await db.ComicComment.create({
      userId: UserID,
      comicId: ComicID,
      content: content,
      parentId: ParentID !== -1 ? ParentID : null,
      status: "visible",
    });

    if (newComment) {
      return res.status(200).json({
        RM: "Comment posted successfully!",
        RC: 200,
        RD: {
          id: newComment.id,
          userId: newComment.userId,
          time: timeStamp(),
        },
      });
    } else {
      return res.status(200).json({
        RM: "Failed to post comment!",
        RC: -204,
      });
    }
  } catch (error) {
    console.error("Error posting comment:", error);
    return res.status(500).json({
      RM: "Internal server error",
      RC: -500,
    });
  }
};

const Usereditcomment = async (req, res) => {
  try {
    const { content } = req.body;
    console.log("Request Body:", req.body);
    const { CommentID, UserID } = req.params;

    if (!CommentID || !UserID || !content) {
      return res.status(200).json({
        RM: "Missing parameters!",
        RC: -203,
      });
    }

    const comment = await db.ComicComment.findOne({
      where: { id: CommentID, userId: UserID, status: "visible" },
    });

    if (!comment) {
      return res.status(200).json({
        RM: "Comment not found or you do not have permission to edit this comment!",
        RC: -205,
      });
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json({
      RM: "Comment edited successfully!",
      RC: 200,
      Data: comment,
    });
  } catch (error) {
    console.error("Error editing comment:", error);
    return res.status(500).json({
      RM: "Internal server error",
      RC: -500,
    });
  }
};

const Userdeletecomment = async (req, res) => {
  try {
    const { CommentID, UserID, ComicID } = req.params;
    if (!CommentID || !UserID) {
      return res.status(200).json({
        RM: "Missing parameters!",
        RC: -203,
      });
    }

    const comment = await db.ComicComment.findOne({
      where: { id: CommentID, userId: UserID, status: "visible" },
    });

    if (comment.userId.toString() !== UserID) {
      return res.status(200).json({
        RM: "You do not have permission to delete this comment!",
        RC: -205,
      });
    }

    if (!comment) {
      return res.status(200).json({
        RM: "Comment not found or you do not have permission to delete this comment!",
        RC: -205,
      });
    }

    comment.status = "deleted";
    await comment.save();
    await db.ComicComment.update(
      { parentId: null },
      { where: { parentId: comment.id } }
    );

    const resRD = await db.ComicComment.findAll({
      where: { comicId: ComicID, parentId: null, status: "visible" },
      include: [
        {
          model: db.Account,
          as: "user",
          attributes: ["id", "name", "avatar"],
          include: [
            {
              model: db.UserFrame,
              where: { IsUsed: true },
              required: false,
              as: "ownedFrames",
              attributes: ["id", "UserID", "FrameID", "IsUsed"],
              include: [
                {
                  model: db.Avatarframe,
                  as: "avatarFrame",
                  attributes: ["id", "framename", "url"],
                },
              ],
            },
          ],
        },
        {
          model: db.ComicComment,
          as: "replies",
          where: { status: "visible" },
          required: false,
          attributes: ["id", "content", "createdAt"],
          include: [
            {
              model: db.Account,
              as: "user",
              attributes: ["id", "name", "avatar"],
              include: [
                {
                  model: db.UserFrame,
                  where: { IsUsed: true },
                  required: false,
                  as: "ownedFrames",
                  attributes: ["id", "UserID", "FrameID", "IsUsed"],
                  include: [
                    {
                      model: db.Avatarframe,
                      as: "avatarFrame",
                      attributes: ["id", "framename", "url"],
                    },
                  ],
                },
              ],
            },
            {
              model: db.ComicComment,
              as: "parent",
              attributes: ["id", "comicId", "userId"],
              include: [
                {
                  model: db.Account,
                  as: "user",
                  attributes: ["name"],
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      RM: "Comment deleted successfully!",
      RC: 200,
      RD: resRD,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({
      RM: "Internal server error",
      RC: -500,
    });
  }
};

const UserdeleteChaptercomment = async (req, res) => {
  try {
    const { CommentID, UserID, ComicID, ChapterID } = req.params;
    if (!CommentID || !UserID || !ComicID || !ChapterID) {
      return res.status(200).json({
        RM: "Missing parameters!",
        RC: -203,
      });
    }

    console.log("Params:", req.params);

    const comment = await db.ComicChapterComment.findOne({
      where: {
        id: Number(CommentID),
        userId: Number(UserID),
        comicId: Number(ComicID),
        Chapter: Number(ChapterID),
        status: "visible",
      },
    });

    if (!comment) {
      return res.status(200).json({
        RM: "Comment not found or you do not have permission to delete this comment!",
        RC: -205,
      });
    }

    if (comment.userId.toString() !== UserID) {
      return res.status(200).json({
        RM: "You do not have permission to delete this comment!",
        RC: -205,
      });
    }

    comment.status = "deleted";

    await comment.save();
    await db.ComicChapterComment.update(
      { parentId: null },
      { where: { parentId: comment.id } }
    );
    const resRD = await db.ComicChapterComment.findAll({
      where: {
        comicId: ComicID,
        Chapter: ChapterID,
        parentId: null,
        status: "visible",
      },
      attributes: ["id", "content", "userId", "createdAt"],
      include: [
        {
          model: db.Account,
          as: "user",
          attributes: ["id", "name", "avatar"],
          include: [
            {
              model: db.UserFrame,
              where: { IsUsed: true },
              required: false,
              as: "ownedFrames",
              attributes: ["id", "UserID", "FrameID", "IsUsed"],
              include: [
                {
                  model: db.Avatarframe,
                  as: "avatarFrame",
                  attributes: ["id", "framename", "url"],
                },
              ],
            },
          ],
        },
        {
          model: db.ComicChapterComment,
          as: "replies",
          where: { status: "visible" },
          required: false,
          attributes: ["id", "content", "createdAt"],
          include: [
            {
              model: db.Account,
              as: "user",
              attributes: ["id", "name", "avatar"],
              include: [
                {
                  model: db.UserFrame,
                  where: { IsUsed: true },
                  required: false,
                  as: "ownedFrames",
                  attributes: ["id", "UserID", "FrameID", "IsUsed"],
                  include: [
                    {
                      model: db.Avatarframe,
                      as: "avatarFrame",
                      attributes: ["id", "framename", "url"],
                    },
                  ],
                },
              ],
            },
            {
              model: db.ComicChapterComment,
              as: "parent",
              attributes: ["id", "comicId", "userId"],
              include: [
                { model: db.Account, as: "user", attributes: ["name"] },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({
      RM: "Comment deleted successfully!",
      RC: 200,
      RD: resRD,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({
      RM: "Internal server error",
      RC: -500,
    });
  }
};

const UserPostChapterComment = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { UserID, content, ComicID, ParentID, ChapterID } = req.body;
    if (!UserID || !ComicID || !content || !ChapterID) {
      return res.status(200).json({
        RM: "Missing parameters!",
        RC: -203,
      });
    }

    const newComment = await db.ComicChapterComment.create({
      userId: UserID,
      Chapter: ChapterID,
      comicId: ComicID,
      content: content,
      parentId: ParentID !== -1 ? ParentID : null,
      status: "visible",
    });

    if (newComment) {
      return res.status(200).json({
        RM: "Comment posted successfully!",
        RC: 200,
        RD: {
          id: newComment.id,
          userId: newComment.userId,
          time: timeStamp(),
        },
      });
    } else {
      return res.status(200).json({
        RM: "Failed to post comment!",
        RC: -204,
      });
    }
  } catch (error) {
    console.error("Error posting comment:", error);
    return res.status(500).json({
      RM: "Internal server error",
      RC: -500,
    });
  }
};

const Usereditchaptercomment = async (req, res) => {
  try {
    const { content } = req.body;
    const { CommentID, UserID } = req.params;

    if (!CommentID || !UserID || !content) {
      return res.status(200).json({
        RM: "Missing parameters!",
        RC: -203,
      });
    }

    const comment = await db.ComicChapterComment.findOne({
      where: { id: CommentID, userId: UserID, status: "visible" },
    });

    if (!comment) {
      return res.status(200).json({
        RM: "Comment not found or you do not have permission to edit this comment!",
        RC: -205,
      });
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json({
      RM: "Comment edited successfully!",
      RC: 200,
      Data: comment,
    });
  } catch (error) {
    console.error("Error editing comment:", error);
    return res.status(500).json({
      RM: "Internal server error",
      RC: -500,
    });
  }
};

export default {
  Userpostcomment,
  Usereditcomment,
  Userdeletecomment,
  Usereditchaptercomment,
  UserdeleteChaptercomment,
  UserPostChapterComment,
};
