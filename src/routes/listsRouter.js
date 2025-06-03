const router = require("express").Router();
const listsController = require("../controllers/listsController");
const upload = require("../middleware/uploadMiddleware");
const multer = require("multer");

router.get("/", listsController.getLists);

router.post("/create", (req, res) => {
  upload.single("imgPath")(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          code: "Multipart_UPLOAD_FAILED",
          message: err.message,
        });
      }
      return res.status(500).json({
        message: "Failed to upload image, please try again",
      });
    }
    const tasks = req.body.tasks;
    req.body.tasks = JSON.parse(tasks);

    listsController.createList(req, res);
  });
});

router.delete("/delete/:id", listsController.deleteList);

router.put("/update/:id", listsController.updateList);

router.get("/download/:id", listsController.downloadListImg);

module.exports = router;
