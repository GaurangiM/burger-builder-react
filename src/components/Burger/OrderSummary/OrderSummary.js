import React, { Component } from 'react'

import Button from '../../UI/Button/Button'
import Aux from '../../../hoc/Aux'
class OrderSummary extends Component {
    //This can be a functional component, doesnt have to be a class based one
    componentDidUpdate() {
        console.log('OrderSummary update');
    }

    render() {
        const ingredientSummary= Object.keys(this.props.ingredients)
            .map(igKey=> {
                return <li key={igKey}>
                    <span>{igKey}</span>: {this.props.ingredients[igKey]}</li>
            })
        return(
            <Aux>
            <h3>Order Summary</h3>
            <p>Your delicious burger consists of:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
            <p>Continue to checkout ?</p>
            <Button btnType='Danger' clicked={this.props.purchaseCancelled}>CANCEL</Button>
            <Button btnType='Success' clicked={this.props.purchaseContinued}>CONTINUE</Button>
        </Aux>
        )
    }
}

export default OrderSummary;