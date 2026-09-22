import Login from './pages/login'
import StdLogin from './pages/StudentLogin';
import StdRegister from './pages/StudentRegister';
import TrnrQR from './pages/TrainerQR';
import TrnrRegister from './pages/TrainerRegister';
import QRScanner from './pages/StdCamera';
import TrainerLogin from './pages/trainerLogin';
import {BrowserRouter,Route,Routes} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/StudentLogin' element={<StdLogin/>}/>
        <Route path='/StdCamera' element={<QRScanner/>}/>
        <Route path='/TrainerQR' element={<TrnrQR/>}/>
        <Route path='/TrainerLogin' element={<TrainerLogin/>}/>
        <Route path='/StudentRegister' element={<StdRegister/>}/>
        <Route path='/TrainerRegister' element={<TrnrRegister/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;