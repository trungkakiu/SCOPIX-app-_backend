import db from "../../models/index.js";
import express from "express";

const UpViewComic = async (req, res) => {
  try {
    const { UserID, ComicID, ChapterNumber } = req.body;

    if (!UserID || !ComicID || !ChapterNumber) {
      return res.status(400).json({
        RM: "UserID, ComicID, and ChapterNumber are required",
        RC: -400,
      });
    }

    const comic = await db.Comic.findByPk(ComicID);
    if (!comic) {
      return res.status(404).json({
        RM: "Comic not found",
        RC: -404,
      });
    }

    const LastView = await db.View_history.findOne({
      where: { UserID, ComicID, ChapterNumber },
    });

    let updatedComic;

    if (LastView) {
      const diffTime = Date.now() - new Date(LastView.created_at).getTime();
      if (diffTime >= 1000 * 60 * 60 * 24 * 7) {
        await LastView.update({ created_at: new Date() });
        updatedComic = await comic.increment("view", { returning: true });
      } else {
        updatedComic = comic;
      }
    } else {
      await db.View_history.create({ UserID, ComicID, ChapterNumber });
      updatedComic = await comic.increment("view", { returning: true });
    }

    return res.status(200).json({
      RM: "OK",
      RC: 200,
      RD: updatedComic.view,
    });
  } catch (error) {
    console.error("Error creating view history:", error);
    return res.status(500).json({
      RM: "Internal server error",
      RC: -500,
    });
  }
};

const UpViewComicservice = async ({ UserID, ComicID, ChapterNumber }) => {
  console.log("UpViewComicservice called with:", {
    UserID,
    ComicID,
    ChapterNumber,
  });
  try {
    if (!UserID || !ComicID || !ChapterNumber) {
      return { RM: "Thiếu dữ liệu", RC: -400 };
    }

    const comic = await db.Comic.findByPk(ComicID);
    if (!comic) {
      return { RM: "Comic not found", RC: -404 };
    }

    const LastView = await db.View_history.findOne({
      where: { UserID, ComicID, ChapterNumber },
    });

    if (LastView) {
      const diffTime = Date.now() - new Date(LastView.created_at).getTime();
      if (diffTime >= 1000 * 60 * 60 * 24 * 7) {
        await LastView.update({ created_at: new Date() });
        await comic.increment("view", { by: 1 });
        await comic.reload();
      }
    } else {
      await db.View_history.create({ UserID, ComicID, ChapterNumber });
      await comic.increment("view", { by: 1 });
      await comic.reload();
    }

    return { RM: "OK", RC: 200, RD: comic.views };
  } catch (error) {
    console.error("Error creating view history:", error);
    return { RM: "Internal server error", RC: -500 };
  }
};

const UserlikecomicAction = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { UserID, ComicID } = req.params;

    if (!UserID || !ComicID) {
      return res
        .status(400)
        .json({ RM: "UserID and ComicID are required", RC: -400 });
    }

    const comic = await db.Comic.findByPk(ComicID, { transaction: t });
    if (!comic) {
      return res.status(404).json({ RM: "Comic not found", RC: -404 });
    }

    const existingLike = await db.User_like_comic.findOne({
      where: { UserID, ComicID },
      transaction: t,
    });

    if (existingLike) {
      await existingLike.destroy({ transaction: t });
      if (comic.like > 0) {
        await comic.decrement("like", { by: 1, transaction: t });
      }
    } else {
      await db.User_like_comic.create({ UserID, ComicID }, { transaction: t });
      if (comic.like === null) {
        comic.like = 0;
      }
      await comic.increment("like", { by: 1, transaction: t });
    }

    await t.commit();
    const updatedComic = await comic.reload();
    console.log("Updated comic likes:", updatedComic.like);
    return res.json({
      RM: "OK",
      RC: 200,
      RD: updatedComic.like,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error liking comic:", error);
    return res.status(500).json({ RM: "Internal server error", RC: -500 });
  }
};

const UsersavecomicAction = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { UserID, ComicID } = req.params || {};
    console.log("UsersavecomicAction called with:", { UserID, ComicID });
    if (!UserID || !ComicID) {
      return res
        .status(400)
        .json({ RM: "UserID and ComicID are required", RC: -400 });
    }

    const comic = await db.Comic.findByPk(ComicID, { transaction: t });
    if (!comic) {
      await t.rollback();
      return res.status(404).json({ RM: "Comic not found", RC: -404 });
    }

    const existingSave = await db.User_save_comic.findOne({
      where: { UserID, ComicID },
      transaction: t,
    });

    let saved;
    if (existingSave) {
      await existingSave.destroy({ transaction: t });
      saved = false;
    } else {
      await db.User_save_comic.create({ UserID, ComicID }, { transaction: t });
      saved = true;
    }

    await t.commit();
    return res.json({
      RM: "OK",
      RC: 200,
      RD: saved,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error saving comic:", error);
    return res.status(500).json({ RM: "Internal server error", RC: -500 });
  }
};

const GetUserSaveComic = async (req, res) => {
  const { UserID } = req.params;
  try {
    if (!UserID) {
      return res.status(400).json({ RM: "UserID is required", RC: -400 });
    }

    const savedComics = await db.User_save_comic.findAll({
      where: { UserID },
      include: [
        {
          model: db.Comic,
          as: "comic",
          attributes: ["id", "title", "cover_url"],
        },
      ],
    });
    const comicList = savedComics.map((item) => item.comic);

    return res.status(200).json({
      RM: "OK",
      RC: 200,
      RD: comicList,
    });
  } catch (error) {
    console.error("Error fetching saved comics:", error);
    return res.status(500).json({ RM: "Internal server error", RC: -500 });
  }
};

const getLikedComics = async (req, res) => {
  const { UserID } = req.params;
  try {
    if (!UserID) {
      return res.status(400).json({ RM: "UserID is required", RC: -400 });
    }

    const likedComics = await db.User_like_comic.findAll({
      where: { UserID },
      include: [
        {
          model: db.Comic,
          as: "comic",
          attributes: ["id", "title", "cover_url"],
        },
      ],
    });
    const comicList = likedComics.map((item) => item.comic);

    return res.status(200).json({
      RM: "OK",
      RC: 200,
      RD: comicList,
    });
  } catch (error) {
    console.error("Error fetching liked comics:", error);
    return res.status(500).json({ RM: "Internal server error", RC: -500 });
  }
};

export default {
  UpViewComic,
  UserlikecomicAction,
  UsersavecomicAction,
  UpViewComicservice,
  GetUserSaveComic,
  getLikedComics,
};
