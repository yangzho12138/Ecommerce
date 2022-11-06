import React from 'react';
import { Container } from 'react-bootstrap'
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <>
      <Header />
        <main className='py-3'>
          <Container>
            <Routes>
              <Route path='/' element={<HomeScreen />}/>
              <Route path='/login' element={<LoginScreen />} />
              <Route path='/product/:id' element={<ProductScreen />} />
              <Route path='/cart/:id' element={<CartScreen />} />
              <Route path='/cart' element={<CartScreen />} />
              <Route path='*' element={<div>Not Found</div>} />
            </Routes>
          </Container>
        </main>
      <Footer />
    </>
  );
}

export default App;
