require("dotenv").config();
const Adrenaline = require("../../models/adrenaline");

module.exports = {
  createEvent: (args, req) => {
    if (req.isAuth) {
      return Adrenaline.findOne({ title: args.eventInput.title })
        .then((offer) => {
          if (offer) {
            console.log(offer);
            throw new Error("Event already added.");
          } else {
            const event = new Adrenaline(args.eventInput);
            return event
              .save()
              .then((result) => {
                return { message: "Event created successfully!" };
                // return result
              })
              .catch((err) => {
                // console.log(err);
                throw err;
              });
          }
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    } else {
      throw new Error("Not authenticated!");
    }
  },

  listEvents: (args, req) => {
    // if(req.isAuth){
    return Adrenaline.find()
      .populate({ path: "city", select: "name" })
      .then((events) => {
        if (events) {
          return events;
        } else {
          return [];
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
    // }else{
    //     throw new Error("Not authenticated!")
    // }
  },
  deleteEvent: (args, req) => {
    if (req.isAuth) {
      return Adrenaline.findByIdAndDelete(args._id)
        .then((event) => {
          if (event) {
            return { message: "Event deleted successfully!" };
          } else {
            return { message: "Event not found!" };
          }
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    } else {
      throw new Error("Not authenticated!");
    }
  },
  editEvent: (args, req) => {
    if (req.isAuth) {
      return Adrenaline.findOneAndUpdate({ _id: args._id }, args.eventInput, {
        upsert: true,
      })
        .then((event) => {
          if (event) {
            return { message: "Event Updated successfully!" };
          } else {
            throw new Error("Event not found!");
          }
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    } else {
      throw new Error("Not authenticated!");
    }
  },
};
