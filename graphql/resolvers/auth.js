require('dotenv').config();
const Twilio = require('twilio');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sid = process.env.TWILIO_CHAT_SERVICE_SID;
const client = require('twilio')(accountSid, authToken);

const crypto = require("crypto")
const axios = require('axios');
const { nanoid } = require('nanoid')

module.exports={
    users: () => {
        return User.find()
            .then(users => {
                return users.map(result => {
                    return { ...result._doc }
                })
            }).catch(err => {
                throw err
            });
    },
    register: args => {
        return User.findOne({mobileNumber:args.userInput.mobileNumber}).then(user=>{
            if(user){
                throw new Error('User already exists.')
            }else{
                return bcrypt.hash(args.userInput.password,12).then(pass=>{
                return client.conversations.users
                .create({identity: args.userInput.mobileNumber,friendlyName:args.userInput.name})
                .then(newUser => {
                            const user = new User({
                                name: args.userInput.name,
                                email: args.userInput.email,
                                mobileNumber: args.userInput.mobileNumber,
                                password: pass,
                                chat:null,
                                chatID:args.userInput.mobileNumber,
                                role:'user',
                                startedChat:false
                            })
                            return user.save().then(result => {
                                const token =  jwt.sign({userId:result._id, mobileNumber:user.mobileNumber}, process.env.SECRET_KEY, {expiresIn:'1y'})
                                return { token:token, user:user}
                         });

                        })  .catch(err => {
                            console.log(err);
                            throw err;
                        });

                      

                        
                 } ).catch(err => {
                    console.log(err);
                    throw err;
                });
                
            }
        }).catch(err=>{
            console.log(err);
            throw err;
        })
    
       
    },



    createData: args=>{
        const data = new Data({
            data: args.userInput.data,
            user: '$2a$12$0alMltuILa9rkyYx1dbsoerRqXeWNa.FaT5.u/SfqIITn.8NRYhEO'
        })
        return data.save().then(result => {
            User.findById('$2a$12$0alMltuILa9rkyYx1dbsoerRqXeWNa.FaT5.u/SfqIITn.8NRYhEO').then(user=>{
                user.data.push(result.id);
                return user.save();
            })
            return { ...result._doc };
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },

    login: async ({ mobileNumber, password }) => {
        const user = await User.findOne({ mobileNumber: mobileNumber })
        if (!user) {
            throw new Error('User does not exist!')
        }
        const isEqual= await bcrypt.compare(password, user.password);
        if(!isEqual){
            throw new Error('Password is incorrect!')
        }
        const token =  jwt.sign({userId:user._id, mobileNumber:user.mobileNumber}, process.env.SECRET_KEY, {expiresIn:'1h'})
        // const refreshToken = jwt.sign({userId:user._id}, Constant.ACCESS_TOKEN_SECRET, { expiresIn: '1y' });
        return { token:token, user:user}
    },

    loginWithFacebook:  async ({ token }) => {
        return axios.get(`https://graph.facebook.com/v2.8/me?fields=id,name,email&access_token=${token}`).then(function (response) {
            var facebook_id = response.data.id;
            var name = response.data.name;
            var email = response.data.email;
            return User.findOne({socialID:facebook_id}).then(user=>{
                if(user){
                    const token =  jwt.sign({userId:user._id, mobileNumber:user.socialID}, process.env.SECRET_KEY, {expiresIn:'1h'})

                    return { token:token, user:user}

                }else{
                    return client.conversations.users
                    .create({identity: facebook_id,friendlyName:name})
                    .then(newUser => {
                    var password = nanoid(20)
                    const userx = new User({
                        name: name,
                        email: email,
                        // mobileNumber: 'x',
                        socialID: facebook_id,
                        socialType:'facebook',
                        password: password,
                        chat:null,
                        chatID:facebook_id,
                        role:'user',
                        startedChat:false
                    })
                    return userx.save().then(result => {
                        const token =  jwt.sign({userId:result._id, socialID:facebook_id}, process.env.SECRET_KEY, {expiresIn:'1y'})
               
                        return { token:token, user:userx}
                 });
                }) .catch(err=>{
                    console.log(err);
                    throw err;
                    
           
                
          
        })
            }
        }).catch(err=>{
            console.log(err);
            throw err;
        })
    
    })
    },

    // validateToken: async ({ token }) => {
    //     const user = await User.findOne({ email: email })
    //     if (!user) {
    //         throw new Error('User does not exist!')
    //     }
    //     var verification = jwt.verify(token, process.env.SECRET_KEY);
    //     console.log(verification)
    //     return { };

    // },

    // forgetPassword: args=>{
    //     const user = await User.findOne({ mobileNumber: args.mobileNumber })
    //     if (!user) {
    //         throw new Error('User does not exist!')
    //     }

        
    //     return { };

    // }

  
}