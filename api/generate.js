const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// HEALTH CHECK
app.get("/", (req,res)=>{
res.send("DIJO Gemini AI server is running");
});


// TEST ROUTE (so /generate doesn't show confusing error)
app.get("/generate",(req,res)=>{
res.send("Generate endpoint working. Use POST request.");
});


// MAIN AI ROUTE
app.post("/generate", async (req,res)=>{

try{

const topic = req.body.topic;
const agent = req.body.agent;

// BASIC VALIDATION
if(!topic){
return res.status(400).json({
text:"No topic provided."
});
}

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


// CREATE MODEL
const model = genAI.getGenerativeModel({
model: "gemini-1.5-flash"
});


// GENERATE CONTENT
const result = await model.generateContent(

`${personality}

Create a short social media advertisement about: ${topic}

Rules:
- maximum 80 words
- engaging
- persuasive
- social media friendly
`

);


// EXTRACT TEXT
const text = result.response.text();


// RETURN RESPONSE
res.json({
text: text
});

}

catch(error){

console.error("Gemini error:", error);

res.status(500).json({
text: "DIJO could not generate advertising content right now."
});

}

});


// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
console.log("DIJO Gemini AI server running on port " + PORT);
});
