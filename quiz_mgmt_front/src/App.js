import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Login} from "./component/Login";
import {Home} from "./component/Home";
import {Navigation} from './component/Navigation';
import {Logout} from './component/Logout';
import {Register} from "./component/Register";
import AddQuestion from "./component/QuestionAdmin";
import QuizAdmin from "./component/QuizAdmin";
import PointsInQuizzesPage from './component/PointsAdmin';
import EditQuiz from "./component/EditQuiz";
import CreateNewQuestion from "./component/CreateQuestion";
import CreateNewQuiz from "./component/CreateQuiz";
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
          <Route path="/pointsadmin" element={<PointsInQuizzesPage/>}/>
          <Route path="/edit-quiz/:quizId" element={<EditQuiz/>}/>
          <Route path="/create-question" element={<CreateNewQuestion/>}/>
          <Route path="/create-quiz" element={<CreateNewQuiz/>}/>
        </Routes>
    </BrowserRouter>
  );
}
export default App;