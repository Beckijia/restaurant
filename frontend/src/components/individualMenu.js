import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';


class IndividualMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addStatus: false
    };
    this.handleAddCart = this.handleAddCart.bind(this);
  }

  handleAddCart() {
    this.props.onAddCart(this.props.item);
    this.setState({ addStatus : true });
  }
    render () {
      const { item } = this.props;
      const { addStatus } = this.state;
      
      return (
        
        <Card  style={{ width: '18rem', height: '20rem', margin: '1rem' }}>
          <Card.Img variant="top" src="" alt="" />
          <Card.Body className="d-flex flex-column justify-content-between">
            <div>
              <Card.Title>{ item.name } </Card.Title>
              <Card.Text>
                Price: ${ item.price }
              </Card.Text>
              <Card.Text>
                { item.description }
              </Card.Text>
            </div>

            <div>
              <Button 
                      variant= { addStatus ? "secondary" : "primary"}
                      onClick={this.handleAddCart}
                      disabled= {addStatus}
               >Add to Cart</Button>
            </div>

          </Card.Body>
        </Card>
      )
    }
}

export default IndividualMenu