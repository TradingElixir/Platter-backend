import React from "react";
import { useState, useEffect } from "react";
import "../App.css";

function PortfolioValue({ tokens, nativeBalances }) {
  const [totalValue, setTotalValue] = useState(0);

  console.log({ tokens, nativeBalances });
  
  useEffect(() => {
    if (Array.isArray(tokens) && Array.isArray(nativeBalances)) {
      
      let val = 0;
      for (let i = 0; i < tokens.length; i++) {
        val = val + Number(tokens[i].val);
      }
      
      let val1 = 0;
      for (let i = 0; i < nativeBalances.length; i++) {
        val1 = val1 + Number(nativeBalances[i].nativeValue);
      }
      
      let val2 = 0;
      val2 = val1 + val;
      
      setTotalValue(val2.toFixed(2));
    }
  }, [nativeBalances, tokens]);

  return (
    <>
      <div className="totalValue">
        <h3>TOTAL PORTFOLIO</h3>
        <h2>
          ${totalValue}
        </h2>
      </div>
    </>
  );
}

export default PortfolioValue;
