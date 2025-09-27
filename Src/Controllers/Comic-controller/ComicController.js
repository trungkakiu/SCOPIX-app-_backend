import { where } from "sequelize";
import db from "../../models/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Comic_info_controller from "./Comic_info_controller.js";

const AddNewComic = async (req, res) => {
  try {
    const { title, description, author, status, options } = req.body;
    const coverImage = req.file?.filename;
    console.log("Cover Image:", coverImage);
    if (
      !title ||
      !description ||
      !author ||
      !status ||
      !coverImage ||
      !options
    ) {
      return res.status(400).json({
        RM: "All fields are required!",
        RC: -400,
      });
    }
    const newComic = {
      title,
      description,
      author,
      options,
      status,
      view: 0,
      like: 0,
      rate: 0,
      cover_url: coverImage,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    db.Comic.create(newComic)
      .then((comic) => {
        return res.status(200).json({
          RM: "Comic added successfully!",
          RC: 200,
          DT: comic,
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({
          RM: "Internal server error!",
          RC: -500,
        });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "An unexpected error occurred!",
      RC: -500,
    });
  }
};

const FecthAuthor = (req, res) => {
  try {
    db.Author.findAll()
      .then((authors) => {
        return res.status(200).json({
          RM: "Authors fetched successfully!",
          RC: 200,
          RD: authors,
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({
          RM: "Internal server error!",
          RC: -500,
        });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "An unexpected error occurred!",
      RC: -500,
    });
  }
};

const GetComics = (req, res) => {
  try {
    db.Comic.findAll({
      include: [
        {
          model: db.Author,
          as: "AuthorInfo",
          attributes: ["Author_name"],
        },
        {
          model: db.Category,
          as: "categories",
          attributes: ["id", "category_name", "description"],
          through: { attributes: [] },
        },
      ],
    })
      .then((comics) => {
        return res.status(200).json({
          RM: "Comics fetched successfully!",
          RC: 200,
          RD: comics,
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({
          RM: "Internal server error!",
          RC: -500,
        });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "An unexpected error occurred!",
      RC: -500,
    });
  }
};

const DeleteComic = (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      RM: "Comic ID is required!",
      RC: -400,
    });
  }

  db.Comic.destroy({ where: { id } })
    .then((deleted) => {
      if (deleted) {
        return res.status(200).json({
          RM: "Comic deleted successfully!",
          RC: 200,
        });
      } else {
        return res.status(404).json({
          RM: "Comic not found!",
          RC: -404,
        });
      }
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        RM: "Internal server error!",
        RC: -500,
      });
    });
};

const EditComic = (req, res) => {
  const { comicid } = req.params;
  const { title, description, author, status, options } = req.body;
  const NewCoverImg = req.file?.filename;

  if (!comicid || !title || !description || !author || !status || !options) {
    return res.status(400).json({
      RM: "All fields are required!",
      RC: -400,
    });
  }
  const updateData = {
    title,
    options,
    description,
    author,
    status,
  };

  if (NewCoverImg) {
    updateData.cover_url = NewCoverImg;
  }
  db.Comic.update(updateData, { where: { id: comicid } })
    .then((updated) => {
      if (updated[0] > 0) {
        return res.status(200).json({
          RM: "Comic updated successfully!",
          RC: 200,
          RD: updateData,
        });
      } else {
        return res.status(404).json({
          RM: "Comic not found!",
          RC: -404,
        });
      }
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        RM: "Internal server error!",
        RC: -500,
      });
    });
};

const TopComicsbyview = async (req, res) => {
  try {
    const topComics = await db.Comic.findAll({
      order: [["view", "DESC"]],
      limit: 10,
    });

    return res.status(200).json({
      RM: "Top comics fetched successfully!",
      RC: 200,
      RD: topComics,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Internal server error!",
      RC: -500,
    });
  }
};

const TopComicsbylike = async (req, res) => {
  try {
    const topComics = await db.Comic.findAll({
      order: [["like", "DESC"]],
      limit: 10,
    });

    return res.status(200).json({
      RM: "Top comics fetched successfully!",
      RC: 200,
      RD: topComics,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Internal server error!",
      RC: -500,
    });
  }
};

const ListComic = async (req, res) => {
  try {
    const { otp } = req.params;
    const topComics = await db.Comic.findAll({
      where: { options: otp },
    });
    return res.status(200).json({
      RM: `${otp} comics fetched successfully!`,
      RC: 200,
      RD: topComics,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Internal server error!",
      RC: -500,
    });
  }
};

