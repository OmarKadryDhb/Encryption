import React, { useState } from "react";

export default function CBCPage() {
    const [key, setKey] = useState([]);
    const [iv, setIV] = useState([]);
    const [message, setMessage] = useState("");
    const [ciphertext, setCiphertext] = useState([]);
    const [result, setResult] = useState("");

    const generateBytesFromLCG = (seed, count) => {
        const a = 1664525;
        const c = 1013904223;
        const m = 2 ** 32;
        let x = seed;
        const bytes = [];
            for (let i = 0; i < count; i++) {
                x = (a * x + c) % m;
                bytes.push(x & 0xff);
            }
        return bytes;
    };

    const handleGenerateKeys = () => {
        const randomSeed = Math.floor(Math.random() * 1000000);
        setKey(generateBytesFromLCG(randomSeed, 16));
        setIV(generateBytesFromLCG(randomSeed + 1, 16));
        setResult("");
        setCiphertext([]);
    };

    const xorEncrypt = (input, key) => {
        return input.map((byte, i) => byte ^ key[i % key.length]);
    };

    const cbcEncrypt = (plaintextBytes, key, iv) => {
        let ciphertext = [];
        let previousBlock = [...iv];

        for (let i = 0; i < plaintextBytes.length; i += 16) {
            let block = plaintextBytes.slice(i, i + 16);

            if (block.length < 16) {
                const padLength = 16 - block.length;
                block = [...block, ...Array(padLength).fill(padLength)];
            }

            const xoredBlock = block.map((byte, idx) => byte ^ previousBlock[idx]);
            const encryptedBlock = xorEncrypt(xoredBlock, key);

            ciphertext = [...ciphertext, ...encryptedBlock];
            previousBlock = encryptedBlock;
    }

    // Add padding block if message is multiple of 16
    if (plaintextBytes.length % 16 === 0) {
        const paddingBlock = Array(16).fill(16);
        const xoredPadding = paddingBlock.map((byte, idx) => byte ^ previousBlock[idx]);
        const encryptedPadding = xorEncrypt(xoredPadding, key);
        ciphertext = [...ciphertext, ...encryptedPadding];
    }

    return ciphertext;
    };

    const cbcDecrypt = (ciphertextBytes, key, iv) => {
        let plaintext = [];
        let previousBlock = [...iv];

        for (let i = 0; i < ciphertextBytes.length; i += 16) {
            const block = ciphertextBytes.slice(i, i + 16);

        const decryptedBlock = xorEncrypt(block, key).map(
            (byte, idx) => byte ^ previousBlock[idx]
        );

        plaintext = [...plaintext, ...decryptedBlock];
        previousBlock = block;
    }

    return plaintext;
    };

    const removePadding = (bytes) => {
        const paddingLength = bytes[bytes.length - 1];
        if (paddingLength > 0 && paddingLength <= 16 && bytes.slice(-paddingLength).every((b) => b === paddingLength)) {
            return bytes.slice(0, -paddingLength);
        }
        return bytes;
    };

    const encrypt = () => {
        if (!message.trim()) {
            setResult("Encryption failed: Please enter some text to encrypt.");
        return;
    }
    const encoder = new TextEncoder();
    const plaintextBytes = Array.from(encoder.encode(message));
    const encryptedBytes = cbcEncrypt(plaintextBytes, key, iv);
    setCiphertext(encryptedBytes);
    setResult(`Encrypted: ${btoa(String.fromCharCode(...encryptedBytes))}`);
    };

    const decrypt = () => {
        if (ciphertext.length === 0) {
            setResult("Decryption failed: No ciphertext available");
        return;
    }
    const decryptedBytes = cbcDecrypt(ciphertext, key, iv);
    const cleanedBytes = removePadding(decryptedBytes);
    const decoder = new TextDecoder();
    setResult(`Decrypted: ${decoder.decode(new Uint8Array(cleanedBytes)).trim()}`);
    };

    const arrayToHexString = (arr) => arr.map((b) => b.toString(16).padStart(2, '0')).join('');

    return <>
        <div className="container content-con pt-4">
            <h1 className="fw-bold text-center">CBC</h1>
            <div className="container gen-con mb-3 p-0">
                <div className="row d-flex justify-content-around">
                    <h4 className="fw-bold text-white">Generate Keys</h4>
                    <div className="col-md-6 mb-4">
                        <div className="PublicKey pt-3">
                            <h6 className="fw-bold text-white">Key</h6>
                            <div className="input-copy d-flex justify-content-center align-items-center">
                                <input type="text" className="public-input form-control" readOnly value={arrayToHexString(key)} />
                                <i className="fa-solid fa-copy fs-5 text-white"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-4">
                        <div className="PrivateKey pt-3">
                            <h6 className="fw-bold text-white">IV</h6>
                            <div className="input-copy d-flex justify-content-center align-items-center">
                                <input type="text" className="public-input form-control" readOnly value={arrayToHexString(iv)} />
                                <i className="fa-solid fa-copy fs-5 text-white"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="generateBtn d-flex justify-content-start">
                    <button className="generate-btn btn fw-bold m-0" onClick={handleGenerateKeys}>Generate</button>
                </div>
            </div>
            <div className="input-output">
                <div className="form-group mb-3">
                    <label htmlFor="exampleFormControlInput1" className="form-label fw-bold">Enter Text</label>
                    <input type="text" className="form-control rsa-text" id="exampleFormControlInput1" onChange={(e) => setMessage(e.target.value)} placeholder="Hello"/>
                    <button type="button" className="btn btn-primary mt-2" onClick={encrypt} disabled={!message.trim()}>Encrypt</button>
                    <button type="button" className="btn btn-secondary mt-2 ms-2" onClick={decrypt} disabled={ciphertext.length === 0 || !message.trim()}>Decrypt</button>
                </div>
                <label htmlFor="exampleFormControlTextarea1" className="form-label fw-bold">Result</label>
                <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" readOnly value={result}></textarea>
            </div>
        </div>
    </>
    ;
}


