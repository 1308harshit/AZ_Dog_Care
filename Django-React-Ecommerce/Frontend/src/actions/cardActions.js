// import {
//     CARD_CREATE_REQUEST,
//     CARD_CREATE_SUCCESS,
//     CARD_CREATE_FAIL,

//     CHARGE_CARD_REQUEST,
//     CHARGE_CARD_SUCCESS,
//     CHARGE_CARD_FAIL,

//     SAVED_CARDS_LIST_REQUEST,
//     SAVED_CARDS_LIST_SUCCESS,
//     SAVED_CARDS_LIST_FAIL,

//     DELETE_SAVED_CARD_REQUEST,
//     DELETE_SAVED_CARD_SUCCESS,
//     DELETE_SAVED_CARD_FAIL,

//     UPDATE_STRIPE_CARD_REQUEST,
//     UPDATE_STRIPE_CARD_SUCCESS,
//     UPDATE_STRIPE_CARD_FAIL,

// } from '../constants/index'

// import axios from 'axios'

// // create card
// export const createCard = (cardData) => async (dispatch, getState) => {

//     try {

//         dispatch({
//             type: CARD_CREATE_REQUEST
//         })

//         const {
//             userLoginReducer: { userInfo },
//         } = getState()

//         const config = {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${userInfo.token}`,
//                 "Card-Number": cardData.cardNumber,
//             }
//         }

//         // api call
//         const { data } = await axios.post(
//             "/payments/create-card/",
//             {
//                 'email': cardData.email,
//                 'number': cardData.cardNumber,
//                 'exp_month': cardData.expMonth,
//                 'exp_year': cardData.expYear,
//                 'cvc': cardData.cvc,
//                 'save_card': cardData.saveCard
//             },
//             config
//         )

//         dispatch({
//             type: CARD_CREATE_SUCCESS,
//             payload: data
//         })

//     } catch (error) {
//         dispatch({
//             type: CARD_CREATE_FAIL,
//             payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
//         })
//     }
// }


// // charge customer
// export const chargeCustomer = (cardData) => async (dispatch, getState) => {

//     try {

//         dispatch({
//             type: CHARGE_CARD_REQUEST
//         })

//         const {
//             userLoginReducer: { userInfo },
//         } = getState()

//         const config = {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${userInfo.token}`
//             }
//         }

//         // api call
//         const { data } = await axios.post(
//             "/payments/charge-customer/",
//             cardData,
//             config
//         )

//         dispatch({
//             type: CHARGE_CARD_SUCCESS,
//             payload: data
//         })

//     } catch (error) {
//         dispatch({
//             type: CHARGE_CARD_FAIL,
//             payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
//         })
//     }
// }


// // saved cards list
// export const savedCardsList = () => async (dispatch, getState) => {

//     try {
//         dispatch({
//             type: SAVED_CARDS_LIST_REQUEST,
//         })

//         const {
//             userLoginReducer: { userInfo }
//         } = getState()

//         const config = {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${userInfo.token}`
//             }
//         }

//         // api call
//         const { data } = await axios.get('/account/stripe-cards/', config)

//         dispatch({
//             type: SAVED_CARDS_LIST_SUCCESS,
//             payload: data
//         })

//     } catch (error) {
//         dispatch({
//             type: SAVED_CARDS_LIST_FAIL,
//             payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
//         })
//     }
// }


// // update stripe card
// export const updateStripeCard = (cardData) => async (dispatch, getState) => {

//     try {

//         dispatch({
//             type: UPDATE_STRIPE_CARD_REQUEST
//         })

//         const {
//             userLoginReducer: { userInfo },
//         } = getState()

//         const config = {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${userInfo.token}`
//             }
//         }

//         // api call
//         const { data } = await axios.post(
//             "/payments/update-card/",
//             cardData,
//             config
//         )

//         dispatch({
//             type: UPDATE_STRIPE_CARD_SUCCESS,
//             payload: data
//         })

//     } catch (error) {
//         dispatch({
//             type: UPDATE_STRIPE_CARD_FAIL,
//             payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
//         })
//     }
// }



// // delete saved card
// export const deleteSavedCard = (card_number) => async (dispatch, getState) => {

//     try {
//         dispatch({
//             type: DELETE_SAVED_CARD_REQUEST,
//         })

//         const {
//             userLoginReducer: { userInfo }
//         } = getState()

//         const config = {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${userInfo.token}`
//             }
//         }

//         // api call
//         const { data } = await axios.post(
//             '/payments/delete-card/',
//             { "card_number": card_number },
//             config
//         )

//         dispatch({
//             type: DELETE_SAVED_CARD_SUCCESS,
//             payload: data
//         })

//     } catch (error) {
//         dispatch({
//             type: DELETE_SAVED_CARD_FAIL,
//             payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
//         })
//     }
// }

// Import action types and axios library for making HTTP requests
import {
    CARD_CREATE_REQUEST,
    CARD_CREATE_SUCCESS,
    CARD_CREATE_FAIL,

    CHARGE_CARD_REQUEST,
    CHARGE_CARD_SUCCESS,
    CHARGE_CARD_FAIL,

    SAVED_CARDS_LIST_REQUEST,
    SAVED_CARDS_LIST_SUCCESS,
    SAVED_CARDS_LIST_FAIL,

    DELETE_SAVED_CARD_REQUEST,
    DELETE_SAVED_CARD_SUCCESS,
    DELETE_SAVED_CARD_FAIL,

    UPDATE_STRIPE_CARD_REQUEST,
    UPDATE_STRIPE_CARD_SUCCESS,
    UPDATE_STRIPE_CARD_FAIL,

} from '../constants/index'

