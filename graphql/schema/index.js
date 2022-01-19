const { buildSchema } = require("graphql");
const { ApolloServer, gql } = require("apollo-server");

module.exports = buildSchema(`
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
            birthdate: String
            
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
        type ResponseUser {
            _id: ID!
            name: String!
            email: String!
            socialID: String
            socialType: String
            chat:  String
            chatID:  String!
            role:  String!
            startedChat: Boolean!
            mobileNumber: String
            birthdate: String
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
        type globalFields {
            _id : ID!
            LastUpdatedAt: String
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
            date:String
            remarks:String
        }
        type hotelOffers {
            _id: ID!
            name: String!
            description: String!
            images: [String]!
            offer: Int
        }
        type cities {
            _id: ID!
            name: String!
            images: [String]

        }
        type Event {
            _id: ID!
            title: String!
            description: String!
            images: [String]
            price: String!
            duration: String!
            city: cities

        }
        type UploadedFileResponse {
            filename: String!
            mimetype: String!
            encoding: String!
            url: String!
        }
        type Notification {
            result : Boolean!
        }
        type ChannelReponse {
            user : [channelUserResponse]
            channelSid:String
        }
        type channelUserResponse {
            FCM : String
            id : String
        }
        input EventInput {
            title: String!
            description: String!
            images: [String]
            price: String!
            duration: String!
            city: String!
        }
        input citiesInput {
            name: String!
            images: [String]
        }
        input dataOrder {
            type : String!
            product_identifier : String!
            quantity: Int
            language: String!
        }
        input customer {
            firstname: String!
            lastname: String!
            email: String!
        }
        input userOrder {
            customer:customer!
        }
        input editUserInput {
            _id: String
            name: String
            birthdate: String
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
        input GlobalFieldInput{
            LastUpdatedAt: String
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
            date: String
            remarks:String
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
        input orderData {
            order:dataOrder
            user:userOrder
        }
      
        input channelUser {
            FCM : String
            id : String
        }

        type RootQuery {
            users: [User!]!
            login(mobileNumber: String!, password: String!): AuthData!
            listCountryRestrictions: [countryRestriction]!
            listHotelOffers: [hotelOffers]
            listCities: [cities]
            listEvents: [Event]
            listGlobalFields: [globalFields]
            getChannel(channelSid:String): ChannelReponse
        }
        type RootMutation {
            deleteMessage(message_id: String!,chat: String!): Message
            register(userInput: UserInput): AuthData
            editProfile(userInput: editUserInput,_id:String!): ResponseUser
            deleteAccount(_id: String!):Message
            startChat(mobileNumber: String!): ChatData!
            startChatSocial(socialID: String!): SocialChatData!
            loginWithFacebook(token: String!): SocialAuthData!
            loginWithApple(UserInputApple: UserInputApple!): SocialAuthData!
            forgetPassword(mobileNumber: String!): Message
            verifyForget(mobileNumber: String!,code: String!): Message
            resetPassword(mobileNumber: String!, code: String!, password: String!): Message

            createCountryRestriction(restrictionInput: RestrictionInput): countryRestriction
            createGlobalField(globalFieldInput: GlobalFieldInput): globalFields

            deleteRestriction(_id: String!):Message
            editRestriction(restrictionInput: RestrictionInput!,_id:String!):Message
            editGlobalField(_id:String!,globalFieldInput: GlobalFieldInput):Message

            createHotelOffer(offerInput: HotelOffer!): Message
            deleteOffer(_id: String!):Message
            editHotelOffer(offerInput: HotelOffer!,_id:String!):Message

            createCity(name: String!, images: [String]): Message
            deleteCity(_id: String!):Message
            editCity(name: String!,_id:String!,images: [String]):Message

            createEvent(eventInput: EventInput!): Message
            deleteEvent(_id: String!):Message
            editEvent(eventInput: EventInput!,_id:String!):Message
            
            fileUpload(file: Float!): UploadedFileResponse!

            makeOrder(data: orderData!):Message
            setNotification(channelSid:String!, userId:String!,text:String!,imageUrl:String!,title:String!):Notification
            setChannel(channelSid:String!,user:channelUser!, FCM:String!) : ChannelReponse
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
`);
