import express from "express";
import AutthenTicate from "../../Controllers/Authen-controller/AutthenTicate.js";
import CoverUpload from "../../Access/ImgStorage/Comic/CoverImg/CoverUpload.js";
import ComicController from "../../Controllers/Comic-controller/ComicController.js";
import JWTactions from "../Middleware/JWTactions.js";
import CoverUpdate from "../../Access/ImgStorage/Comic/CoverImg/CoverImg_update.js";
import FrameUpload from "../../Access/Frame_avatar/UploadFrame.js";
import Storemanagement from "../../Controllers/Store-controller/Storemanagement.js";
import Frame_update from "../../Access/Frame_avatar/Frame_update.js";
import Bgr_update from "../../Access/ImgStorage/Userbackground/Bgr_update.js";
import chapterUploads from "../../Access/ImgStorage/Comic/ComicChapter/chapterUploads.js";
import CategoriesCtl from "../../Controllers/Comic-controller/CategoriesCtl.js";
import Comic_info_controller from "../../Controllers/Comic-controller/Comic_info_controller.js";
import UserAvatar from "../../Access/ImgStorage/UserAvatar/UserAvatar.js";
import Avatar_update from "../../Access/ImgStorage/UserAvatar/Avatar_update.js";
import User_comment_controller from "../../Controllers/User-controller/User_comment_controller.js";
import Controller from "../../Controllers/BaiKTKN_2/Controller.js";
import frame_avatar_controller from "../../Controllers/User-controller/frame_avatar_controller.js";
import coupon_controller from "../../Controllers/Transaction-controller/coupon_controller.js";
const router = express.Router();

