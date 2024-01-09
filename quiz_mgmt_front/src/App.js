import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Login} from "./component/Login";
import {Home} from "./component/Home";
import {Navigation} from './component/Navigation';
import {Logout} from './component/Logout';
function App() {
  return (
    <BrowserRouter>
        <Navigation></Navigation>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/logout" element={<Logout/>}/>
        </Routes>
    </BrowserRouter>
  );
}
export default App;