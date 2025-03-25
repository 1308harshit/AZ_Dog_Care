// import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { Spinner, Form, Button, Card } from 'react-bootstrap'
// import { chargeCustomer } from '../actions/cardActions'
// import { Link, useHistory } from "react-router-dom";
// import { getSingleAddress } from '../actions/userActions'
// import Message from './Message'


// const ChargeCardComponent = ({ product, match, selectedAddressId, addressSelected }) => {

//     let history = useHistory()
//     const dispatch = useDispatch()

//     // create card reducer
//     const createCardReducer = useSelector(state => state.createCardReducer)
//     const { cardData } = createCardReducer

//     // charge card reducer
//     const chargeCardReducer = useSelector(state => state.chargeCardReducer)
//     const { success: chargeSuccessfull, error: chargeError, loading: chargingStatus } = chargeCardReducer

//     // get single address reducer    
//     const getSingleAddressReducer = useSelector(state => state.getSingleAddressReducer)
//     const { address } = getSingleAddressReducer

//     useEffect(() => {
//         dispatch(getSingleAddress(selectedAddressId))
//     }, [dispatch, match, selectedAddressId])

//     // charge card handler
//     const onSubmit = (e) => {
//         e.preventDefault()
//         const address_detail = `${address.house_no}, near ${address.landmark}, ${address.city}, 
//         ${address.state}, ${address.pin_code}`
//         const data = {
//             "email": cardData.email,
//             "source": cardData.id,
//             "amount": product.price,
//             "name": address.name,
//             "card_number": cardData.card_data.last4,
//             "address": address_detail,
//             "ordered_item": product.name,
//             "paid_status": true,
//             "total_price": product.price,
//             "is_delivered": false,
//             "delivered_at": "Not Delivered",
//         }
//         dispatch(chargeCustomer(data))
//     }

//     if (chargeSuccessfull) {
//         history.push({
//             pathname: '/payment-status/',
//             state: { detail: product }
//         })
//         window.location.reload()
//     }

//     return (
//         <div>
//             {chargeError ? <Message variant="danger">{chargeError}</Message> : ""}
//             <span className="text-info">
//                 <h5>Confirm payment</h5>
//             </span>
//             <div className="mb-2">
//                 Using Card: XXXX XXXX XXXX {cardData.card_data.last4}
//             </div>
//             <Form onSubmit={onSubmit}>

//                 {chargingStatus ?
//                     <Button variant="primary" disabled style={{ width: "100%" }}>
//                         <Spinner
//                             as="span"
//                             animation="grow"
//                             size="sm"
//                             role="status"
//                             aria-hidden="true"
//                         />
//                         {" "}Processing Payment...
//                     </Button>
//                     :
//                     <Button variant="primary" type="submit" style={{ width: "100%" }}>
//                         Pay ₹{product.price}
//                     </Button>
//                 }
//             </Form>

//             <Card
//                 className="p-2 mt-2 mb-2"
//                 style={{ border: "1px solid", borderColor: "#C6ACE7" }}
//             >
//                 {address ?
//                     <div>
//                         <span className="text-info">
//                             <b><em>Will be delievered at this address</em></b>
//                         </span>
//                         <p></p>
//                         <p><b>Name: </b>{address ? address.name : ""}</p>
//                         <p><b>Phone Number: </b>{address ? address.phone_number : ""}</p>
//                         <p><b>House Number: </b>{address ? address.house_no : ""}</p>
//                         <p><b>Landmark: </b>{address ? address.landmark : ""}</p>
//                         <p><b>City: </b>{address ? address.city : ""}</p>
//                         <p><b>State: </b>{address ? address.state : ""}</p>
//                         <p><b>Pin Code/Zip Code: </b>{address ? address.pin_code : ""}</p>
//                     </div>
//                     :
//                     ""
//                 }
//             </Card>
//             <Link to="#" onClick={() => window.location.reload()}>Select a different card to pay</Link>

//         </div >
//     )
// }

// export default ChargeCardComponent


// ---------------------------------------------

import React, { useEffect } from 'react' 
import { useDispatch, useSelector } from 'react-redux' // Redux hooks to dispatch actions and select state
import { Spinner, Form, Button, Card } from 'react-bootstrap' // Bootstrap components for UI
import { chargeCustomer } from '../actions/cardActions' // Action for charging the customer's card
import { Link, useHistory } from "react-router-dom"; // Link for navigation and useHistory for route redirection
import { getSingleAddress } from '../actions/userActions' // Action to get the user's single address by ID
import Message from './Message' // Custom component for displaying error/success messages

/**
 * ChargeCardComponent: Component to handle card payment, retrieve the user address, and 
 * display the payment form with the option to select another card.
 * 
 * @param {Object} product - Product details passed as a prop (name, price, etc.)
 * @param {Object} match - Object from React Router (contains route params)
 * @param {string} selectedAddressId - ID of the selected address for delivery
 * @param {boolean} addressSelected - Flag to indicate if an address has been selected
 */