import axios from 'axios'

// Action to create a new card
export const createCard = (cardData) => async (dispatch, getState) => {
    try {
        // Dispatch request action to indicate the start of the API call
        dispatch({ type: CARD_CREATE_REQUEST })

        // Get user information from the Redux state
        const { userLoginReducer: { userInfo } } = getState()

        // Configuration for the request headers, including authentication token
        const config = {
            headers: {
                "Content-Type": "application/json",  // Set content type to JSON
                Authorization: `Bearer ${userInfo.token}`,  // Include JWT token for authentication
                "Card-Number": cardData.cardNumber,  // Additional header for card number
            }
        }

        // Make the API call to create a new card
        const { data } = await axios.post(
            "/payments/create-card/",  // Endpoint to create a card
            {
                'email': cardData.email,
                'number': cardData.cardNumber,
                'exp_month': cardData.expMonth,
                'exp_year': cardData.expYear,
                'cvc': cardData.cvc,
                'save_card': cardData.saveCard
            },
            config
        )

        // Dispatch success action with the response data
        dispatch({
            type: CARD_CREATE_SUCCESS,
            payload: data
        })

    } catch (error) {
        // Dispatch failure action with error details
        dispatch({
            type: CARD_CREATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
}

// Action to charge the customer
export const chargeCustomer = (cardData) => async (dispatch, getState) => {
    try {
        // Dispatch request action to indicate the start of the API call
        dispatch({ type: CHARGE_CARD_REQUEST })

        // Get user information from the Redux state
        const { userLoginReducer: { userInfo } } = getState()

        // Configuration for the request headers, including authentication token
        const config = {
            headers: {
                "Content-Type": "application/json",  // Set content type to JSON
                Authorization: `Bearer ${userInfo.token}`  // Include JWT token for authentication
            }
        }

        // Make the API call to charge the customer
        const { data } = await axios.post(
            "/payments/charge-customer/",  // Endpoint to charge the customer
            cardData,  // Data including card details and amount
            config
        )

        // Dispatch success action with the response data
        dispatch({
            type: CHARGE_CARD_SUCCESS,
            payload: data
        })

    } catch (error) {
        // Dispatch failure action with error details
        dispatch({
            type: CHARGE_CARD_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
}

// Action to get a list of saved cards
export const savedCardsList = () => async (dispatch, getState) => {
    try {
        // Dispatch request action to indicate the start of the API call
        dispatch({ type: SAVED_CARDS_LIST_REQUEST })

        // Get user information from the Redux state
        const { userLoginReducer: { userInfo } } = getState()

        // Configuration for the request headers, including authentication token
        const config = {
            headers: {
                "Content-Type": "application/json",  // Set content type to JSON
                Authorization: `Bearer ${userInfo.token}`  // Include JWT token for authentication
            }
        }

        // Make the API call to get the list of saved cards
        const { data } = await axios.get('/account/stripe-cards/', config)

        // Dispatch success action with the response data
        dispatch({
            type: SAVED_CARDS_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        // Dispatch failure action with error details
        dispatch({
            type: SAVED_CARDS_LIST_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
}

// Action to update a saved Stripe card
export const updateStripeCard = (cardData) => async (dispatch, getState) => {
    try {
        // Dispatch request action to indicate the start of the API call
        dispatch({ type: UPDATE_STRIPE_CARD_REQUEST })

        // Get user information from the Redux state
        const { userLoginReducer: { userInfo } } = getState()

        // Configuration for the request headers, including authentication token
        const config = {
            headers: {
                "Content-Type": "application/json",  // Set content type to JSON
                Authorization: `Bearer ${userInfo.token}`  // Include JWT token for authentication
            }
        }

        // Make the API call to update the card details
        const { data } = await axios.post(
            "/payments/update-card/",  // Endpoint to update a card
            cardData,  // Data including updated card details
            config
        )

        // Dispatch success action with the response data
        dispatch({
            type: UPDATE_STRIPE_CARD_SUCCESS,
            payload: data
        })

    } catch (error) {
        // Dispatch failure action with error details
        dispatch({
            type: UPDATE_STRIPE_CARD_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
}

// Action to delete a saved card
export const deleteSavedCard = (card_number) => async (dispatch, getState) => {
    try {
        // Dispatch request action to indicate the start of the API call
        dispatch({ type: DELETE_SAVED_CARD_REQUEST })

        // Get user information from the Redux state
        const { userLoginReducer: { userInfo } } = getState()

        // Configuration for the request headers, including authentication token
        const config = {
            headers: {
                "Content-Type": "application/json",  // Set content type to JSON
                Authorization: `Bearer ${userInfo.token}`  // Include JWT token for authentication
            }
        }

        // Make the API call to delete a saved card
        const { data } = await axios.post(
            '/payments/delete-card/',  // Endpoint to delete a card
            { "card_number": card_number },  // Data with the card number to delete
            config
        )

        // Dispatch success action with the response data
        dispatch({
            type: DELETE_SAVED_CARD_SUCCESS,
            payload: data
        })

    } catch (error) {
        // Dispatch failure action with error details
        dispatch({
            type: DELETE_SAVED_CARD_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
}
