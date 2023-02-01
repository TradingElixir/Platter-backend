import React from "react";
import axios from "axios";
import { Table } from "@web3uikit/core";
import { Reload } from "@web3uikit/icons";

function Tokens({ wallet, tokens, setTokens }) {

  async function getTokenBalances() {
    const response = await axios.get("http://localhost:8080/tokenBalances", {
      params: {
        address: wallet,
       
      },
    });

    if (response.data) {
      tokenProcessing(response.data);
    }
  }

  function tokenProcessing(t) {

    if(Array.isArray(t)){
    for (let i = 0; i < t.length; i++) {
      t[i].bal = (Number(t[i].balance) / Number(`1E${t[i].decimals}`)).toFixed(3); //1E18
      t[i].val = ((Number(t[i].balance) / Number(`1E${t[i].decimals}`)) *Number(t[i].usd)).toFixed(2);
    }

    setTokens(t);

  }
  }

  return (
    <>
      <div className="tabHeading">ERC20 Coins <Reload onClick={getTokenBalances}/>

      {tokens.length > 0 && (
        <Table
          pageSize={6}
          noPagination={true}
          style={{ width: "1035px" }}
          columnsConfig="300px 300px 300px 100px"
          data={Array.isArray(tokens) ? tokens.map((e) => [e.symbol, e.bal, `$${e.val}`,e.chain] ) : []}
          header={[
            <span>Currency</span>,
            <span>Balance</span>,
            <span>Value</span>,
            <span>Chain</span>,
          ]}
        />
      )}
      </div>
    </>
  );
}

export default Tokens;