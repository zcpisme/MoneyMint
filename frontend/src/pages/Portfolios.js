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
                <div className="diagram">

                </div>
            </div>
            <div className="part3">
                <div className="portTitle">
                    <div className="leftTitle">
                        <div className="myPortBtn">
                            My Portfolios
                        </div>
                        <div className="myPortBtn">
                            My Holdings
                        </div>
                    </div>
                    <div className="rightTitle">
                        How to Utilize My Portfolio and My Holdings
                    </div>
                    <div className="portBody">
                        <div className="infopart">
                            <h3>symbols</h3>
                            <h3>cost</h3>
                            <h3>mktval</h3>
                            <h3>daychange</h3>
                            <h3>unreal</h3>
                            <h3>realize</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Portfolios