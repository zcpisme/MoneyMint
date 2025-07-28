import "./portfolios.scss";
import {useNavigate} from "react-router-dom";
const Portfolios = (info) => {
    const nav = useNavigate();

    return <div className="portfolios">
        <div className='header'>
            <h3>USER</h3>
            <h3>CONTACT</h3>
            <h3>ABOUT</h3>
            <h3 onClick={()=>{nav('/login')}}>LOG IN</h3>
        </div>
        <div className='portfoliosBody'>
            <div className="part1">
                <div className="button">
                    Overview of All portfolios
                </div>
                <div className="button">
                    Create New Portfolio
                </div>
            </div>
            <div className="part2">

            </div>
            <div className="part3">

            </div>
        </div>
    </div>
}

export default Portfolios