const ChargeCardComponent = ({ product, match, selectedAddressId, addressSelected }) => {

    let history = useHistory() // Hook for programmatic navigation (redirecting users)
    const dispatch = useDispatch() // Hook to dispatch Redux actions

    // Selector to get the card data from Redux store (previously created card)
    const createCardReducer = useSelector(state => state.createCardReducer)
    const { cardData } = createCardReducer // Destructure to get cardData object

    // Selector to get charge card status, error, and loading state from Redux store
    const chargeCardReducer = useSelector(state => state.chargeCardReducer)
    const { success: chargeSuccessfull, error: chargeError, loading: chargingStatus } = chargeCardReducer

    // Selector to get the address details from Redux store
    const getSingleAddressReducer = useSelector(state => state.getSingleAddressReducer)
    const { address } = getSingleAddressReducer // Destructure to get address object

    /**
     * useEffect hook: Fetches the selected address when the component mounts or when 
     * the selected address ID changes. This ensures the correct address is always loaded.
     */
    useEffect(() => {
        dispatch(getSingleAddress(selectedAddressId)) // Dispatch action to get address by selectedAddressId
    }, [dispatch, match, selectedAddressId]) // Dependencies for useEffect (dispatch and selectedAddressId)

    /**
     * onSubmit: Event handler for form submission to process the payment.
     * Gathers required data and dispatches the action to charge the customer's card.
     * 
     * @param {Event} e - Form submit event
     */
    const onSubmit = (e) => {
        e.preventDefault() // Prevents the default form submission (page reload)

        // Format the selected address details into a single string
        const address_detail = `${address.house_no}, near ${address.landmark}, ${address.city}, 
        ${address.state}, ${address.pin_code}`
        
        // Data object containing payment and delivery information to be sent to the backend
        const data = {
            "email": cardData.email, // Email from the card data
            "source": cardData.id, // Unique card ID (source for the charge)
            "amount": product.price, // Product price (amount to charge)
            "name": address.name, // Name from the address
            "card_number": cardData.card_data.last4, // Last 4 digits of the card number
            "address": address_detail, // Full address as a string
            "ordered_item": product.name, // Name of the product being purchased
            "paid_status": true, // Payment status (set as true once charged)
            "total_price": product.price, // Total price of the product
            "is_delivered": false, // Delivery status (initially not delivered)
            "delivered_at": "Not Delivered", // Delivery date (set as "Not Delivered" for now)
        }

        // Dispatch the chargeCustomer action to initiate the payment process
        dispatch(chargeCustomer(data))
    }

    /**
     * If the payment is successful, redirect the user to the payment status page
     * and reload the page to refresh the current state.
     */
    if (chargeSuccessfull) {
        history.push({
            pathname: '/payment-status/', // Route to navigate to
            state: { detail: product } // Pass product details in the navigation state
        })
        window.location.reload() // Reload the page after redirect
    }

    return (
        <div>
            {/* Display an error message if the payment fails */}
            {chargeError ? <Message variant="danger">{chargeError}</Message> : ""}
            
            {/* Payment confirmation title */}
            <span className="text-info">
                <h5>Confirm payment</h5>
            </span>

            {/* Display the last 4 digits of the card being used */}
            <div className="mb-2">
                Using Card: XXXX XXXX XXXX {cardData.card_data.last4}
            </div>

            {/* Payment form */}
            <Form onSubmit={onSubmit}> 
                {/* If the payment is in progress, show a loading spinner and disable the button */}
                {chargingStatus ?
                    <Button variant="primary" disabled style={{ width: "100%" }}>
                        <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        {" "}Processing Payment... {/* Loading text */}
                    </Button>
                    :
                    // If not loading, show the "Pay" button with the product price
                    <Button variant="primary" type="submit" style={{ width: "100%" }}>
                        Pay ₹{product.price} {/* Button text showing product price */}
                    </Button>
                }
            </Form>

            {/* Card component to display the selected delivery address */}
            <Card
                className="p-2 mt-2 mb-2"
                style={{ border: "1px solid", borderColor: "#C6ACE7" }}
            >
                {/* Conditionally render the address details if the address object is available */}
                {address ?
                    <div>
                        <span className="text-info">
                            <b><em>Will be delivered at this address</em></b>
                        </span>
                        <p></p>
                        <p><b>Name: </b>{address ? address.name : ""}</p> {/* Display address name */}
                        <p><b>Phone Number: </b>{address ? address.phone_number : ""}</p> {/* Display phone number */}
                        <p><b>House Number: </b>{address ? address.house_no : ""}</p> {/* Display house number */}
                        <p><b>Landmark: </b>{address ? address.landmark : ""}</p> {/* Display landmark */}
                        <p><b>City: </b>{address ? address.city : ""}</p> {/* Display city */}
                        <p><b>State: </b>{address ? address.state : ""}</p> {/* Display state */}
                        <p><b>Pin Code/Zip Code: </b>{address ? address.pin_code : ""}</p> {/* Display postal code */}
                    </div>
                    :
                    "" /* If address is null, show nothing */
                }
            </Card>

            {/* Link to select a different card, triggers page reload */}
            <Link to="#" onClick={() => window.location.reload()}>
                Select a different card to pay
            </Link>
        </div>
    )
}

export default ChargeCardComponent // Export the component for use in other parts of the app

