require('dotenv').config();
const Twilio = require('twilio');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HotelOffers = require('../../models/hotelOffers');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const { nanoid } = require('nanoid')
const {
    GraphQLUpload,
    graphqlUploadExpress, 
  } = require('graphql-upload');

module.exports={
    // Upload: GraphQLUpload,
    // UploadedFileResponse: (args,req) => {
    //     return HotelOffers.findOne({country:args.restrictionInput.country}).then(country=>{
    //         if(country){
    //             throw new Error('Hotel offer already added.')
    //         }else{
    //             const hotelOffer = new HotelOffers(args.restrictionInput)
    //             return hotelOffer.save().then(result => {     
    //                 return result
    //                 }).catch(err=>{
    //                 console.log(err);
    //                 throw err;
    //             })

                        

    //         }
    //     }).catch(err=>{
    //         console.log(err);
    //         throw err;
    //     })

       
    // },
    createHotelOffer: args => {
        console.log("create")
        return HotelOffers.findOne({name:args.offerInput.name}).then(offer=>{
            if(offer){
                throw new Error('Hotel offer already added.')
            }else{
                const hotelOffer = new HotelOffers(args.offerInput)
                return hotelOffer.save().then(result => { 
                    return { message:"Offer created successfully!"}    
                    // return result
                    }).catch(err=>{
                    // console.log(err);
                    throw err;
                })

                        

            }
        }).catch(err=>{
            console.log(err);
            throw err;
        })

       
    },
    
    listHotelOffers: (args,req) => {
        if(req.isAuth){
        return HotelOffers.find().then(offers=>{
            if(offers){
                return offers
            }else{
                return []
            }
        }).catch(err=>{
            console.log(err);
            throw err;
        })
    }else{
        throw new Error("Not authenticated!")
    }
       
    },
    deleteOffer: (args) => {
        return HotelOffers.findByIdAndDelete(args._id).then(offer=>{
 
            if(offer){
                
                return { message:"Offer deleted successfully!"}

            }else{
         
                return { message:"Offer not found!"}


            }
        }).catch(err=>{
            console.log(err);
            throw err;
        })

       
    },
    editHotelOffer: (args) => {
        return HotelOffers.findOneAndUpdate({_id:args._id},args.offerInput, {upsert: true}).then(offer=>{
       
            if(offer){
                
                return { message:"Offer Updated successfully!"}

            }else{
         
                throw new Error("Offer not found!")


            }
        }).catch(err=>{
            console.log(err);
            throw err;
        })

       
    },
}