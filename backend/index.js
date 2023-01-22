const Moralis = require("moralis").default;
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 8080;

app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//GET AMOUNT AND VALUE OF NATIVE TOKENS

app.get("/nativeBalance", async (req, res) => {
  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  }
  try {
    const { address, chain } = req.query;

    const response = await Moralis.EvmApi.balance.getNativeBalance({
      address: address,
      chain: chain,
    });

    const nativeBalance = response.raw;

    let nativeCurrency;
    if (chain === "0x1") {
      nativeCurrency = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    } else if (chain === "0x89") {
      nativeCurrency = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
    } else if (chain === "0xfa") {
      nativeCurrency = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83";
    } else if (chain === "0x38") {
      nativeCurrency = "0x242a1ff6ee06f2131b7924cacb74c7f9e3a5edc9";
    }

    const nativePrice = await Moralis.EvmApi.token.getTokenPrice({
      address: nativeCurrency, //WETH Contract
      chain: chain,
    });

    nativeBalance.usd = nativePrice.raw.usdPrice;

    res.send(nativeBalance);
  } catch (e) {
    console.log(e.message);
    res.send(e.message);
  }
});

//GET AMOUNT AND VALUE OF ERC20 TOKENS

app.get("/tokenBalances", async (req, res) => {
  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  }

  try {
    const { address, chain } = req.query;

    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      address: address,
      chain: chain,
    });

    let tokens = response.raw;
    const tokensWithUsd = await Promise.all(
      tokens.map(async (token) => {
        try {

          const priceResponse = await Moralis.EvmApi.token.getTokenPrice({
            address: token.token_address,
            chain: chain,
          });

          if (priceResponse.raw.usdPrice > 0.001) {
            return {
              ...token,
              usd: priceResponse.raw.usdPrice
            };
          }
          console.log("💩 coin");
          return { ...token, usd: 0 };
        } catch (error) {
          console.log('error', error)
          return { ...token, usd: 0 };

        }
      })
    );
    console.log({ tokensWithUsd })
    const legitTokens = tokensWithUsd.filter(({ usd }) => usd !== 0);
    res.send(legitTokens);
  } catch (e) {
    res.send(e.message);
  }
});

//GET Users NFT's

app.get("/nftBalance", async (req, res) => {
  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  }

  try {
    const { address, chain } = req.query;

    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address: address,
      chain: chain,
    });

    const userNFTs = response.raw;

    res.send(userNFTs);
  } catch (e) {
    res.send(e.message);
  }
});

//GET USERS TOKEN TRANSFERS
app.get("/tokenTransfers", async (req, res) => {
  try {
    const { address, chain } = req.query;

    const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
      address: address,
      chain: chain,
    });

    const userTrans = response.raw.result;

    // Use map() to create an array of promises that call getTokenMetadata() concurrently
    const metadataPromises = userTrans.map(async (transfer) => {
      try {
        const metaResponse = await Moralis.EvmApi.token.getTokenMetadata({
          addresses: [transfer.address],
          chain: chain,
        });
        if (metaResponse.raw) {
          transfer.decimals = metaResponse.raw[0].decimals;
          transfer.symbol = metaResponse.raw[0].symbol;
          return transfer;
        } else {
          console.log("no details for desired coin");
        }
      } catch (e) {
        console.log(e);
      }
    });

    // Wait for all metadataPromises to resolve and filter out undefined values
    const userTransDetails = (await Promise.all(metadataPromises)).filter(Boolean);

    res.send(userTransDetails);
  } catch (e) {
    res.send(e.message);
  }
});