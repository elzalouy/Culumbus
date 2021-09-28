require('dotenv').config();
const Twilio = require('twilio');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const CountryRestrictions = require('../../models/countryRestrictions');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sid = process.env.TWILIO_CHAT_SERVICE_SID;
const client = require('twilio')(accountSid, authToken);

const { nanoid } = require('nanoid')

module.exports={
    createCountryRestriction: args => {
        return CountryRestrictions.findOne({country:args.restrictionInput.country}).then(country=>{
            if(country){
                throw new Error('Country restrictions already added.')
            }else{
         
                            const countryRestriction = new CountryRestrictions(args.restrictionInput)
                            return countryRestriction.save().then(result => {
                             
                                return result
                         }).catch(err=>{
                            console.log(err);
                            throw err;
                        })

                        

            }
        }).catch(err=>{
            console.log(err);
            throw err;
        })

       
    },
    
    listCountryRestrictions: () => {
        return CountryRestrictions.find().then(countries=>{
            if(countries){

                return countries
            }else{
         
                return []


            }
        }).catch(err=>{
            console.log(err);
            throw err;
        })

       
    },
    editCountryRestrictions: () => {
        return CountryRestrictions.findById().then(countries=>{
            if(countries){

                return countries
            }else{
         
                return []


            }
        }).catch(err=>{
            console.log(err);
            throw err;
        })

       
    },
    deleteRestriction: (args) => {
        return CountryRestrictions.findByIdAndDelete(args._id).then(country=>{
 
            if(country){
                
                return { message:"Restriction deleted successfully!"}

            }else{
         
                return { message:"Restriction not found!"}


            }
        }).catch(err=>{
            console.log(err);
            throw err;
        })

       
    },
    editRestriction: (args) => {
        return CountryRestrictions.findOneAndUpdate({_id:args._id},args.restrictionInput, {upsert: true}).then(country=>{
       
            if(country){
                
                return { message:"Restriction Updated successfully!"}

            }else{
         
                throw new Error("Restriction not found!")


            }
        }).catch(err=>{
            console.log(err);
            throw err;
        })

       
    },
}