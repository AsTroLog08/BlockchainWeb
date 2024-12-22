import styles from "./Home.css"
import Navbar from "../../components/Navbar.js";
import background from "../../assets/images/BackgroundGraph.svg"
import month from "../../assets/images/Month.svg"
import portfolioGoals from "../../assets/images/PortfolioGoals.svg"
import balanceAnalyticsGoals from "../../assets/images/BalanceAnalyticsGoals.svg"
import transactionDataGoals from "../../assets/images/TransactionDataGoals.svg"
import transactionCostGoals from "../../assets/images/TransactionCostGoals.svg"
import transferGoals from "../../assets/images/TransferGoals.svg"
import graph from "../../assets/images/Graph.svg"

export default function Home(){
    return (
        <>
          <Navbar/>
          <section className="section-first">
             <img className="background-month" src={month} alt="Month" />
             <img className="background-graph" src={background} alt="Background" />
            <div className="container-60px">
                <div className="slogan">Transparent metadata<br />management for<br />hybrid storage</div>
            </div>
          </section>
          <section className="section-second">
            <div className="container-240px">
                <div className="title-1">Maximaize the potential of the platform to achive your goals</div>
                <div className="title-2">Ensure reliability, transparency, and data security with our system.</div>
                <ul className="goals-ul">
                  <li className="goals-li" ><img className="background-goals" src={transferGoals} alt="Transfer" />Metadata transparency</li>
                  <li className="goals-li" ><img className="background-goals" src={portfolioGoals} alt="Manage" />Data immutability</li>
                  <li className="goals-li" ><img className="background-goals" src={transactionDataGoals} alt="View" />Integration with hybrid storage</li>
                  <li className="goals-li" ><img className="background-goals" src={transactionCostGoals} alt="Track" />CRUD operations via API</li>
                </ul>
                <div className="name-brand">CRYPTIC</div>
            </div>
          </section>
        </>
      );
}