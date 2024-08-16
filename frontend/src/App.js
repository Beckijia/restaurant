import React, { Component } from 'react';
import NavbarComponent from './components/navbar';
import Menu from './components/menu';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cart from './components/cart';
import PastOrder from './components/pastOrder';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      pastOrders: []
    };

    this.handleAddCart = this.handleAddCart.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleOrder = this.handleOrder.bind(this);
    this.handleRemovePastOrder = this.handleRemovePastOrder.bind(this);
    this.fetchPastOrders = this.fetchPastOrders.bind(this);
    this.fetchCartItems = this.fetchCartItems.bind(this);
  }

  componentDidMount() {
    this.fetchPastOrders();
    this.fetchCartItems();

  
  }

  fetchPastOrders() {
    fetch('http://localhost:8080/pastorders')
      .then(response => response.json())
      .then(data => this.setState({ pastOrders: data }))
      .catch(error => console.error('Error fetching past orders: ', error));
  }

  
  fetchCartItems() {
    fetch('http://localhost:8080/cart')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => this.setState({ cart: data }))
      .catch(error => console.error('Error fetching cart items:', error));
  }


 //Set up updateCartOnServer function to avoid dupication code in the following events.
  updateCartOnServer(updatedCart) {
    fetch('http://localhost:8080/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedCart)
    })
    .catch(error => console.error('Error updating cart on server:', error));
  }

  handleAddCart(item) {
    this.setState(prevState => {
      const cartItem = prevState.cart.find(cartItem => cartItem.id === item.id);
      let updatedCart;
  
      if (cartItem) {
        // Update the quantity of the existing item
        updatedCart = prevState.cart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        // Add a new item to the cart
        updatedCart = [...prevState.cart, { ...item, quantity: 1 }];
      }
  
      this.updateCartOnServer(updatedCart);
      return { cart: updatedCart };
    })

  }

  handleIncrement(itemId) {
    this.setState(prevState => {
      const updatedCart = prevState.cart.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      );
  
    this.updateCartOnServer(updatedCart);
    return { cart: updatedCart };
    });    
  }

  handleDecrement(itemId) {
    this.setState(prevState => {
      const updatedCart = prevState.cart.map(item =>
        item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      );
  
      // Persist the updated cart to the backend
      this.updateCartOnServer(updatedCart);
      return { cart: updatedCart };
    }) 
  }

  handleRemove(itemId) {
    this.setState(prevState => {
      const updatedCart = prevState.cart.filter(item => item.id !== itemId);
  
      // Persist the updated cart to the backend
      this.updateCartOnServer(updatedCart);
      return { cart: updatedCart };
    });
  }

  handleOrder() {
    
    fetch('http://localhost:8080/order', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: this.state.cart })
    })
      .then(response => {
        console.log("Processing the order part");
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        this.setState({ cart: [] });
        this.fetchPastOrders();
        alert("Order successfully!");
      })
      .catch(error => console.error('Error storing order: ', error));
  }

  handleRemovePastOrder(orderID) {
    fetch(`http://localhost:8080/pastorders/${orderID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        this.fetchPastOrders();
      })
      .catch(error => console.error('Error removing past order:', error));
    }
    
  render() {
    return (
      <>
        <Router>
          <Container fluid className="container-style">
            <Row>
              <Col xs={12}>
                <NavbarComponent />
                <Routes>
                  <Route path="/" element={<Menu onAddCart={this.handleAddCart} />} />
                  <Route path="/cart" element={
                    <Cart
                      cartItems={this.state.cart}
                      onIncrement={this.handleIncrement}
                      onDecrement={this.handleDecrement}
                      onRemove={this.handleRemove}
                      onOrder={this.handleOrder}
                    />
                  } />
                  <Route path="/pastorder" element={
                    <PastOrder
                      pastOrders={this.state.pastOrders}
                      onRemovePastOrder={this.handleRemovePastOrder}
                    />
                  } />
                </Routes>
              </Col>
            </Row>
          </Container>
        </Router>
      </>
    );
  }
}

export default App;
