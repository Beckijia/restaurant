import React from 'react';
import { Button, Row, Col, Container } from 'react-bootstrap';
import './Cart.css'; // Import the CSS file

class Cart extends React.Component {
  render() {
    const { cartItems, onIncrement, onDecrement, onRemove, onOrder } = this.props;
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const isCartEmpty = cartItems.length === 0;

    return (
      <Container>
        <h2>Cart</h2>
        {cartItems.map(item => (
          <Row key={item.id} className="align-items-center mb-3">
            <Col>{item.name}</Col>
            <Col>${item.price}</Col>
            <Col>
              <Button variant="secondary" className="me-2" onClick={() => onDecrement(item.id)}> - </Button>
              <span className="mx-2">{item.quantity}</span>
              <Button variant="primary" className="me-2" onClick={() => onIncrement(item.id)}> + </Button>
              <Button variant="danger" onClick={() => onRemove(item.id)}> Remove </Button>
            </Col>
          </Row>
        ))}
        <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
        <Row>
          <Col className="d-flex justify-content-start">
            <Button 
              variant="primary" 
              className="order-btn" 
              size="sm" 
              onClick={onOrder} 
              disabled={isCartEmpty}
            >
              Order Now
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Cart;
