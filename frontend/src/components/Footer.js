import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
            {/* py-3 means padding=3 in y axis */}
            <Col className='text-center py-3'>
                Copyright &copy; HappyShop
            </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
