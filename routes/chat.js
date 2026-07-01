import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Groq from "groq-sdk";
import Chat from "../models/Chat.js";

const router = express.Router();

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

router.post("/", async (req, res) => {

    try {

        const { userId, userMessage } = req.body;

        if (!userId || !userMessage) {

            return res.status(400).json({
                error: "User ID and Message are required"
            });

        }

        const completion = await client.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages: [
                {
                    role: "user",
                    content: userMessage
                }
            ]

        });

        const reply =
        completion.choices[0].message.content;

        // Save Chat
        await Chat.create({

            userId,

            message: userMessage,

            reply

        });

        res.json({

            reply

        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            error:error.message

        });

    }

});

export default router;

/*
import OpenAI from "openai";
import Chat from "../models/Chat.js";

const router = express.Router();


const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


router.post("/", async(req,res)=>{

try{

const {userId,message}=req.body;


const response = await client.responses.create({

model:"gpt-4.1-mini",

input:[
{
role:"system",
content:
"You are a College AI Assistant. Help students with college queries, subjects, exams, CGPA, attendance and notes."
},
{
role:"user",
content:message
}
]

});


const reply = response.output_text;


await Chat.create({

userId:userId,

message:message,

reply:reply

});


res.json({

reply:reply

});


}
catch(error){

console.log(error);

res.status(500).json({

reply:"AI Error : "+error.message

});

}


});


export default router;


/*import express from "express";
import OpenAI from "openai";
import Chat from "../models/Chat.js";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/", async (req, res) => {
  try {
    const { userId, message } = req.body;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: message
    });

    const reply = response.output_text;

    await Chat.create({
      userId,
      message,
      reply
    });

    res.json({ reply });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;
*/
