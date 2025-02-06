// avsModule.ts
import { ethers, Contract, Wallet } from "ethers";
import { postErrorToDiscord, postToDiscord } from "./discord";
import AVSTransferABI from "./abi/AVSTransferABI.json";

/**
 * Función AVS que ejecuta y verifica una transferencia de tokens entre clones
 * utilizando el contrato AVSTransfer on-chain.
 *
 * @param tokenAddress - Dirección del contrato ERC20 (por ejemplo, el token $SMOL)
 * @param avsTransferAddress - Dirección desplegada del contrato AVSTransfer
 * @param deployer - Wallet del deployer/gobierno que invoca el contrato
 * @param cloneA - Dirección del clon emisor
 * @param cloneB - Dirección del clon receptor
 * @param amount - Cantidad de tokens a transferir (en wei)
 * @param nonce - Número único para evitar replays (debe coordinarse con la firma)
 * @param signature - Firma generada off-chain por el verificador (gobierno) para autorizar la transferencia
 *
 * @returns Tx hash de la transferencia verificada o `false` en caso de error
 */
export async function avsTransferFunds(
  tokenAddress: string,
  avsTransferAddress: string,
  deployer: Wallet,
  cloneA: string,
  cloneB: string,
  amount: bigint,
  nonce: number,
  signature: string
): Promise<string | false> {
  try {
    console.log(
      "AVS: Iniciando transferencia verificada on-chain a través del contrato AVSTransfer..."
    );
    console.log(
      `AVS: Token ${tokenAddress} - de ${cloneA} a ${cloneB} - Cantidad: ${ethers.formatEther(
        amount
      )}`
    );

    // Conecta con el contrato AVSTransfer usando la wallet del deployer
    const avsTransferContract: Contract = new ethers.Contract(
      avsTransferAddress,
      AVSTransferABI,
      deployer
    );

    // Llama a la función avsTransfer del contrato
    const tx = await avsTransferContract.avsTransfer(
      tokenAddress,
      cloneA,
      cloneB,
      amount,
      nonce,
      signature
    );

    console.log("AVS: Transacción enviada, esperando confirmación...");
    const receipt = await tx.wait();
    console.log(
      "AVS: Transferencia ejecutada y verificada con éxito. Tx hash:",
      receipt.transactionHash
    );

    // Notifica a Discord el éxito de la operación
    await postToDiscord(
      `AVS: Transferencia verificada de ${ethers.formatEther(
        amount
      )} tokens de ${cloneA} a ${cloneB} a través del contrato AVSTransfer. Tx Hash: ${
        receipt.transactionHash
      }`
    );

    return receipt.transactionHash;
  } catch (error) {
    console.error(
      "AVS: Error durante la transferencia verificada on-chain:",
      error
    );
    await postErrorToDiscord(
      "AVS: Error ejecutando la transferencia verificada on-chain."
    );
    return false;
  }
}
