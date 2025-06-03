const prisma = require("../../prisma/config");
const path = require("path");

async function getLists(req, res) {
  try {
    const userId = req.user.id;
    const lists = await prisma.List.findMany({
      where: { userId },
      include: { tasks: true },
    });

    if (!lists) {
      return res.status(404).json({
        code: "Lists_NOT_FOUND",
        message: "No lists has been created yet",
      });
    }

    res.json({
      message: "Lists fetched successfully",
      data: lists,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch lists, please try again" });
  }
}

async function createList(req, res) {
  try {
    const imgPath = req.file?.filename ?? null;

    newList = await prisma.List.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        userId: req.user.id,
        imgPath,
        tasks: {
          create: req.body.tasks,
        },
      },
      include: {
        tasks: true,
      },
    });

    res.status(201).json({
      message: "List created successfully",
      data: newList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create list, please try again" });
  }
}

async function deleteList(req, res) {
  try {
    const listId = req.params.id;
    const userId = req.user.id;

    const list = await prisma.List.findUnique({
      where: {
        id: listId,
      },
    });

    if (!list) {
      return res.status(404).json({
        code: "LIST_NOT_FOUND",
        message: "This list does not exist",
      });
    }

    if (listId !== userId) {
      return res.status(403).json({
        code: "LIST_NOT_OWNER",
        message: "You are not the owner of this list",
      });
    }

    await prisma.Task.delete({
      where: {
        listsId: listId,
      },
    });
    await prisma.List.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      message: "List deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to delete list, please try again",
    });
  }
}

async function updateList(req, res) {
  try {
    const listId = req.params.id;
    const userId = req.user.id;
    const list = await prisma.List.findUnique({
      where: {
        id: listId,
      },
    });

    if (!list) {
      return res.status(404).json({
        code: "LIST_ACCESS_DENIED",
        message: "This list does not exist",
      });
    }
    if (listId !== userId) {
      return res.status(403).json({
        error: "Forbidden",
        code: "LIST_ACCESS_DENIED",
        message: "You are not the owner of this list",
      });
    }

    await prisma.List.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title,
        description: req.body.description,
        imgPath: req.body.imgPath,
      },
    });

    res.status(200).json({
      message: "List updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update list, please try again" });
  }
}

async function downloadListImg(req, res) {
  try {
    const listId = req.params.id;
    const list = await prisma.List.findUnique({
      where: {
        id: listId,
      },
    });

    if (!list) {
      return res.status(404).json({
        code: "LIST_NOT_FOUND",
        message: "This list does not exist",
      });
    }

    const imgPath = list.imgPath;

    if (!imgPath) {
      return res.status(404).json({
        code: "LIST_NOT_FOUND",
        message: "This list does not have an image",
      });
    }

    const imgDir = path.join(__dirname, "../../uploads", imgPath);
    res.download(imgDir);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to download list image, please try again" });
  }
}

module.exports = {
  getLists,
  createList,
  deleteList,
  updateList,
  downloadListImg,
};
