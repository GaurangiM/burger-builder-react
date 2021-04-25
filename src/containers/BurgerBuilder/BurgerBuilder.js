import React, {Component} from 'react'
import Aux from '../../hoc/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/WithErrorHandler'
const INGREDIENT_PRICES= {
    salad: 0.5,
    cheese: 0.45,
    meat: 1.5,
    bacon: 1.2
};
class BurgerBuilder extends Component {

    state= {
        ingredients: null,
        totalPrice: 3.5,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    cancelPurchaseHandler= ()=> {
        this.setState({purchasing: false});
    }

    continuePurchaseHandler= ()=> {
        //alert("You want burger");
        this.setState({loading: true});
        const order= {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Momo',
                address: {
                    street: 'Teststreet',
                    zipCode: '45678',
                    country: 'NL'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        };
        axios.post('/orders.json', order)
            .then(response=> {
                this.setState({loading: false, purchasing: false})
                console.log(response);
            })
    }

    componentDidMount() {
        axios.get('https://my-burger-a2cee-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json')
            .then(response=> {
                this.setState({ingredients: response.data})
            })
            .catch(error=> {
                this.setState({error: true})
            })
    }

    purchaseHandler= ()=> {
        this.setState({purchasing:true});
    }

    updatePurchaseState(ingredients) {
        const sum= Object.keys(ingredients)
                .map(igKey=> {
                    return ingredients[igKey];
                }).reduce((sum, el)=> {
                    return sum + el;
                }, 0)

        this.setState({purchasable: sum > 0});
    }

    addIngredientHandler= (type)=> {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler= (type)=> {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0)
            return;

        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
        this.updatePurchaseState(updatedIngredients);
    }

    render() {
        const disabledInfo= {
            ...this.state.ingredients
        };
        for(let key in disabledInfo) {
            disabledInfo[key]= disabledInfo[key] <=0;
        }
        let orderSummary= null;
        
        let burger= this.state.error?<p>Ingredients can't be loaded!</p>:<Spinner />
        if(this.state.ingredients) {
            burger= (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                    ingredientAdded= {this.addIngredientHandler}
                    ingredientRemoved= {this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchasable={this.state.purchasable} 
                    ordered={this.purchaseHandler}/>
                </Aux>
            );
            orderSummary= <OrderSummary 
                            price={this.state.totalPrice}
                            ingredients={this.state.ingredients}
                            purchaseCancelled={this.cancelPurchaseHandler}
                            purchaseContinued={this.continuePurchaseHandler}/>
        }
        if(this.state.loading) {
            orderSummary= <Spinner/>
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.cancelPurchaseHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

export default withErrorHandler(BurgerBuilder, axios);