// import React from 'react'
// import "./CBC.css"
// import Home from '../Home/Home'
// export default function CBC() {
//     // let key;
    // let iv;

    // async function generateKeyAndIV() {
    //     key = await window.crypto.subtle.generateKey(
    //     {
    //         name: "AES-CBC",
    //         length: 256,
    //     },
    //     true,
    //     ["encrypt", "decrypt"]
    //     );

    //     iv = window.crypto.getRandomValues(new Uint8Array(16)); // Initialization vector
    // }

    // async function Encrypt() {
    //     if (!key || !iv) {
    //         await generateKeyAndIV();
    //     }

    // const text = document.getElementById("inp").value;
    // const encoder = new TextEncoder();
    // const data = encoder.encode(text);

    // const encrypted = await window.crypto.subtle.encrypt(
    // {
    //     name: "AES-CBC",
    //     iv: iv,
    // },
    // key,
    // data
    // );

    // // Combine IV with ciphertext for export
    // const combined = new Uint8Array(iv.length + encrypted.byteLength);
    // combined.set(iv);
    // combined.set(new Uint8Array(encrypted), iv.length);

    // const base64 = btoa(String.fromCharCode(...combined));
    // document.getElementById("exampleFormControlTextarea1").value = base64;
    // }
    // return <>
    // <div className="container content-con pt-4">
    //     <h1 class="fw-bold text-center">CBC</h1>
    //     <div class="form-group mb-3">
    //         <label for="exampleFormControlInput1" class="form-label fw-bold">Enter Text</label>
    //         <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Hello"/>
    //         <button type="button" class="btn">Encrypt</button>
    //     </div>
    //     <div class="mb-3">
    //         <label for="exampleFormControlTextarea1" class="form-label fw-bold">Result</label>
    //         <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
    //     </div>
    // </div>
    // </>
// }

// import React, { useState } from 'react';
// import CryptoJS from 'crypto-js';

// export default function CBCEncryptor() {
//   const [plaintext, setPlaintext] = useState('');
//   const [key, setKey] = useState('');
//   const [iv, setIV] = useState('');
//   const [ciphertext, setCiphertext] = useState('');
//   const [decryptedText, setDecryptedText] = useState('');

//   const generateKeyAndIV = () => {
//     const randomKey = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
//     const randomIV = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
//     setKey(randomKey);
//     setIV(randomIV);
//   };

//   const encrypt = () => {
//     try {
//       const keyHex = CryptoJS.enc.Hex.parse(key);
//       const ivHex = CryptoJS.enc.Hex.parse(iv);
//       const encrypted = CryptoJS.AES.encrypt(plaintext, keyHex, {
//         iv: ivHex,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//       });
//       setCiphertext(encrypted.toString());
//     } catch (err) {
//       alert('Encryption failed: ' + err.message);
//     }
//   };

//   const decrypt = () => {
//     try {
//       const keyHex = CryptoJS.enc.Hex.parse(key);
//       const ivHex = CryptoJS.enc.Hex.parse(iv);
//       const decrypted = CryptoJS.AES.decrypt(ciphertext, keyHex, {
//         iv: ivHex,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//       });
//       const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
//       if (!decryptedString) throw new Error("Decryption failed, possibly invalid key/IV/ciphertext");
//       setDecryptedText(decryptedString);
//     } catch (err) {
//       alert('Decryption failed: ' + err.message);
//     }
//   };

//   return (
//     <div className="p-6 max-w-lg mx-auto bg-white rounded shadow-md">
//       <h2 className="text-xl font-bold mb-4">AES-CBC Encryption</h2>

//       <textarea
//         className="w-full p-2 border mb-2"
//         placeholder="Enter plaintext"
//         value={plaintext}
//         onChange={(e) => setPlaintext(e.target.value)}
//       />

//       <input
//         className="w-full p-2 border mb-2"
//         placeholder="Generated Key (32 hex chars)"
//         value={key}
//         readOnly
//       />

//       <input
//         className="w-full p-2 border mb-2"
//         placeholder="Generated IV (32 hex chars)"
//         value={iv}
//         readOnly
//       />

