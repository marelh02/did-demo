import { findVerificationMethodByPublicKey } from ".";

async function main(){
    const did = 'did:example:123';
    const publicKey = 'mockPublicKey';
    const result = await findVerificationMethodByPublicKey(did, publicKey);
    console.log('Verification Method:', result);
    
}

main().then(()=> process.exit(0)).catch((e)=>{
    console.error(e);
    process.exit(1);
}
);