import LanguageChange from "../components/LanguageChange";
import './MainPage.scss'
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import OverallIndex from "../components/OverallIndex";

const MainPage = () => {

    const nav = useNavigate();

    return <div className='mainPage'>
        <div className='header'>
            <h3>USER</h3>
            <h3>CONTACT</h3>
            <h3 onClick={()=>{nav('/portfolios')}}>PORTFOLIO</h3>
            <h3 onClick={()=>{nav('/login')}}>LOG IN</h3>
        </div>
        <div className='mainPageBody'>
            <input />
            <div className='mainPageMarket'>
                <h3>
                    Market Indices
                </h3>
                <div className="mainMarketIndices">
                    <OverallIndex sp="6451.00" val="26%" perVal="+0.50%"/>
                    <OverallIndex sp="6451.00" val="26%" perVal="+0.50%"/>
                    <OverallIndex sp="6451.00" val="26%" perVal="+0.50%"/>
                    <OverallIndex sp="6451.00" val="26%" perVal="+0.50%"/>
                </div>
            </div>

            <div className='mainPageStocks'>
                <h3>Stocks</h3>
                {/* <StockItem /> */}
                <div className='mainPageLogoContainer'>
                    <img src="/UIIcons/Poster.png" alt=""/>
                </div>
            </div>

            
        </div>
        <div className="mainPageFooter">
            <LanguageChange />
        </div>
    </div>
}

export default MainPage