//       <div className="flex flex-wrap gap-2 mb-4">
//         <button onClick={generateKeyAndIV} className="px-4 py-2 bg-yellow-500 text-white rounded">
//           Generate Key & IV
//         </button>
//         <button onClick={encrypt} className="px-4 py-2 bg-blue-600 text-white rounded">
//           Encrypt
//         </button>
//         <button onClick={decrypt} className="px-4 py-2 bg-green-600 text-white rounded">
//           Decrypt
//         </button>
//       </div>

//       {ciphertext && (
//         <div className="mb-2">
//           <strong>Ciphertext:</strong>
//           <div className="break-all text-sm">{ciphertext}</div>
//         </div>
//       )}

//       {decryptedText && (
//         <div className="mb-2">
//           <strong>Decrypted Text:</strong>
//           <div>{decryptedText}</div>
//         </div>
//       )}
//     </div>
//   );
// }


// import React, { useState } from "react";
// import CryptoJS from "crypto-js";

// export default function CBCPage() {
//     const [key, setKey] = useState("");
//     const [iv, setIV] = useState("");
//     const [message, setMessage] = useState("");
//     const [ciphertext, setCiphertext] = useState(""); 
//     const [result, setResult] = useState("");

// const handleGenerateKeys = () => {
//     const randomKey = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
//     const randomIV = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
//     setKey(randomKey);
//     setIV(randomIV);
//     setResult("");
//     setCiphertext(""); 
// };

// const encrypt = () => {
//     if (!message.trim()) {
//         setResult("Encryption failed: Please enter some text to encrypt.");
//         return;
//     }

//     try {
//         const keyHex = CryptoJS.enc.Hex.parse(key);
//         const ivHex = CryptoJS.enc.Hex.parse(iv);
//         const encrypted = CryptoJS.AES.encrypt(message, keyHex, {
//             iv: ivHex,
//             mode: CryptoJS.mode.CBC,
//             padding: CryptoJS.pad.Pkcs7,
//         });
//         setCiphertext(encrypted.toString());
//         setResult(`Encrypted text: ${encrypted.toString()}`);
//     } catch (err) {
//         setResult("Encryption failed: " + err.message);
//     }
// };

// const decrypt = () => {
//     if (!ciphertext) {
//         setResult("Decryption failed: No ciphertext available");
//         return;
//     }

//     try {
//         const keyHex = CryptoJS.enc.Hex.parse(key);
//         const ivHex = CryptoJS.enc.Hex.parse(iv);
//         const decrypted = CryptoJS.AES.decrypt(ciphertext, keyHex, {
//             iv: ivHex,
//             mode: CryptoJS.mode.CBC,
//             padding: CryptoJS.pad.Pkcs7,
//     });
//     const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
//     if (!decryptedString) throw new Error("Decryption failed, possibly invalid key/IV/ciphertext");
//         setResult(`Decrypted text: ${decryptedString}`);
//     } catch (err) {
//         setResult("Decryption failed: " + err.message);
//     }
// };


// return  <>
//     <div className="container content-con pt-4">
//         <h1 className="fw-bold text-center">CBC</h1>
//             <div className="container gen-con mb-3 p-0">
//                 <div className="row d-flex justify-content-around">
//                     <h4 className="fw-bold text-white">Generate Keys</h4>
//                     <div className="col-md-6 mb-4">
//                         <div className="PublicKey pt-3">
//                             <h6 className="fw-bold text-white">Key</h6>
//                             <div className="input-copy d-flex justify-content-center align-items-center">
//                                 <input type="text" className="public-input form-control" readOnly value={key}/>
//                                 <i className="fa-solid fa-copy fs-5 text-white"></i>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-md-6 mb-4">
//                         <div className="PrivateKey pt-3">
//                             <h6 className="fw-bold text-white">IV</h6>
//                             <div className="input-copy d-flex justify-content-center align-items-center">
//                                 <input type="text" className="public-input form-control" readOnly value={iv}/>
//                                 <i className="fa-solid fa-copy fs-5 text-white"></i>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="generateBtn d-flex justify-content-start">
//                     <button className="generate-btn btn fw-bold m-0" onClick={handleGenerateKeys}>Generate</button>
//                 </div>
//             </div>
//             <div className="input-output">
//                 <div className="form-group mb-3">
//                     <label htmlFor="exampleFormControlInput1" className="form-label fw-bold">Enter Text</label>
//                     <input type="text" className="form-control rsa-text" id="exampleFormControlInput1" onChange={(e) => setMessage(e.target.value)} placeholder="Hello"/>
//                     <button type="button" className="btn btn-primary mt-2" onClick={encrypt} disabled={!message.trim()}>Encrypt</button>
//                     <button type="button" className="btn btn-secondary mt-2 ms-2" onClick={decrypt} disabled={!ciphertext}>Decrypt</button>
//                 </div>
//                 <label htmlFor="exampleFormControlTextarea1" className="form-label fw-bold">Result</label>
//                 <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" readOnly value={result}></textarea>
//             </div>
//     </div>
//     </>
// ;
// }


