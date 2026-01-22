import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

const RPC_URL = process.env.ARC_TESTNET_RPC!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;

// ← Вот сюда вставь свою ссылку на metadata с Pinata!
// Рекомендую формат: ipfs://QmВашCID/metadata.json
// Или https://gateway.pinata.cloud/ipfs/Qmbafybeib2dl4bupeouqm22kvitvtu56mk7q26xjcaomlhdxwfouic7e2nzi/metadata.json (для теста надёжнее)
const METADATA_URI = "https://tomato-crazy-eagle-242.mypinata.cloud/ipfs/bafybeihhovijdgm3oi2aq7bmup6hcphqgwnvftj47xwpin2z75xrp44yqi/metadata.json";  // ← ИЗМЕНИ ЭТУ СТРОКУ!

if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS || !METADATA_URI) {
  throw new Error('Missing env variables or METADATA_URI for minting');
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Обновлённое ABI — теперь safeMint принимает два параметра
const abi = [
  "function safeMint(address to, string memory uri) external"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, quizPassed } = body;

    if (!quizPassed) {
      return NextResponse.json({ error: 'Quiz not completed' }, { status: 403 });
    }

    if (!ethers.isAddress(address)) {
      return NextResponse.json({ error: 'Invalid EVM address' }, { status: 400 });
    }

    // Опционально: можно добавить проверку, минтился ли уже этот адрес
    // (для этого нужен Redis/DB, пока пропускаем)

    console.log(`Minting NFT to ${address} with metadata: ${METADATA_URI}`);

    // Вызов safeMint с двумя параметрами: to + uri
    const tx = await contract.safeMint(address, METADATA_URI, {
      // gasLimit: 300000, // если нужно — раскомментируй и подбери значение
    });

    console.log(`Mint tx sent: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`Minted to ${address} | Block: ${receipt.blockNumber} | Gas used: ${receipt.gasUsed.toString()}`);

    return NextResponse.json({
      success: true,
      txHash: receipt.hash,
      explorer: `https://testnet.arcscan.app/tx/${receipt.hash}`,
      tokenUri: METADATA_URI, // для отладки
    });
  } catch (err: any) {
    console.error('Mint error details:', err);

    let errorMessage = 'Failed to mint NFT';
    if (err.code === 'CALL_EXCEPTION') {
      errorMessage = `Execution reverted: ${err.reason || 'Unknown custom error'}`;
    } else if (err.message.includes('insufficient funds')) {
      errorMessage = 'Insufficient funds for gas (need test USDC on signer address)';
    }

    return NextResponse.json(
      { error: errorMessage, details: err.message || err.toString() },
      { status: 500 }
    );
  }
}