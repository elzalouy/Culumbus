require("dotenv").config();
const Twilio = require("twilio");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/user");
const ForgetCodes = require("../../models/forgetCodes");
const accountSid = config.get("TWILIO_ACCOUNT_SID");
const authToken = config.get("TWILIO_AUTH_TOKEN");
const sid = config.get("TWILIO_CHAT_SERVICE_SID");
const client = require("twilio")(accountSid, authToken);

const crypto = require("crypto");
const axios = require("axios");
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
const forgetCodes = require("../../models/forgetCodes");
const mongoose = require("mongoose");

// let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: "CulumbusTest", // generated ethereal user
//       pass: "12345678Culumbus", // generated ethereal password
//     },
//   });
//let transporter =nodemailer.createTransport('smtps://CulumbusTest@gmail.com:12345678Culumbus@smtp.gmail.com');
// const AppleAuth = require('apple-auth');
// const appleAuth = new AppleAuth({
//     client_id: "org.o-project.Culumbus", // eg: my.unique.bundle.id.iMessageClone
//     team_id: "T2F9Q79X6G", // eg: FWD9Q5VYJ2
//     key_id: "UU6FWD8K96", // eg: 8L3ZMA7M3V
//     scope: "name email"
//   }, './keys/AuthKey_UU6FWD8K96.p8');
//   appleAuth.accessToken("c3d9b61c82c964edeba98537e3c9b3266.0.szvs.RyMLWarklAFOcwOVjgsccg").then((response)=>{
//     console.log(response)

//   }).catch(e=>console.log(e))

