import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./views/home"
import Market from './components/market';
import Register from './components/register';
import { AuthProvider, useAuth } from './components/authProvider';
import { CookiesProvider } from 'react-cookie';
import Prueba from './components/makemeAuthor';
import PublishBook from './components/publishBook';
import YourBooks from './components/yourBooks';
import Modifybook from './components/modifybook';
import CartHandler from './components/cartHandler';

const PrivateRoute = ({ children, roleRequired }) => {
  const { userData, user, userRole, logout, isLogged, isLoading } = useAuth()
  if (isLoading) {
    return null
  }
  if (!isLogged) {
    return <Navigate to="/" />
  }
  if (roleRequired != null) {
    console.log(userRole,roleRequired,isLogged)
    if (userRole >= roleRequired && isLogged) {
      return children
    } else {
      return (<Navigate to="/" />)
    }
  } else {
    return children
  }
}
function CustomRouter() {
  const toPrivate = (component) => { return <PrivateRoute>{component}</PrivateRoute> }
  const toUser = (component) => { return <PrivateRoute roleRequired={0}>{component}</PrivateRoute> }
  const toAuthor = (component) => { return <PrivateRoute roleRequired={1}>{component}</PrivateRoute> }
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path='/' element={<Market />}></Route>
        <Route path='/makeme/author' element={toUser(<Prueba />)}></Route>
        <Route path='/carrito' element={toUser(<CartHandler/>)}/>
        <Route path="/publication-book" element={toAuthor(<PublishBook/>)}></Route>
        <Route path="/your-books" element={toAuthor(<YourBooks/>)}></Route>
        <Route path="/modify-book/:id" element={toAuthor(<Modifybook/>)}></Route>
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <CookiesProvider>
      <AuthProvider>
        <Router>
          <CustomRouter />
        </Router>
      </AuthProvider>
    </CookiesProvider>
  );
}

export default App;
