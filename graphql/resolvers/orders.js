require('dotenv').config();
const musementUrl = process.env.MUSEMENT_BASE_URL;
const musement_client_id = process.env.MUSEMENT_CLIENT_ID;
const musement_client_secret = process.env.MUSEMENT_CLIENT_SECRET;
const StripeAPIKey = process.env.STRIPE_API_KEY;
const stripe = require('stripe')(StripeAPIKey);
const axios = require('axios');

module.exports={
    makeOrder: (args,req) => {
        if(!resizeBy.isAuth){
            return { message:"Not authenticated."}

        }
        return axios.get(`${musementUrl}login?client_id=${musement_client_id}&client_secret=${musement_client_secret}&grant_type=client_credentials`).then(function (response) { 
        let token=response.data.access_token

        return axios.post(`${musementUrl}carts`,{headers: {'Authorization': "Bearer " + token,"X-Musement-Currency":"USD"}}).then(function (response) {
            let cartID=response.data.uuid
            return axios.post(`${musementUrl}carts/${cartID}`,{headers: {'Authorization': "Bearer " + token,"X-Musement-Currency":"USD"}}).then(function (response) {
              
                return axios.patch(`${musementUrl}carts/${cartID}`,args.data.user,{headers: {'Authorization': "Bearer " + token,"X-Musement-Currency":"USD"}}).then(function (response) {


                    stripe.createToken(cardElement).then(function(result) {
                        // Handle result.error or result.token
                      });

                })
                .catch(function (error) {
                    console.log(error.response)
                    console.log(error)
                })

            })
            .catch(function (error) {
                console.log(error.response)
                console.log(error)
            })

    }).catch(function (error) {
        console.log(error.response)
        console.log(error)
    })
}).catch(function (error) {
    console.log(error.response)
    console.log(error)
})
}

}
