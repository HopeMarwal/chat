//inport style scss
import './assets/scss/style.scss';
//import router 
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  HashRouter
} from 'react-router-dom';
//import pages
import Login from './pages/Login'
import Home from './pages/Home';
import Register from './pages/Register';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {

  const { currentUser } = useContext(AuthContext)

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />
    }
    return children
  }

  return (
    <HashRouter>
      <Routes>
        <Route path='/'>
          <Route index element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

      </Routes>
    </HashRouter>
  );
}

export default App;
