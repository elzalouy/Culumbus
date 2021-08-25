const authResolver= require('./auth')
const chatResolver= require('./chat')
const countryRestrictionsResolver= require('./countryRestrictions')
const hotelOffersResolver= require('./hotelOffers')

const rootResolver= {
    ...authResolver,
    ...chatResolver,
    ...countryRestrictionsResolver,
    ...hotelOffersResolver,
}

module.exports = rootResolver;