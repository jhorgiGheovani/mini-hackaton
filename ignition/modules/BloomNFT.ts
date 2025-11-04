import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BloomNFTModule = buildModule("BloomNFTModule", (m) => {
  const bloomNFT = m.contract("BloomNFT", ["BloomToken", "BLOOM"]); //BloomToken (nama) dan BLOOM (simbol) bisa diubh based on user input

  return { bloomNFT };
});

export default BloomNFTModule;