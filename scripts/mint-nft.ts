import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { liskSepolia } from "viem/chains";
import * as dotenv from "dotenv";

dotenv.config();

const BLOOM_NFT_ADDRESS = "0xeD9d8D699Dd815DCa50FCe974d1EA5A57E84D694";
const METADATA_HASH = "bafkreidpoyoozugjkvnepgagcg45oe642amluyxiomhefjgbfbzktvvqe4";


const BloomNFTABI = [
  {
    name: "mint",                    // nama function di kontrak
    type: "function",                // ini adalah function (bukan event/constructor)
    
    inputs: [                        // parameter yang diterima function
      { 
        name: "to",                  // parameter pertama: address penerima NFT
        type: "address"              // tipe data: address
      },
      { 
        name: "ipfsHash",            // parameter kedua: IPFS hash metadata
        type: "string"               // tipe data: string
      }
    ],
    
    outputs: [                       // apa yang di-return function
      { 
        name: "",                    // return value ga ada nama
        type: "uint256"              // return tipe uint256 (token ID)
      }
    ],
    
    stateMutability: "nonpayable",   // function ini TIDAK menerima ETH/native token
  }
] as const;

async function main() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not found in .env");
  }

  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

  const publicClient = createPublicClient({
    chain: liskSepolia,
    transport: http(),
  });

  const walletClient = createWalletClient({
    account,
    chain: liskSepolia,
    transport: http(),
  });

  const mintTo = account.address;

  console.log("🎨 Minting NFT...");
  console.log("📝 Minter:", account.address);
  console.log("🎁 Recipient:", mintTo);
  console.log("📎 Metadata IPFS:", METADATA_HASH);

  const mintHash = await walletClient.writeContract({
    address: BLOOM_NFT_ADDRESS as `0x${string}`,
    abi: BloomNFTABI,
    functionName: "mint",
    args: [mintTo, METADATA_HASH],
  });

  console.log("✅ Mint transaction:", mintHash);
  await publicClient.waitForTransactionReceipt({ hash: mintHash });
  console.log("✅ NFT minted successfully!");
  console.log("🔗 View metadata:", `https://gateway.pinata.cloud/ipfs/${METADATA_HASH}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });