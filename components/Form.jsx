import React, { useRef } from "react";
import { useStateContext } from '../context/StateContext';

const Form = () => {
    const cartRef = useRef();
    const { totalPrice } = useStateContext();
    return (
        <div className="form">
            <h1 className='heading'>Checkout</h1> 
            <input id='name' placeholder='Name' className='field'/><br/>
            <input id='phone_number' placeholder='Phone Number' className='field'/><br/>
            <input id='address' placeholder='Address' className='field'/><br/>
            <input id='email' placeholder='Email' className='field'/><br/>
            <p>{totalPrice}</p>
            <button
                type='button'
            />
        </div>
    )
  }

export default Form