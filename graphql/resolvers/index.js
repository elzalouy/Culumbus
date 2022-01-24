const authResolver = require("./auth");
const chatResolver = require("./chat");
const countryRestrictionsResolver = require("./countryRestrictions");
const hotelOffersResolver = require("./hotelOffers");
const citiesResolver = require("./city");
const adrenalineResolver = require("./adrenaline");

const rootResolver = {
  ...authResolver,
  ...chatResolver,
  ...countryRestrictionsResolver,
  ...hotelOffersResolver,
  ...citiesResolver,
  ...adrenalineResolver,
};

module.exports = rootResolver;
