require("dotenv").config();
const bcrypt = require("bcryptjs");

const User = require("../../models/user");
const config = require("config");
const accountSid = config.get("TWILIO_ACCOUNT_SID");
const authToken = config.get("TWILIO_AUTH_TOKEN");
const sid = config.get("TWILIO_CHAT_SERVICE_SID");
const client = require("twilio")(accountSid, authToken);
const admin = require("firebase-admin");
const user = require("../../models/user");
module.exports = {
  deleteMessage: async (args) => {
    // console.log(args)
    // if(args.isAuth){
    // const user = await User.findOne({ userId: userData.userId })
    // if(user){
    try {
      await client.conversations
        .conversations(args.chat)
        .messages(args.message_id)
        .remove();
      return { message: "Message deleted successfully!" };
    } catch (e) {
      console.log(e);
      return { message: "error" };
    }
    // }else{
    //     throw new Error('User not found.')
    // }
    // }
    // else{
    //     throw new Error('Unauthenticated.')
    // }
    // throw new Error('Unauthenticated.')
  },
  startChat: async (args) => {
    try {
      let User = await user.findOne({ mobileNumber: args.mobileNumber });
      if (!User) throw new Error("User not found");
      else {
        if (User && !user.startedChat) {
          User.startedChat = true;
          await User.save().then((result) => {
            return { user: result };
          });
        }
      }
    } catch (error) {}
  },
  startChatSocial: (args) => {
    return User.findOne({ socialID: args.socialID })
      .then(async (user) => {
        if (user && !user.startedChat) {
          User.startedChat = true;
          await User.save().then((result) => {
            return { user: result };
          });
        } else {
          if (!user) {
            throw new Error("User not found.");
          } else {
            throw new Error("User already started a chat.");
          }
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  setNotification: async (args) => {
    try {
      const User = await user.findOne({ mobileNumber: args.mobileNumber });
      console.log(User);
      if (User) {
        let result = await admin.messaging().sendMulticast({
          notification: {
            title: args.title,
            body: args.text,
          },
          tokens: [User.FCM],
        });
        return { result: result ? true : false };
      } else {
        throw new Error("channel not found");
      }
    } catch (error) {
      console.log(error);
      return { result: false };
    }
  },
  setAdminNotification: async (args) => {
    try {
      const User = await user.findOne({
        mobileNumber: "AdminCulumbus",
      });
      console.log(User);
      if (User) {
        let result = await admin.messaging().sendMulticast({
          notification: {
            title: args.title,
            body: args.text,
          },
          tokens: [User.FCM],
        });
        return { result: result ? true : false };
      } else {
        throw new Error("channel not found");
      }
    } catch (error) {
      return { result: false };
    }
  },
};