const InitApiRoute = (app) => {
  router.post("/auth/login", AutthenTicate.LoginActive);
  router.post("/auth/login-admin", AutthenTicate.LoginAdminActive);
  router.post("/auth/register", AutthenTicate.RegisterActive);
  router.get("/Comic/Author", ComicController.FecthAuthor);
  router.get("/Comic/TopComicbyviews", ComicController.TopComicsbyview);
  router.get("/Comic/TopComicbylike", ComicController.TopComicsbylike);
  router.get("/Comic/GetComics", ComicController.GetComics);
  router.get("/Comic/GetComicby/:otp", ComicController.ListComic);
  router.get("/Comic/fectpagebycomic/:comicid", ComicController.FetchPage);
  router.get("/Comic/chapter/:id", ComicController.GetListbyID);
  router.get("/Comic/:comicID/:UserID", ComicController.fectComicbyID);
  router.get("/Comic/Category", CategoriesCtl.GetCategories);
  router.get("/User/me/:UserID", AutthenTicate.fecthMe);
  router.get(
    "/User/fetchCointransaction/:UserID",
    JWTactions.verifyToken,
    AutthenTicate.fetchCoinTransaction
  );
  router.post(
    "/User/Vetificode",
    JWTactions.verifyToken,
    AutthenTicate.chancePassWordStep2
  );
  router.post(
    "/User/ValidateOldpass",
    JWTactions.verifyToken,
    AutthenTicate.chancePassWordStep1
  );
  router.put(
    "/Comment/editcomment/:UserID/:CommentID",
    JWTactions.verifyToken,
    User_comment_controller.Usereditcomment
  );
  router.put(
    "/Comment/editchaptercomment/:UserID/:CommentID",
    JWTactions.verifyToken,
    User_comment_controller.Usereditchaptercomment
  );
  router.delete(
    "/Comment/deleteChapterComment/:UserID/:ComicID/:ChapterID/:CommentID",
    JWTactions.verifyToken,
    User_comment_controller.UserdeleteChaptercomment
  );

  router.post(
    "/Comment/replycomment",
    JWTactions.verifyToken,
    User_comment_controller.UserPostChapterComment
  );

  router.post(
    "/Coupon/ActiveCoupon",
    JWTactions.verifyToken,
    coupon_controller.UseCoupon
  );
  router.post(
    "/GiftCode/create",
    JWTactions.verifyToken,
    JWTactions.isAdmin,
    coupon_controller.CreateCoupon
  );
  router.get(
    "/GiftCodes",
    JWTactions.verifyToken,
    coupon_controller.GetAllCoupons
  );
  router.post(
    "/Frame/setDefaultFrame",
    JWTactions.verifyToken,
    frame_avatar_controller.setDefaultFrame
  );
  router.post(
    "/Frame/buyframe",
    JWTactions.verifyToken,
    frame_avatar_controller.buyframe
  );
  router.get(
    "/Avatar/getframe",
    JWTactions.verifyToken,
    Storemanagement.FetchFrameAvatar
  );
  router.delete(
    "/User/deletecomment/:UserID/:CommentID/:ComicID",
    JWTactions.verifyToken,
    User_comment_controller.Userdeletecomment
  );
  router.post(
    "/User/UploadAvatar",
    JWTactions.verifyToken,
    Avatar_update.single("NewAvatarImg"),
    AutthenTicate.UploadAvatar
  );
  router.post(
    "/User/UploadBackground",
    JWTactions.verifyToken,
    Bgr_update.single("newBackground"),
    AutthenTicate.UploadBackground
  );
  router.get(
    "/User/Alllikedcomic/:UserID",
    JWTactions.verifyToken,
    Comic_info_controller.getLikedComics
  );
  router.get(
    "/User/Allsavecomic/:UserID",
    JWTactions.verifyToken,
    Comic_info_controller.GetUserSaveComic
  );
  router.post(
    "/User/likeComic/:UserID/:ComicID",
    JWTactions.verifyToken,
    Comic_info_controller.UserlikecomicAction
  );
  router.post(
    "/User/savecomic/:UserID/:ComicID",
    JWTactions.verifyToken,
    Comic_info_controller.UsersavecomicAction
  );
  router.get(
    "/Category/getAllComicByCategory",
    CategoriesCtl.fetchAllComicByCategories
  );
  router.post(
    "/Comic/AddComicCategory",
    JWTactions.verifyToken,
    JWTactions.isAdmin,
    CategoriesCtl.AddCateComic
  );
  router.delete(
    "/Comic/DeleteComicCategory",
    JWTactions.verifyToken,
    JWTactions.isAdmin,
    CategoriesCtl.deleteCateComic
  );
  router.post(
    "/Comic/NewCategory",
    JWTactions.verifyToken,
    JWTactions.isAdmin,
    CategoriesCtl.NewCategory
  );
  router.put(
    "/Comic/UpdateCategory/:id",
    JWTactions.verifyToken,
    JWTactions.isAdmin,
    CategoriesCtl.UpdateCategory
  );
  router.delete(
    "/Comic/RemoveCategory/:id",
    JWTactions.verifyToken,
    JWTactions.isAdmin,
    CategoriesCtl.DeleteCategory
  );
  router.post(
    "/User/newReadingHistory",
    JWTactions.verifyToken,
    ComicController.createNewReadingHis
  );
  router.get(
    "/Comic/chapter/:UserID/:ComicID/:ChapterNumber",
    JWTactions.verifyToken,
    ComicController.getChapterByNumber
  );
  router.delete(
    "/Comic/chapter/:id",
    JWTactions.verifyToken,
    JWTactions.isAdmin,
    ComicController.deleteChapterByID
  );
  router.put(
    "/Comic/chapter/:id",
    JWTactions.verifyToken,
    JWTactions.isAdmin,
    ComicController.editchapterByID
  );
  router.post(
    "/Comic/newchapter",
    JWTactions.verifyToken,
    JWTactions.isAdmin,
    chapterUploads.array("listchapter", 100),
    ComicController.addChapter
  );
  router.put(
    "/Avatar/editframe/:id",
    JWTactions.verifyToken,
    JWTactions.isAdmin,
    Frame_update.single("NewFrameImg"),
    Storemanagement.EditFrameAvatar
  );
  router.post(
    "/Avatar/newframe",
    FrameUpload.single("FrameUpload"),
    Storemanagement.NewFrameAvatar
  );
  router.delete(
    "/Comic/Delete/:id",
    JWTactions.verifyToken,
    JWTactions.isAdmin,
    ComicController.DeleteComic
  );
  router.put(
    "/Comic/EditComic/:comicid",
    JWTactions.verifyToken,
    JWTactions.isAdmin,
    CoverUpdate.single("NewCoverImg"),
    ComicController.EditComic
  );
  router.post(
    "/Comic/Newchapter/:comicId",
    JWTactions.verifyToken,
    JWTactions.isAdmin,
    CoverUpload.single("CoverImg"),
    ComicController.AddNewComic
  );
  router.put(
    "/User/Background/:id",
    JWTactions.verifyToken,
    Bgr_update.single("NewBGRImg"),
    Storemanagement.Editbackground
  );
  router.post(
    "/Comic/Add",
    JWTactions.verifyToken,
    JWTactions.isAdmin,
    CoverUpload.single("CoverImg"),
    ComicController.AddNewComic
  );
  router.post(
    "/User/replycomment",
    JWTactions.verifyToken,
    User_comment_controller.Userpostcomment
  );

  //router cho BaiKTKN_2
  router.get("/ktkn2/allQuestion", Controller.getAllQuestions);
  router.get(
    "/ktkn2/getquestion/:questionId",
    Controller.getAnswersByQuestionId
  );
  router.post("/ktkn2/newQuestion", Controller.newQuestion);
  router.put("/ktkn2/updatequestion", Controller.Updatequestion);
  router.delete("/ktkn2/question/:id", Controller.Deletequestion);

  return app.use("/api", router);
};

export default InitApiRoute;
