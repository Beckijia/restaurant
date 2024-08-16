import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import IndividualMenu from './individualMenu';


class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          menuItems: []
        };
      }

    
    componentDidMount() {
      fetch('http://localhost:8080/')
        .then(response => response.json())
        .then(data => this.setState({menuItems: data}))
        .catch(error => console.error('Error fetching menu items: ', error))
    } 

    render() {
      const{ onAddCart } = this.props;
      return (
        <Container>
          <Row >
            {this.state.menuItems.map(item => (
              <Col key={item.id} xs={12} md={6} lg={3}>
                <IndividualMenu item={ item } onAddCart = { onAddCart } />
              </Col>
            ))}
          </Row>

        </Container>
      )
    }

  } 

  export default Menu