module.exports = {
  users: () => {
    return User.find()
      .then((users) => {
        return users.map((result) => {
          return { ...result._doc };
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  register: (args) => {
    return User.findOne({
      mobileNumber: args.userInput.mobileNumber,
      email: args.userInput.email,
    })
      .then((user) => {
        if (user) {
          throw new Error("User already exists.");
        } else {
          return bcrypt
            .hash(args.userInput.password, 12)
            .then((pass) => {
              return client.chat
                .services(config.get("TWILIO_CHAT_SERVICE_SID"))
                .users.create({
                  identity: args.userInput.mobileNumber,
                  friendlyName: args.userInput.name,
                })
                .then((newUser) => {
                  const user = new User({
                    name: args.userInput.name,
                    email: args.userInput.email,
                    mobileNumber: args.userInput.mobileNumber,
                    birthdate: args.userInput.birthdate,
                    password: pass,
                    chat: null,
                    chatID: args.userInput.mobileNumber,
                    role: "user",
                    startedChat: false,
                    FCM: "0",
                  });
                  return user.save().then((result) => {
                    const token = jwt.sign(
                      { userId: result._id, mobileNumber: user.mobileNumber },
                      process.env.SECRET_KEY,
                      { expiresIn: "1y" }
                    );
                    return { token: token, user: user };
                  });
                })
                .catch((err) => {
                  console.log(err);
                  throw err;
                });
            })
            .catch((err) => {
              console.log(err);
              throw err;
            });
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },

  editProfile: (args) => {
    return User.findOneAndUpdate({ _id: args._id }, args.userInput, {
      upsert: true,
      new: true,
    })
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  deleteAccount: async (args) => {
    console.log("delete account");
    let user = await User.findById(args._id);
    if (user) {
      if (user.chat) {
        console.log("chat");
        // client.conversations.users(user.chatID).remove();
        client.chat
          .services(config.get("TWILIO_CHAT_SERVICE_SID"))
          .users(user.chat)
          .remove();
      }
      console.log("out");
      let result = await User.findOneAndDelete({
        mobileNumber: user.mobileNumber,
      });
      console.log(result);
      return { message: "account deleted successfully" };
    } else {
      return { message: "account deleted" };
    }
  },
  createData: (args) => {
    const data = new Data({
      data: args.userInput.data,
      user: "$2a$12$0alMltuILa9rkyYx1dbsoerRqXeWNa.FaT5.u/SfqIITn.8NRYhEO",
    });
    return data
      .save()
      .then((result) => {
        User.findById(
          "$2a$12$0alMltuILa9rkyYx1dbsoerRqXeWNa.FaT5.u/SfqIITn.8NRYhEO"
        ).then((user) => {
          user.data.push(result.id);
          return user.save();
        });
        return { ...result._doc };
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },

  login: async ({ mobileNumber, password }) => {
    console.log("login");
    const user = await User.findOne({ mobileNumber: mobileNumber });
    if (!user) {
      throw new Error("User does not exist!");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }
    const token = jwt.sign(
      { userId: user._id, mobileNumber: user.mobileNumber },
      process.env.SECRET_KEY,
      { expiresIn: "1y" }
    );
    // const refreshToken = jwt.sign({userId:user._id}, Constant.ACCESS_TOKEN_SECRET, { expiresIn: '1y' });
    return { token: token, user: user };
  },

  loginWithFacebook: async ({ token }) => {
    return axios
      .get(
        `https://graph.facebook.com/v2.8/me?fields=id,name,email&access_token=${token}`
      )
      .then(function (response) {
        var facebook_id = response.data.id;
        var name = response.data.name;
        var email = response.data.email;
        return User.findOne({ socialID: facebook_id })
          .then((user) => {
            if (user) {
              const token = jwt.sign(
                { userId: user._id, mobileNumber: user.socialID },
                process.env.SECRET_KEY,
                { expiresIn: "1y" }
              );
              return { token: token, user: user };
            } else {
              return client.conversations.users
                .create({ identity: facebook_id, friendlyName: name })
                .then((newUser) => {
                  var password = nanoid(20);
                  const userx = new User({
                    name: name,
                    email: email,
                    // mobileNumber: 'x',
                    socialID: facebook_id,
                    socialType: "facebook",
                    password: password,
                    chat: null,
                    chatID: facebook_id,
                    role: "user",
                    startedChat: false,
                    FCM: "0",
                  });
                  return userx.save().then((result) => {
                    const token = jwt.sign(
                      { userId: result._id, socialID: facebook_id },
                      process.env.SECRET_KEY,
                      { expiresIn: "1y" }
                    );

                    return { token: token, user: userx };
                  });
                })
                .catch((err) => {
                  console.log(err);
                  throw err;
                });
            }
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      });
  },
  loginWithApple: (args) => {
    return User.findOne({
      socialID: args.UserInputApple.socialID,
      socialType: "apple",
    })
      .then((user) => {
        if (user) {
          const token = jwt.sign(
            { userId: user._id, mobileNumber: user.socialID },
            process.env.SECRET_KEY,
            { expiresIn: "1y" }
          );
          return { token: token, user: user };
        } else {
          return User.findOne({ email: args.UserInputApple.email }).then(
            (user) => {
              if (!user) {
                if (args.UserInputApple.email) {
                  return client.chat
                    .services(config.get("TWILIO_CHAT_SERVICE_SID"))
                    .users.create({
                      identity: args.UserInputApple.socialID,
                      friendlyName: args.UserInputApple.name,
                    })
                    .then((newUser) => {
                      newUser.isNotifiable = true;
                      newUser.update();
                      var password = nanoid(20);
                      const userx = new User({
                        name: args.UserInputApple.name,
                        email: args.UserInputApple.email,
                        // mobileNumber: 'x',
                        socialID: args.UserInputApple.socialID,
                        socialType: "apple",
                        password: password,
                        chat: null,
                        chatID: args.UserInputApple.socialID,
                        role: "user",
                        startedChat: false,
                        FCM: "0",
                      });
                      return userx.save().then((result) => {
                        const token = jwt.sign(
                          {
                            userId: result._id,
                            socialID: args.UserInputApple.socialID,
                          },
                          process.env.SECRET_KEY,
                          { expiresIn: "1y" }
                        );

                        return { token: token, user: userx };
                      });
                    });
                } else {
                  throw new Error("Email should be provided!");
                }
              } else {
                throw new Error(
                  "This email is already linked to another account!"
                );
              }
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },

  // validateToken: async ({ token }) => {
  //     const user = await User.findOne({ email: email })
  //     if (!user) {
  //         throw new Error('User does not exist!')
  //     }
  //     var verification = jwt.verify(token, process.env.SECRET_KEY);
  //     console.log(verification)
  //     return { };

  // },

  forgetPassword: async (args) => {
    console.log(args);
    const user = await User.findOne({ mobileNumber: args.mobileNumber });
    const users = await User.find({});
    console.log(users);
    if (user) {
      let code = Math.floor(1000 + Math.random() * 9000);
      const newCode = new ForgetCodes({
        userId: user._id,
        code: code,
      });
      return newCode
        .save()
        .then(async (result) => {
          // var transporter = nodemailer.createTransport({
          //   service: "gmail",
          //   auth: {
          //     user: "culumbusapp@gmail.com",
          //     pass: "glyifhtawqyifhrf",
          //   },
          // });
          const transporter = nodemailer.createTransport(
            `smtps://culumbusapp@gmail.com:glyifhtawqyifhrf@smtp.gmail.com`
          );
          // pass: "o#123456789",
          var mailOptions = {
            from: "culumbusapp@gmail.com", // sender address
            to: user.email, // list of receivers
            subject: "Reset Password", // Subject line
            // text: 'Hello world ?',
            html: `<p>  A password reset was requested for your account and your password reset code is <b>${code}.</b></p>`, // html body
          };
          transporter.sendMail(mailOptions, function (error, info) {
            console.log(error, info);
            if (error) {
              throw new Error(error);
            }
          });
          return { message: `Code sent to ${user.email} successfully!` };
        })
        .catch((e) => {
          throw new Error(e);
        });
    } else {
      throw new Error("User does not exist!");
    }
  },
  verifyForget: async (args, req) => {
    const user = await User.findOne({ mobileNumber: args.mobileNumber });
    if (user) {
      const code = await ForgetCodes.findOne({
        userId: user._id,
        code: args.code,
      });
      if (code) {
        return { message: `Code valid!` };
      } else {
        throw new Error("Invalid code!");
      }
    } else {
      throw new Error("User does not exist!");
    }
  },

  resetPassword: async (args, req) => {
    const user = await User.findOne({ mobileNumber: args.mobileNumber });
    if (user) {
      const code = await ForgetCodes.findOne({
        userId: user._id,
        code: args.code,
      });
      if (code) {
        return bcrypt
          .hash(args.password, 12)
          .then((pass) => {
            user.password = pass;
            return user
              .save()
              .then(async (result) => {
                return { message: `Password reset successfully!` };
              })
              .catch((e) => {
                throw new Error(e);
              });
          })
          .catch((e) => {
            throw new Error(e);
          });
      } else {
        throw new Error("Invalid code!");
      }
    } else {
      throw new Error("User does not exist!");
    }
  },
  checkAdminFcm: async () => {
    const admin = await User.findOne({
      email: "AdminCulumbus@gmail.com",
      mobileNumber: "AdminCulumbus",
    });
    if (admin) {
      if (admin.FCM === "0") throw new Error("Admin FCM is null");
      else return { result: true };
    }
  },
  setAdminFcm: async (args) => {
    const admin = await User.findOne({
      email: "AdminCulumbus@gmail.com",
      mobileNumber: "AdminCulumbus",
    });
    if (admin) {
      admin.FCM = args.FCM;
      await admin.save();
      return { result: true };
    }
  },
  setUserFcm: async (args) => {
    const user = await User.findOne({
      email: args.email,
    });
    console.log("args is", args);
    if (user) {
      user.FCM = args.FCM;
      let result = await user.save();
      return { result: true };
    }
  },
};
