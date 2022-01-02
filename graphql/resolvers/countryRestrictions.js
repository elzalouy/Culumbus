require("dotenv").config();
const Twilio = require("twilio");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const CountryRestrictions = require("../../models/countryRestrictions");
const GlobalFields = require("../../models/GlobalFields");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sid = process.env.TWILIO_CHAT_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);

const { nanoid } = require("nanoid");

module.exports = {
  createCountryRestriction: (args) => {
    console.log(args)
    return CountryRestrictions.findOne({
      country: args.restrictionInput.country,
    })
      .then((country) => {
        if (country) {
          console.log(country)
          throw new Error("Country restrictions already added.");
        } else {
          const countryRestriction = new CountryRestrictions(
            args.restrictionInput
          );
          return countryRestriction
            .save()
            .then((result) => {
              return result;
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


  createGlobalField: async(args) => {
    console.log(args)
  //  await GlobalFields.deleteMany({});

    const field = new GlobalFields(
      args.globalFieldInput
    );
    return field
      .save()
      .then((result) => {
        console.log(result)
        return result;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },


  listCountryRestrictions: () => {
    return CountryRestrictions.find()
      .then((countries) => {
        if (countries) {
          // console.log(countries);
          return countries;
        } else {
          return [];
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },


  listGlobalFields: () => {
    return GlobalFields.find()
      .then((fields) => {
        if (fields) {
          // console.log(countries);
          return fields;
        } else {
          return [];
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },


  editCountryRestrictions: () => {
    return CountryRestrictions.findById()
      .then((countries) => {
        if (countries) {
          return countries;
        } else {
          return [];
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  deleteRestriction: (args) => {
    return CountryRestrictions.findByIdAndDelete(args._id)
      .then((country) => {
        if (country) {
          return { message: "Restriction deleted successfully!" };
        } else {
          return { message: "Restriction not found!" };
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  editRestriction: async (args) => {
    console.log(args)
    return GlobalFields.findOneAndUpdate(
      { _id: args._id },
      args.restrictionInput,
      { upsert: true }
    )
      .then((country) => {
        if (country) {
          return { message: "Restriction Updated successfully!" };
        } else {
          throw new Error("Restriction not found!");
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  editGlobalField: async (args) => {
    console.log(args)
    return GlobalFields.findOneAndUpdate(
      { _id: args._id },
      args.globalFieldInput,
      { upsert: true }
    )
      .then((field) => {
        if (field) {
          return { message: "field Updated successfully!" };
        } else {
          throw new Error("field not found!");
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
};
