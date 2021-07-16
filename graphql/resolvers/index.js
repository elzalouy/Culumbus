const authResolver= require('./auth')
const chatResolver= require('./chat')
const countryRestrictionsResolver= require('./countryRestrictions')

const rootResolver= {
    ...authResolver,
    ...chatResolver,
    ...countryRestrictionsResolver,
}

module.exports = rootResolver;