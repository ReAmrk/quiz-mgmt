import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Login} from "./component/Login";
import {Home} from "./component/Home";
import {Navigation} from './component/Navigation';
import {Logout} from './component/Logout';
import {Register} from "./component/Register";
import AddQuestion from "./component/AddQuestion";
import QuizAdmin from "./component/QuizAdmin";
function App() {
  return (
    <BrowserRouter>
        <Navigation></Navigation>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/logout" element={<Logout/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/addquestion" element={<AddQuestion/>}/>
          <Route path="/quizadmin" element={<QuizAdmin/>}/>
        </Routes>
    </BrowserRouter>
  );
}
export default App;