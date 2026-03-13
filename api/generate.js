const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// HEALTH CHECK (so you can open the URL in browser)
app.get("/", (req,res)=>{
res.send("DIJO Gemini AI server is running");
});


app.post("/generate", async (req,res)=>{

try{

const topic = req.body.topic;
const agent = req.body.agent;

let personality = "";

if(agent === "DIJO Coach"){
personality = "You are a motivational fitness influencer creating energetic TikTok advertisements.";
}

else if(agent === "DIJO Analyst"){
personality = "You are a business strategist explaining marketing insights clearly.";
}

else{
personality = "You are a creative social media marketer writing engaging short ads.";
}


const model = genAI.getGenerativeModel({
model: "gemini-1.5-flash"
});


const result = await model.generateContent(

`${personality}

Create a short social media advertisement about: ${topic}

Rules:
- maximum 80 words
- engaging
- social media style
- persuasive tone
`

);


const text = result.response.text();

res.json({ text });

}

catch(error){

console.error(error);

res.json({
text: "DIJO could not generate advertising content right now."
});

}

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
console.log("DIJO Gemini AI server running on port " + PORT);
});
