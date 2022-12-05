import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { listProductDetails } from '../actions/productActions'

const ProductEditScreen = () => {
    const params = useParams()
    const productId = params.id

    const [price, setPrice] = useState(0);
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productDetails = useSelector(state => state.productDetails) 
    const { loading, error, product } = productDetails; 

    useEffect(() => {
      if(!product.name || product._id !== productId){
        console.log(product, productId)
        dispatch(listProductDetails(productId))
      }else{
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }, [dispatch, productId, product])

    const submitHandler = (e) => {
      e.preventDefault() // nor refresh
      
    }

  return (
    <>
        <Link to='/admin/productList' className='btn btn-light my-3'>Go Back</Link>
        <FormContainer>
      <h1>Edit Product</h1>
      {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='my-3'>
                <Form.Label>Name</Form.Label>
                <Form.Control type='name' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='price' className='my-3'>
                <Form.Label>Price</Form.Label>
                <Form.Control type='number' placeholder='Enter Price' value={price} onChange={(e) => setPrice(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='image' className='my-3'>
                <Form.Label>Image</Form.Label>
                <Form.Control type='text' placeholder='Enter Image URL' value={image} onChange={(e) => setImage(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='brand' className='my-3'>
                <Form.Label>Brand</Form.Label>
                <Form.Control type='text' placeholder='Enter Brand' value={brand} onChange={(e) => setBrand(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='countInStock' className='my-3'>
                <Form.Label>Count In Stcock</Form.Label>
                <Form.Control type='number' placeholder='Enter Count In Stock' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='category' className='my-3'>
                <Form.Label>Category</Form.Label>
                <Form.Control type='text' placeholder='Enter Category' value={category} onChange={(e) => setCategory(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='description' className='my-3'>
                <Form.Label>Description</Form.Label>
                <Form.Control type='text' placeholder='Enter Description' value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
            </Form.Group>

            <Button className='my-3' type='submit' variant='primary'>
                Update
            </Button>
        </Form>
      )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen
