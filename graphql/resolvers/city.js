require("dotenv").config();
const City = require("../../models/city");

module.exports = {
  createCity: (args, req) => {
    if (req.isAuth) {
      return City.findOne({ name: args.name })
        .then((city) => {
          if (city) {
            throw new Error("City already added.");
          } else {
            const city = new City({ name: args.name, images: args.images });
            return city
              .save()
              .then((result) => {
                return { message: "City added successfully!" };
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

  listCities: (args, req) => {
    // if(req.isAuth){
    return City.find()
      .then((cities) => {
        console.log(cities);
        if (cities) {
          return cities;
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
  deleteCity: (args, req) => {
    if (req.isAuth) {
      return City.findByIdAndDelete(args._id)
        .then((city) => {
          if (city) {
            return { message: "City deleted successfully!" };
          } else {
            return { message: "City not found!" };
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
  editCity: (args, req) => {
    if (req.isAuth) {
      return City.findOneAndUpdate(
        { _id: args._id },
        { name: args.name },
        { upsert: true }
      )
        .then((city) => {
          if (city) {
            return { message: "City Updated successfully!" };
          } else {
            throw new Error("City not found!");
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
