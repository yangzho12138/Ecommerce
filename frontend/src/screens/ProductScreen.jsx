import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button} from 'react-bootstrap'
import Rating from '../components/Rating'
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails } from '../actions/productActions'; // action
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductScreen = () => {
    const dispatch = useDispatch();
    const params = useParams();

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails;

    useEffect(() => {
        // const fetchProduct = async () => {
        //     const { data } = await axios.get(`/api/products/${params.id}`);
        //     setProduct(data);
        // };
        // fetchProduct();

        dispatch(listProductDetails(params.id));
    }, [dispatch]);

  return (
    <>
      <Link className='btn btn-light my-3' to="/">Go Back</Link>
      {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>:
      <Row>
      <Col md={6}>
          <Image src={product.image} alt={product.name} fluid></Image>
      </Col>
      <Col md={3}>
          <ListGroup variant='flush'>
              <ListGroup.Item>
                  <h2>{product.name}</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                  <Rating value={product.rating} text={`${product.numReviews} reviews`} />
              </ListGroup.Item>
              <ListGroup.Item>
                  Price: ${product.price}
              </ListGroup.Item>
              <ListGroup.Item>
                  Description: {product.description}
              </ListGroup.Item>
          </ListGroup>
      </Col>
      <Col md={3}>
          <Card>
              <ListGroup variant='flush'>
                  <ListGroup.Item>
                      <Row>
                          <Col>
                              Price:
                          </Col>
                          <Col>
                              <strong>${product.price}</strong>
                          </Col>
                      </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                      <Row>
                          <Col>
                              Status:
                          </Col>
                          <Col>
                             {product.countInStock > 0 ? 'In Stock' : 'Out Of Stack'}
                          </Col>
                      </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                      <Row>
                          <Button className='btn-block' type='button' disabled = {product.countInStock === 0}>
                              Add to Cart
                          </Button>
                      </Row>
                  </ListGroup.Item>
              </ListGroup>
          </Card>
      </Col>
    </Row>
      }
    </>
  )
}

export default ProductScreen