const FetchPage = async (req, res) => {
  try {
    const { comicid } = req.params;
    const pages = await db.Chapter.findAll({
      where: { comic_id: comicid },
    });

    if (pages && pages.length > 0) {
      return res.status(200).json({
        RM: "Comics chapter fetched successfully!",
        RC: 200,
        RD: pages,
      });
    } else {
      return res.status(200).json({
        RM: "Comic chapter empty!",
        RC: -204,
        RD: [],
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Internal server error!",
      RC: -500,
    });
  }
};

const addChapter = async (req, res) => {
  try {
    const { comic_id, chapter_number, title, chapter_name } = req.body;
    if (!comic_id || !chapter_number || !title) {
      return res.status(400).json({ RC: 400, RM: "Thiếu thông tin bắt buộc!" });
    }

    const newChapter = await db.Chapter.create({
      comic_id,
      chapter_number,
      chapter_name,
    });

    const chapterImages = req.files.map((file, index) => ({
      chapter_id: newChapter.id,
      image_url: file.savedFileName,
      order: index + 1,
    }));

    await db.chapter_image.bulkCreate(chapterImages);

    return res.status(201).json({
      RC: 200,
      RM: "Thêm chapter thành công!",
      RD: { chapter: newChapter, images: chapterImages },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ RC: 500, RM: "Lỗi server" });
  }
};

const AddFrameAvatar = async (req, res) => {
  try {
    const { framename } = req.body;
    const url = "";
    if (!framename) {
      return res.status(200).json({
        RM: "Thiếu tên khung ảnh!",
        RC: -203,
      });
    }

    const newframe = {
      framename,
      url,
    };
    db.Avatarframe.create(newframe)
      .then((Avatarframe) => {
        return res.status(200).json({
          RM: "Thêm khung ảnh thành công!",
          RC: 200,
          RD: Avatarframe,
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({
          RM: "Internal server error!",
          RC: -500,
        });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Server error!",
      RC: -500,
    });
  }
};

const FetchFrameAvatar = async (req, res) => {
  try {
    const frameList = await db.Avatarframe.findAll();
    return res.status(200).json({
      RM: "Fetch frame avatar complete!",
      RC: 200,
      RD: frameList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Server error!",
      RC: -500,
    });
  }
};

const GetListbyID = async (req, res) => {
  try {
    const { id } = req?.params;

    const list = await db.Chapter.findByPk(id, {
      include: [
        {
          model: db.chapter_image,
          as: "images",
          attributes: ["id", "image_url", "order"],
          order: [["order", "ASC"]],
        },
      ],
      order: [[{ model: db.chapter_image, as: "images" }, "order", "ASC"]],
    });

    if (!list) {
      return res.status(404).json({
        RM: "Không tìm thấy chapter!",
        RC: 404,
      });
    }

    return res.status(200).json({
      RM: "Fetch list chapter complete!",
      RC: 200,
      RD: list,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Server error!",
      RC: -500,
    });
  }
};

const createNewReadingHis = async (req, res) => {
  try {
    console.log(req?.body);
    const { UserID, ComicID, liked, saved } = req?.body;

    if (!UserID || !ComicID || liked === undefined || saved === undefined) {
      let missingFields = [];
      if (!UserID) missingFields.push("UserID");
      if (!ComicID) missingFields.push("ComicID");
      if (!ChapterNumber) missingFields.push("ChapterNumber");
      if (liked === undefined) missingFields.push("liked");
      if (saved === undefined) missingFields.push("saved");

      return res.status(200).json({
        RM: `Missing parameter(s): ${missingFields.join(", ")}`,
        RC: -203,
      });
    }

    const chapter = await db.Chapter.findOne({
      where: {
        comic_id: ComicID,
        chapter_number: 1,
      },
      attributes: ["id"],
    });

    if (!chapter) {
      return res.status(200).json({
        RM: "Chapter not found!",
        RC: 404,
      });
    }
    const newReading = {
      UserID,
      ComicID,
      ChapterID: chapter.id,
      ChapterNumber: 1,
      liked,
      saved,
    };

    await db.ReadingHistory.create(newReading);

    return res.status(200).json({
      RM: "Create reading history complete!",
      RC: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Server error!",
      RC: -500,
    });
  }
};

const updateReadingHistory = async (userID, comicID, chapter, liked, saved) => {
  if (!userID || !comicID || chapter === undefined) {
    return {
      RC: -400,
      RM: "Missing required fields!",
    };
  }

  try {
    const readingHistory = await db.ReadingHistory.findOne({
      where: { UserID: userID, ComicID: comicID },
    });

    if (!readingHistory) {
      const chapterExists = await db.Chapter.findOne({
        where: { comic_id: comicID, chapter_number: chapter },
        attributes: ["id"],
      });

      await db.ReadingHistory.create({
        UserID: userID,
        ComicID: comicID,
        ChapterID: chapterExists.id,
        ChapterNumber: chapter,
        liked: liked || false,
        saved: saved || false,
      });
      return { RC: 200, RM: "Reading history created successfully!" };
    }

    if (chapter > readingHistory.ChapterNumber) {
      readingHistory.ChapterNumber = chapter;
    }

    if (
      liked !== undefined &&
      liked !== null &&
      liked !== readingHistory.liked
    ) {
      readingHistory.liked = liked;
    }

    if (
      saved !== undefined &&
      saved !== null &&
      saved !== readingHistory.saved
    ) {
      readingHistory.saved = saved;
    }

    await readingHistory.save();

    return {
      RC: 200,
      RM: "Reading history updated successfully!",
    };
  } catch (error) {
    console.error(error);
    return {
      RC: -500,
      RM: "Server error!",
    };
  }
};

const getChapterByNumber = async (req, res) => {
  try {
    const { UserID, ComicID, ChapterNumber } = req?.params;
    if (!ComicID || !ChapterNumber) {
      return res.status(400).json({
        RM: "Thiếu ComicID hoặc ChapterNumber trong request",
        RC: -400,
      });
    }
    const updateView = await Comic_info_controller.UpViewComicservice({
      UserID,
      ComicID,
      ChapterNumber: Number(ChapterNumber) === 0 ? 1 : Number(ChapterNumber),
    });
    if (updateView.RC !== 200) {
      console.error("Error updating view:", updateView.RM);
      return res.status(updateView.RC).json({
        RM: updateView.RM,
        RC: updateView.RC,
      });
    }

    const updateChapter = await updateReadingHistory(
      UserID,
      ComicID,
      ChapterNumber
    );

    if (updateChapter.RC !== 200) {
      return res.status(updateChapter.RC).json({
        RM: updateChapter.RM,
        RC: updateChapter.RC,
      });
    }

    const totalChapters = await db.Chapter.count({
      where: {
        comic_id: ComicID,
      },
    });

    const list = await db.Chapter.findOne({
      where: {
        comic_id: ComicID,
        chapter_number: Number(ChapterNumber) === 0 ? 1 : Number(ChapterNumber),
      },
      attributes: ["id", "comic_id", "chapter_number", "title"],
      include: [
        {
          model: db.chapter_image,
          as: "images",
          attributes: ["id", "image_url", "order"],
          order: [["order", "ASC"]],
        },
      ],
      order: [[{ model: db.chapter_image, as: "images" }, "order", "ASC"]],
    });

    const chapterComment = await db.ComicChapterComment.findAll({
      where: {
        parentId: null,
        status: "visible",
        comicId: ComicID,
        Chapter: list.id,
      },
      separate: true,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.Account,
          as: "user",
          attributes: ["id", "name", "avatar"],
          include: [
            {
              model: db.UserFrame,
              as: "ownedFrames",
              where: { IsUsed: true },
              required: false,
              attributes: ["id", "UserID", "FrameID"],
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
                  as: "ownedFrames",
                  where: { IsUsed: true },
                  required: false,
                  attributes: ["id", "UserID", "FrameID"],
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
    });
    if (!list) {
      return res.status(200).json({
        RM: "Không tìm thấy chapter!",
        RC: 404,
      });
    }

    return res.status(200).json({
      RM: "Fetch list chapter complete!",
      RC: 200,
      RD: { ...list.toJSON(), totalChapters, Comments: chapterComment },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Server error!",
      RC: -500,
    });
  }
};

const deleteChapterByID = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting chapter with ID:", id);
    if (!id) {
      return res.status(400).json({ RC: 400, RM: "Thiếu ID chapter!" });
    }

    const chapter = await db.Chapter.findByPk(id, {
      include: [{ model: db.chapter_image, as: "images" }],
    });

    if (!chapter) {
      return res.status(404).json({ RC: 404, RM: "Chapter không tồn tại" });
    }

    if (chapter.images.length > 0) {
      const firstImgPath = chapter.images[0].image_url;

      const [comicName, chapterName] = firstImgPath.split(path.sep);
      const folderPath = path.join(
        __dirname,
        "../../Comic/ComicChapter",
        comicName,
        chapterName
      );
      console.log("Folder path to delete:", folderPath);

      if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
      }
    }

    await db.chapter_image.destroy({ where: { chapter_id: id } });
    await chapter.destroy();

    return res
      .status(200)
      .json({ RC: 200, RM: "Xóa chapter và toàn bộ ảnh thành công!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ RC: 500, RM: "Lỗi server khi xóa chapter" });
  }
};

const editchapterByID = async (req, res) => {
  try {
    const { id } = req.params;
    const { newTitle, chapter_number } = req.body;

    const chapter = await db.Chapter.findByPk(id, {
      include: [{ model: db.chapter_image, as: "images" }],
    });
    o;

    if (!chapter) {
      return res.status(404).json({ RC: 404, RM: "Chapter không tồn tại" });
    }
    let oldChapterName = chapter.title;
    let comicName = "";
    if (chapter.images.length > 0) {
      const firstImgPath = chapter.images[0].image_url;
      [comicName] = firstImgPath.split(path.sep);
    }

    const oldPath = path.join(
      __dirname,
      "../../Comic/ComicChapter",
      comicName,
      oldChapterName
    );
    const newPath = path.join(
      __dirname,
      "../../Comic/ComicChapter",
      comicName,
      newTitle
    );

    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
    }

    await chapter.update({
      title: newTitle,
      chapter_number: chapter_number || chapter.chapter_number,
    });

    for (const img of chapter.images) {
      const fileName = path.basename(img.image_url);
      const newImgPath = path.join(comicName, newTitle, fileName);

      await img.update({
        image_url: newImgPath,
      });
    }

    return res.status(200).json({
      RC: 200,
      RM: "Cập nhật chapter thành công!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RC: 500,
      RM: "Lỗi server khi chỉnh sửa chapter",
    });
  }
};

const fectComicbyID = async (req, res) => {
  try {
    const { comicID, UserID } = req.params;

    if (!comicID) {
      return res
        .status(400)
        .json({ RC: -203, RM: "Thiếu dữ liệu trong yêu cầu!" });
    }

    const resp = await db.Comic.findByPk(comicID, {
      include: [
        {
          model: db.Chapter,
          as: "chapters",
          separate: true,
          order: [["chapter_number", "ASC"]],
          attributes: ["id", "chapter_number", "title"],
        },
        {
          model: db.Author,
          as: "AuthorInfo",
          attributes: ["id", "Author_name", "Age"],
        },
        {
          model: db.Category,
          as: "categories",
          attributes: ["id", "category_name"],
          through: { attributes: [] },
        },
        {
          model: db.ComicComment,
          as: "comments",
          where: {
            parentId: null,
            status: "visible",
          },
          separate: true,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: db.Account,
              as: "user",
              attributes: ["id", "name", "avatar"],
              include: [
                {
                  model: db.UserFrame,
                  as: "ownedFrames",
                  where: { IsUsed: true },
                  required: false,
                  attributes: ["id", "UserID", "FrameID"],
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
                      as: "ownedFrames",
                      where: { IsUsed: true },
                      required: false,
                      attributes: ["id", "UserID", "FrameID"],
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
        },
      ],
    });

    if (!resp) {
      return res.status(404).json({ RC: -404, RM: "Comic không tồn tại" });
    }

    let userlike = null;
    let userSave = null;
    let readinghistory = null;

    if (UserID) {
      userlike = await db.User_like_comic.findOne({
        where: { UserID, ComicID: comicID },
      });
      userSave = await db.User_save_comic.findOne({
        where: { UserID, ComicID: comicID },
      });
      readinghistory = await db.ReadingHistory.findOne({
        where: { UserID, ComicID: comicID },
        attributes: ["ChapterNumber", "liked", "saved"],
      });
    }

    return res.status(200).json({
      RC: 200,
      RM: "Thông tin truyện!",
      RD: {
        ...resp.toJSON(),
        readinghistory: readinghistory || null,
        userlike: !!userlike,
        userSave: !!userSave,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ RC: 500, RM: "Lỗi server khi lấy thông tin comic" });
  }
};

export default {
  AddNewComic,
  FecthAuthor,
  GetComics,
  createNewReadingHis,
  GetListbyID,
  DeleteComic,
  TopComicsbyview,
  TopComicsbylike,
  getChapterByNumber,
  deleteChapterByID,
  FetchPage,
  AddFrameAvatar,
  editchapterByID,
  addChapter,
  EditComic,
  FetchFrameAvatar,
  ListComic,
  fectComicbyID,
};
