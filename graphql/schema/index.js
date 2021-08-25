const { buildSchema } = require('graphql');
const { ApolloServer, gql } = require('apollo-server');

module.exports =
buildSchema(`
        input Pcr{
            value:Boolean!
            label:String
        }
        type PCR{
            value:Boolean!
            label:String
        }
        type User {
            _id: ID!
            name: String!
            email: String!
            mobileNumber: String!
            chat:  String
            chatID:  String!
            role:  String!
            startedChat: Boolean!
        }
        type SocialUser {
            _id: ID!
            name: String!
            email: String!
            socialID: String!
            socialType: String!
            chat:  String
            chatID:  String!
            role:  String!
            startedChat: Boolean!
        }
        type AuthData {
            token: String!
            user: User!
        }
        type SocialAuthData {
            token: String!
            user: SocialUser!
        }
        type ChatData {
            user: User!
        }
        type SocialChatData {
            user: SocialUser!
        }
        type Data {
            _id: ID!
            data: [String]!  
        }
        type Message {
            message: String!
        }
        type countryRestriction {
            _id: ID!
            country: String!
            openForEgyptians: Boolean!
            pcr: PCR!
            vaccination: PCR!
            doses: String!
            quarantine: String!
            travelForm: String!
            travelBetweenRegions: Boolean!
            shops: String!
            restaurants: String!
            touristicPlaces: String!
            publicTransport: String!
            visaApplying: String!
        }
        type hotelOffers {
            _id: ID!
            name: String!
            description: String!
            images: [String]!
            offer: Int
        }
        type UploadedFileResponse {
            filename: String!
            mimetype: String!
            encoding: String!
            url: String!
        }
        input UserInput {
            name: String!
            mobileNumber: String!
            email: String!
            password: String!
            birthdate: String
        }
        input UserInputApple {
            name: String
            email: String
            socialID: String!
            socialType: String!
            identityToken: String!
        }
        input RestrictionInput {
            country: String!
            openForEgyptians: Boolean!
            pcr: Pcr!
            vaccination: Pcr!
            doses: String!
            quarantine: String!
            travelForm: String!
            travelBetweenRegions: Boolean!
            shops: String!
            restaurants: String!
            touristicPlaces: String!
            publicTransport: String!
            visaApplying: String!
        }
        input DataInput {
            message_id: [String]!
        }
        input HotelOffer {
            name: String!
            description: String!
            images: [String]!
            offer: Int
        }
        type RootQuery {
            users: [User!]!
            login(mobileNumber: String!, password: String!): AuthData!
            listCountryRestrictions: [countryRestriction]!
            listHotelOffers: [hotelOffers]
        }
        type RootMutation {
            deleteMessage(message_id: String!,chat: String!): Message
            register(userInput: UserInput): AuthData
            startChat(mobileNumber: String!): ChatData!
            startChatSocial(socialID: String!): SocialChatData!
            loginWithFacebook(token: String!): SocialAuthData!
            loginWithApple(UserInputApple: UserInputApple!): SocialAuthData!
            forgetPassword(mobileNumber: String!): Message
            verifyForget(mobileNumber: String!,code: String!): Message
            resetPassword(mobileNumber: String!, code: String!, password: String!): Message

            createCountryRestriction(restrictionInput: RestrictionInput): countryRestriction
            deleteRestriction(_id: String!):Message
            editRestriction(restrictionInput: RestrictionInput!,_id:String!):Message

            createHotelOffer(offerInput: HotelOffer!): Message
            deleteOffer(_id: String!):Message
            editHotelOffer(offerInput: HotelOffer!,_id:String!):Message
            
            fileUpload(file: Float!): UploadedFileResponse!
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
        `)