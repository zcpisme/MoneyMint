import LanguageChange from "../components/LanguageChange";
import './MainPage.scss'
import {useNavigate} from "react-router-dom";
import {useState} from "react";
const MainPage = () => {

    const nav = useNavigate();
    const [selectionWindow, showSelectionWindow] = useState(false);

    return <div className='mainPage'>
        <div className='header'>
            <h3>COMMUNITY</h3>
            <h3>NEWS</h3>
            <h3>CONTACT</h3>
            <h3>ABOUT</h3>
            <h3 onClick={()=>{nav('/login')}}>LOG IN</h3>
        </div>
        <div className='mainPageBody'>
            <div className='mainPageName'>
                <img src="/UIIcons/Logo(white).png" alt=""/>
                <h3>Create your own jewelry with AI in seconds</h3>
            </div>

            <div className='mainPageLogo'>
                <div className='mainPageLogoContainer'>
                    <img src="/UIIcons/Poster.png" alt=""/>
                </div>
            </div>

            <div className='mainPageBtns'>
                <button onClick={()=>{showSelectionWindow(true)}}>
                    START CREATION
                </button>
                <button onClick={()=>{nav('/community')}}>
                    CREATIVE COMMUNITY
                </button>
            </div>
        </div>
        <div className="mainPageFooter">
            <LanguageChange />
        </div>
    </div>
}

export default MainPage