import React, { useState } from "react";
import axios from "axios";
import { Table } from "@web3uikit/core";
import { Reload } from '@web3uikit/icons'

function NativeTokens({wallet, nativeBalances, setNativeBalances}) {

  const getNativeBalances = async () => {
    try {
      const response = await axios.get("http://localhost:8080/nativeBalances", {
        params: {
          address: wallet
        }
      });
      console.log({responses: response.data.nativeBalances});
      if(response.data){
        setNativeBalances(response?.data?.nativeBalances ?? []);
      }
    } catch (e) {
      console.log(e.message);
    }
  }
  
  return (
    <>
      <div className="tabHeading">Native Coins <Reload onClick={() => getNativeBalances()}/>

      {nativeBalances.length > 0 && (
        <Table
          pageSize={6}
          noPagination={true}
          style={{width:"1035px"}}
          columnsConfig="300px 300px 300px 100px "
          data={nativeBalances.map((item)=>Object.values(item))}
          
          header={[
            <span>NativeToken</span>,
            <span>Price</span>,
            <span>Value</span>,
            <span>Chain</span>,
            
          ]}
        />
      )}
      </div>
    </>
  );
}

export default NativeTokens;
