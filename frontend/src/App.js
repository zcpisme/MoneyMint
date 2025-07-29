import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import Portfolios from './pages/Portfolios';
import TestComponent from "./components/TestComponent";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MainPage/>}/>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/portfolios' element={<Portfolios/>}/>
                <Route path='/test' element={<TestComponent/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;