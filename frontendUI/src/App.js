import "./App.css";
import { useState } from "react";
import NativeTokens from "./components/NativeTokens";
import Tokens from "./components/Tokens";
import TransferHistory from "./components/TransferHistory";
import Nfts from "./components/Nfts";
import WalletInputs from "./components/WalletInputs";
import PortfolioValue from "./components/PortfolioValue";
import { Avatar, TabList, Tab } from "@web3uikit/core";

function App() {
  const [wallet, setWallet] = useState("");
  const [chain, setChain] = useState("0x1");
  const [nativeBalances, setNativeBalances] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [filteredNfts, setFilteredNfts] = useState([]);
  const [transfers, setTransfers] = useState([]);

  return (
    <div className="App">
      <WalletInputs
        chain={chain}
        setChain={setChain}
        wallet={wallet}
        setWallet={setWallet}
      />
      <div className="content">
        <div className="walletInfo">
          {wallet.length === 42 && (
            <>
              <div>
                <Avatar isRounded size={130}  image="https://nftcoders.com/avatar/avatar-cool.svg" theme="image" />
                <h3>{`${wallet.slice(0, 6)}...${wallet.slice(36)}`}</h3>
              </div>
              <PortfolioValue
                tokens={tokens}
                nativeBalances={nativeBalances}
              />
            </>
          )}
        </div>

        <TabList className="tab-list">
          <Tab tabKey={1} tabName={"TOKENS"}>
          <NativeTokens
            wallet={wallet}
            nativeBalances={nativeBalances}
            setNativeBalances={setNativeBalances}
            />

            <Tokens
              wallet={wallet}
              chain={chain}
              tokens={tokens}
              setTokens={setTokens}
            />
          </Tab>
          <Tab tabKey={2} tabName={"TRANSFERS"}>
            <TransferHistory 
              chain={chain} 
              wallet={wallet} 
              transfers={transfers}
              setTransfers={setTransfers}
            />
          </Tab>
          <Tab tabKey={3} tabName={"NFT'S"}>
            <Nfts 
              wallet={wallet} 
              chain={chain} 
              nfts={nfts}
              setNfts={setNfts}
              filteredNfts={filteredNfts}
              setFilteredNfts={setFilteredNfts}  
            />
          </Tab>
        </TabList>
      </div>
    </div>
  );
}

export default App;
