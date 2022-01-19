require("dotenv").config();
const Twilio = require("twilio");
const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");

const mongoose = require("mongoose");
const morgan = require("morgan");
const schema = require("./graphql/schema/index");
const resolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");
const app = express();
const cors = require("cors");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");

const AccessToken = Twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;
let multer = require("multer");
let upload = multer();
var fs = require("fs");
// const InitializePushNotificaitonTwilio = require("./services/Twilio");
const Route = require("./startup/Config/Route");
const FCM = require("./services/FCM");
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const sid = process.env.TWILIO_CHAT_SERVICE_SID;
// const client = require('twilio')(accountSid, authToken);

// client.chat.services(sid)
//            .channels('CHaaeb509ce38f4bec8ea7b271966ed2b4')
//            .update({friendlyName: 'Ibraam Emad'})
//            .then(channel => console.log(channel.friendlyName));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
FCM.initialize();
Route(app);
// InitializePushNotificaitonTwilio(app);
app.use(morgan("tiny"));
app.use(isAuth);
app.use("/files", express.static("files"));
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

app.get("/check", (req, res) => {
  res.status(200).send({
    check: false,
  });
});

app.get("/token/:identity", (req, res) => {
  const identity = req.params.identity;
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );

  token.identity = identity;
  // console.log(identity)
  token.addGrant(
    new ChatGrant({
      serviceSid: process.env.TWILIO_CHAT_SERVICE_SID,
      pushCredentialSid: process.env.FCM_CREDENTIALS_SID,
    })
  );
  res.send({
    identity: token.identity,
    jwt: token.toJwt(),
  });
});

app.post("/upload", upload.single("file"), function (req, res) {
  var name = nanoid(20);
  fs.writeFile(
    "./files/images/" + name + ".png",
    req.file.buffer,
    function (err) {
      if (err) console.log(err);
    }
  );
  res.send({
    image_id: name,
  });
});

app.delete("/delete/:image", function (req, res) {
  try {
    fs.unlinkSync("./files/images/" + req.params.image + ".png");
    res.status(200).send({
      message: "image deleted",
    });
  } catch (err) {
    res.status(400).send({
      error: "image not deleted",
    });
  }
});

//&authSource=admin&replicaSet=culumbus-db&tls=true&tlsCAFile=./dbcert.crtc
mongoose
  .connect(
    // `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    "mongodb://localhost:27017/culumbus",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Server running...");
    app.listen(3000);
    //--
    User.findOne({ mobileNumber: "AdminCulumbus" })
      .then((user) => {
        if (!user) {
          return bcrypt
            .hash("AdminCulumbus", 12)
            .then((pass) => {
              const user = new User({
                name: "Admin",
                email: "AdminCulumbus@gmail.com",
                mobileNumber: "AdminCulumbus",
                password: pass,
                chatID: "AdminCulumbus",
                role: "admin",
                startedChat: true,
              });
              return user.save();
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

    //--
  })
  .catch((err) => {
    console.log(err);
  });

// mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-hpsit.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
//     .then(() => {
//         app.listen(3000);
//     }).catch(err => {
//         console.log(err)
//     })
