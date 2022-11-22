import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants';

const UserEditScreen = () => {
    const params = useParams()
    const userId = params.id

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userDetails = useSelector(state => state.userDetails) 
    const { loading, error, user } = userDetails; 

    const userUpdate = useSelector(state => state.userUpdate) 
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate; 

    useEffect(() => {
      if(successUpdate){
        dispatch({ type: USER_UPDATE_RESET })
        navigate('/admin/userlist')
      }else{
        if(!user.name || user._id !== userId){
          dispatch(getUserDetails(userId))
        }else{
          setName(user.name)
          setEmail(user.email)
        }
      }
    }, [user, userId, successUpdate, navigate, dispatch])

    const submitHandler = (e) => {
      e.preventDefault() // nor refresh
      dispatch(updateUser({_id: userId, name: name, email: email, isAdmin: isAdmin}))
    }

  return (
    <>
        <Link to='/admin/userList' className='btn btn-light my-3'>Go Back</Link>
        <FormContainer>
      <h1>Edit User</h1>
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='my-3'>
                <Form.Label>Name</Form.Label>
                <Form.Control type='name' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='email' className='my-3'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
            </Form.Group>
            {!user.isAdmin ? (
                <Form.Group controlId='isAdmin' className='my-3'>
                    <Form.Check type='checkbox' label='Is Admin' checked={isAdmin}  onChange={(e) => setIsAdmin(e.target.checked)}></Form.Check>
                </Form.Group>
            ) : <Message variant='danger'>The admin authority can only be canceled by backstage!</Message>}
            <Button className='my-3' type='submit' variant='primary'>
            Update
            </Button>
        </Form>
      )}
      </FormContainer>
    </>
  )
}

export default UserEditScreen
