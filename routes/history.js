import express from "express";
import Chat from "../models/chat.js";

const router = express.Router();


// =========================
// Get User Chat History
// =========================
router.get("/:userId", async (req, res) => {

    try{

        const chats = await Chat.find({
            userId: req.params.userId
        }).sort({ createdAt: -1 });

        res.json(chats);

    }catch(err){

        res.status(500).json({
            error: err.message
        });

    }

});


// =========================
// Delete Single Chat
// =========================
router.delete("/:id", async (req, res) => {

    try{

        await Chat.findByIdAndDelete(req.params.id);

        res.json({
            message:"Chat Deleted Successfully"
        });

    }catch(err){

        res.status(500).json({
            error:err.message
        });

    }

});


// =========================
// Delete All User Chats
// =========================
router.delete("/clear/:userId", async (req, res) => {

    try{

        await Chat.deleteMany({
            userId:req.params.userId
        });

        res.json({
            message:"All History Cleared"
        });

    }catch(err){

        res.status(500).json({
            error:err.message
        });

    }

});

export default router;





/*import express from "express";
import Chat from "../models/Chat.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {

  const chats = await Chat.find({
    userId: req.params.userId
  }).sort({ createdAt: 1 });

  res.json(chats);

});

export default router;*/