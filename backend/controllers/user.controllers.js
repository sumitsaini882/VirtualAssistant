import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import geminiResponse from "../gemini.js";
import { response } from "express";
import moment from "moment";
import { userInfo } from "os";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Get current User Error!" });
  }
};
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage = imageUrl; 

    if (req.file) {
      const uploadRes = await uploadOnCloudinary(req.file.path);
      
      assistantImage = uploadRes?.secure_url || uploadRes; 
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { returnDocument: 'after' } 
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in updateAssistant:", error);
    return res.status(400).json({ message: "Update Assistant Error!" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    user.history.push(command)
    await user.save()

    const userName = user.name;
    const assistantName = user.assistantName;
    const result = await geminiResponse(command,assistantName, userName);
    
    if (!result) {
  return res.json({
    type: "general",
    userInput: command,
    response: "AI quota exceeded, try later",
  });
}

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, i can't understand" });
    }
    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type;

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("DD-MM-YYYY")}`,
        });
      case "get-time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format("hh:mm A")}`,
        });
      case "get-day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });
      case "get-month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("MMMM")}`,
        });

      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });
 default:
    return res.status(400).json({ response: "Sorry, i didn't understand that command." });
    }
  } catch (error) {
  console.log("🔥 ERROR:", error.message);

  return res.json({   // ❗ no 500
    type: "general",
    userInput: req.body.command,
    response: "AI not available (quota exceeded)",
  });
}
};
