import db from "../../models/index.js";

const NewCategory = async (req, res) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(200).json({
        RM: "Category name is required",
        RC: -203,
      });
    }

    const newCategory = await db.Category.create({
      category_name: category_name,
      description: req.body.description || "",
    });
    if (!newCategory) {
      return res.status(500).json({
        RM: "Failed to create category",
        RC: -500,
      });
    }
    return res.status(200).json({
      RM: "Category created successfully",
      RC: 200,
      RD: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({
      RM: "Internal server error",
      RC: -500,
    });
  }
};

const GetCategories = async (req, res) => {
  try {
    const categories = await db.Category.findAll({
      attributes: ["id", "category_name", "description"],
    });

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        RM: "No categories found",
        RC: -404,
      });
    }

    return res.status(200).json({
      RM: "Categories retrieved successfully",
      RC: 200,
      RD: categories,
    });
  } catch (error) {
    console.error("Error retrieving categories:", error);
    return res.status(500).json({
      RM: "Internal server error",
      RC: -500,
    });
  }
};

const DeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        RM: "Category ID is required",
        RC: -400,
      });
    }

    const category = await db.Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        RM: "Category not found",
        RC: -404,
      });
    }

    await category.destroy();
    return res.status(200).json({
      RM: "Category deleted successfully",
      RC: 200,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      RM: "Internal server error",
      RC: -500,
    });
  }
};

const UpdateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, description } = req.body;

    if (!id || !category_name) {
      return res.status(400).json({
        RM: "Category ID and name are required",
        RC: -400,
      });
    }

    const category = await db.Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        RM: "Category not found",
        RC: -404,
      });
    }

    category.category_name = category_name;
    category.description = description || category.description;

    await category.save();
    return res.status(200).json({
      RM: "Category updated successfully",
      RC: 200,
      RD: category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({
      RM: "Internal server error",
      RC: -500,
    });
  }
};

const AddCateComic = async (req, res) => {
  try {
    const { ComicID, CategoryID } = req.body;

    if (!ComicID || !CategoryID) {
      return res.status(400).json({
        RM: "Comic ID and Category ID are required",
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

    const category = await db.Category.findByPk(CategoryID);
    if (!category) {
      return res.status(404).json({
        RM: "Category not found",
        RC: -404,
      });
    }

    await db.ComicCategory.create({
      comic_id: ComicID,
      category_id: CategoryID,
    });

    return res.status(200).json({
      RM: "Category added to comic successfully",
      RC: 200,
    });
  } catch (error) {
    console.error("Error adding category to comic:", error);
    return res.status(500).json({
      RM: "Internal server error",
      RC: -500,
    });
  }
};

const deleteCateComic = async (req, res) => {
  try {
    console.log("Deleting comic category association: ", req.body);
    const { ComicID, CategoryID } = req?.body;

    if (!ComicID || !CategoryID) {
      return res.status(400).json({
        RM: "Comic ID and Category ID are required",
        RC: -400,
      });
    }

    const comicCategory = await db.ComicCategory.findOne({
      where: {
        comic_id: ComicID,
        category_id: CategoryID,
      },
    });

    if (!comicCategory) {
      return res.status(404).json({
        RM: "Comic category association not found",
        RC: -404,
      });
    }

    await comicCategory.destroy();
    return res.status(200).json({
      RM: "Category removed from comic successfully",
      RC: 200,
    });
  } catch (error) {
    console.error("Error removing category from comic:", error);
    return res.status(500).json({
      RM: "Internal server error",
      RC: -500,
    });
  }
};

const fetchAllComicByCategories = async (req, res) => {
  try {
    console.log("Fetching all comics by categories");
    const categories = await db.Category.findAll({
      attributes: ["id", "category_name", "description"],
      include: [
        {
          model: db.Comic,
          as: "comics",
          through: { attributes: [] },
        },
      ],
    });

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        RM: "No categories found",
        RC: -404,
      });
    }

    return res.status(200).json({
      RM: "Categories with comics retrieved successfully",
      RC: 200,
      RD: categories,
    });
  } catch (error) {
    console.error("Error fetching categories with comics:", error);
    return res.status(500).json({
      RM: "Internal server error",
      RC: -500,
    });
  }
};

export default {
  NewCategory,
  GetCategories,
  DeleteCategory,
  UpdateCategory,
  AddCateComic,
  fetchAllComicByCategories,
  deleteCateComic,
};
