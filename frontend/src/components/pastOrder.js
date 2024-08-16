import React from 'react';
import { Button, Row, Col, Container } from 'react-bootstrap';
import './pastOrder.css'

class PastOrder extends React.Component {
  render() {
    const { pastOrders, onRemovePastOrder } = this.props;
    const sortedOrders = pastOrders.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
      <Container>
        <h2>Past Orders</h2>
        {sortedOrders.map(order => {
          const items = Array.isArray(order.items) ? order.items : [];
          const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
          return (
            <div className="past_div" key={order.id}>
              <h3>Order ID: {order.id}</h3>
              <Row>
                <Col>
                  {items.map(item => (
                    <Row key={item.id}>
                      <Col>{item.name}</Col>
                      <Col>{item.price}</Col>
                      <Col>Quantity: {item.quantity}</Col>
                    </Row>
                  ))}
                </Col>
                <Col>
                  <Button variant="danger" className="past_button" onClick={() => onRemovePastOrder(order.id)}>Remove</Button>
                </Col>

              </Row>
              <Row>
                <Col className="font-weight-bold total-amount">Total Price: ${totalAmount.toFixed(2)}</Col>
              </Row>
          
            </div>
          );
        })}
      </Container>
    );
  }
}

export default PastOrder;


