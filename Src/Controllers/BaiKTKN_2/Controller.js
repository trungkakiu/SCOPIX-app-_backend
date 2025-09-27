import db from "../../models/index.js";

const getAllQuestions = async (req, res) => {
  try {
    const results = await db.Question.findAll({
      include: [
        {
          model: db.Answer,
          as: "answers",
          attributes: ["id", "label", "content"],
        },
      ],
      attributes: ["id", "title", "isCorrect"],
    });
    return res.status(200).json({
      RM: "Get all questions successfully!",
      RC: 200,
      RD: results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Oops, server error!",
      RC: -500,
    });
  }
};

const newQuestion = async (req, res) => {
  try {
    const { title, isCorrect, answers } = req.body;
    console.log(title, isCorrect, answers);

    if (!title || !isCorrect || !answers || answers.length !== 4) {
      return res.status(400).json({
        RM: "Oops, missing parameters!",
        RC: -203,
      });
    }

    const newQuestion = await db.Question.create({
      title: title,
      isCorrect: isCorrect,
    });

    const answersData = answers.map((a) => ({
      questionId: newQuestion.id,
      label: a.label,
      content: a.content,
    }));

    await db.Answer.bulkCreate(answersData);

    return res.status(200).json({
      RM: "New question created successfully!",
      RC: 200,
      RD: { ...newQuestion.dataValues, answers: answersData },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Oops, server error!",
      RC: -500,
    });
  }
};

const getAnswersByQuestionId = async (req, res) => {
  try {
    const { questionId } = req.params;
    if (!questionId) {
      return res.status(200).json({
        RM: "Oops, missing parameters!",
        RC: -203,
      });
    }
    const question = await db.Question.findOne({
      where: { id: questionId },
      include: [
        {
          model: db.Answer,
          as: "answers",
          attributes: ["id", "label", "content"],
        },
      ],
    });
    if (!question) {
      return res.status(200).json({
        RM: "Question not found!",
        RC: -204,
      });
    }
    return res.status(200).json({
      RM: "Get answers by questionId successfully!",
      RC: 200,
      RD: question,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Oops, server error!",
      RC: -500,
    });
  }
};

const Updatequestion = async (req, res) => {
  try {
    const { id, title, isCorrect, A, B, C, D } = req.body;
    if (!id) {
      return res.status(200).json({
        RM: "Oops, missing parameters!",
        RC: -203,
      });
    }

    const question = await db.Question.findOne({
      where: { id: id },
      include: [{ model: db.Answer, as: "answers" }],
    });

    if (!question) {
      return res.status(200).json({
        RM: "Question not found!",
        RC: -204,
      });
    }

    question.title = title ?? question.title;
    question.isCorrect = isCorrect ?? question.isCorrect;
    await question.save();

    if (A)
      await db.Answer.update(
        { content: A },
        { where: { questionId: id, label: "A" } }
      );
    if (B)
      await db.Answer.update(
        { content: B },
        { where: { questionId: id, label: "B" } }
      );
    if (C)
      await db.Answer.update(
        { content: C },
        { where: { questionId: id, label: "C" } }
      );
    if (D)
      await db.Answer.update(
        { content: D },
        { where: { questionId: id, label: "D" } }
      );

    const updatedQuestion = await db.Question.findOne({
      where: { id: id },
      include: [{ model: db.Answer, as: "answers" }],
    });

    return res.status(200).json({
      RM: "Question updated successfully!",
      RC: 200,
      data: updatedQuestion,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      RM: "Oops, server error!",
      RC: -500,
    });
  }
};

const Deletequestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(200).json({
        RM: "Oops, missing parameters!",
        RC: -203,
      });
    }
    const question = await db.Question.findOne({
      where: { id: id },
    });
    if (!question) {
      return res.status(200).json({
        RM: "Question not found!",
        RC: -204,
      });
    }
    await question.destroy();
    return res.status(200).json({
      RM: "Question deleted successfully!",
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

export default {
  getAllQuestions,
  getAnswersByQuestionId,
  Updatequestion,
  Deletequestion,
  newQuestion,
};
