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
                <div className="slogan">Simple and Secure <br />Management of Your <br />Crypto Wallets</div>
            </div>
          </section>
          <section className="section-second">
            <div className="container-240px">
                <div className="title-1">Maximaize the potential of the platform to achive your goals</div>
                <div className="title-2">Create portfolio, connect your wallets, use analytical tools, send transactions</div>
                <ul className="goals-ul">
                  <li className="goals-li" ><img className="background-goals" src={transferGoals} alt="Transfer" />Transfer your assets</li>
                  <li className="goals-li" ><img className="background-goals" src={portfolioGoals} alt="Manage" />Manage different portfolios</li>
                  <li className="goals-li" ><img className="background-goals" src={transactionDataGoals} alt="View" />View historical transaction data</li>
                  <li className="goals-li" ><img className="background-goals" src={transactionCostGoals} alt="Track" />Track transaction costs</li>
                  <li className="goals-li" ><img className="background-goals" src={balanceAnalyticsGoals} alt="Analyze" />Analyze wallet balance changes</li>
                </ul>
                <div className="name-brand">CRYPTIC</div>
            </div>
          </section>
           <section className="section-third">

            <img className="analiitics-graph" src={graph} alt="Analiitics" />
            <div className="analiitics-info">
                  <div className="title-1">Access copmprehesive asset <br /> analytics for your portfolios</div>
                  <div className="title-2">Discover our platform's powerful analytical tools,<br />  featuring interactive charts for tracking balance<br />  changes. 
                    Gain insights into asset allocation with <br /> portfolio structure analysis and monitor your<br /> profitability with detailed performance metrics for <br />each coin.</div>
                  <ul className="analytics-ul">
                    <li className="access-li" ><img className="analytics-access" src={transferGoals} alt="Choose" />Choose a wallet</li>
                    <li className="access-li" ><img className="analytics-access" src={portfolioGoals} alt="Select" />Select a time period</li>
                    <li className="access-li" ><img className="analytics-access" src={transactionDataGoals} alt="Customize" />Customize the data displayed</li>
                    <li className="access-li" ><img className="analytics-access" src={transactionCostGoals} alt="GetGetGetGetGetGetGetGet" />Get all you need to know</li>
                  </ul>
               </div>
          </section>
        </>
      );
}