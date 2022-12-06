import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants';

const OrderScreen = () => {
    const params = useParams()
    const orderId = params.id
    // after paypal sdk script ready, we can use paypal
    const [sdkReady, setSdkReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay // rename

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    if(!loading){
        // Keep two decimal places
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
        }
    
        // itemsPrice is not in the model --> get through calculating
        order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    }

    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
      if(!userInfo){
        navigate('/login')
      }

      const addPayPalScript = async() => {
        // must have data: the return value is a response and the id is stored in data section
        const { data: clientId } = await axios.get('/api/config/paypal')
        const script = document.createElement('script')
        script.type = 'text/javascript'
        // paypal sdk script <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script> dynamic adding paypal script to html
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
        script.async = true
        // script has been loaded
        script.onload = () => {
          setSdkReady(true)
        }
        document.body.appendChild(script)
      }
    

      // if the orderId does not match the id in URL, use dispatch to fetch the most recent order
      // if the pay is success, get order detail again
      if(!order || order._id !== orderId || successPay || successDeliver){
          // or once you pay, keep refreshing
          dispatch({ type: ORDER_PAY_RESET }) // dispatch directlt without action
          dispatch({ type: ORDER_DELIVER_RESET })
          dispatch(getOrderDetails(orderId))
      } else if(!order.isPaid){
        if(!window.paypal){ // if there is no paypal script
          addPayPalScript()
        }else{
          setSdkReady(true)
        }
      }
    }, [dispatch, navigate, userInfo, orderId, order, successPay, successDeliver])

    const successPaymentHandler = (paymentResult) => {
      dispatch(payOrder(orderId, paymentResult)) // update db to paid
    }

    const deliverHandler = () => {
      dispatch(deliverOrder(order))
    }

  return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
  <>
    <h1>Order</h1>
    <h5>(ID:{order._id})</h5>
    <Row>
        <Col md={8}>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Shipping</h2>
                    {/* populate in the backend */}
                    <p><strong>Name: </strong> {order.user.name}</p>
                    <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                    <p>
                        <strong>Address: </strong>
                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </p>
                    {order.isDelivered ? <Message variant='success'>Deliverd on {order.deliveredAt}</Message> : <Message variant='danger'>Not Delivered</Message>}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                  </p>
                  {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message> : <Message variant='danger'>Not Paid</Message>}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order.orderItems.length === 0 ? <Message>Order is empty</Message> : 
                    <ListGroup variant='flush'>
                      {order.orderItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col md={1}>
                              <Image src={item.image} alt={item.name} fluid rounded />
                            </Col>
                            <Col>
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>
                            </Col>
                            <Col md={4}>
                              {item.qty} X ${item.price} = ${item.qty * item.price}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  }
                </ListGroup.Item>
            </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? <Loader /> : 
                    <PayPalScriptProvider>
                      <PayPalButtons createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                currency_code: 'USD',
                                value: order.totalPrice,
                              },
                            },
                          ],
                        })
                      }} onApprove={function (data, actions) {
                          return actions.order.capture().then(function () {
                            const paymentResult = {
                              id: data.orderID,
                              status: 'COMPLETED',
                              update_time: Date.now(),
                              payerId: data.payerID
                            }

                            successPaymentHandler(paymentResult)
                          });
                      }}/>
                    </PayPalScriptProvider>
                  }
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item className='text-center'>
                  <Button type='button' className='btn btn-block' onClick={deliverHandler}>Mark As Delivered</Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
  </>
}

export default OrderScreen
