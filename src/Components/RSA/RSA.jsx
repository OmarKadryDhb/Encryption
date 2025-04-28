import React, { useState } from 'react'
import "./RSA.css"

export default function RSA() {
  const [message, setMessage] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [result, setResult] = useState('')
  const [primeP, setPrimeP] = useState(null)
  const [primeQ, setPrimeQ] = useState(null)

  const encrypt = () => {
    if (!primeP || !primeQ) {
      setResult("Please generate keys first.");
      return;
    }
    const cipherText = encryption(message, primeP, primeQ);
    const decryptedMessage = decryption(cipherText, primeP, primeQ);

    const key = keys(primeP, primeQ);
    setResult(`Encrypted: ${btoa(cipherText.join(' '))}\nDecrypted: ${decryptedMessage}`);
  }

  const handleGenerateKeys = () => {
    const { p, q } = generatePrimes();
    const key = keys(p, q);
    setPublicKey(`(${key[0]}, ${key[1]})`);
    setPrivateKey(`(${key[0]}, ${key[2]})`);
    setPrimeP(p);
    setPrimeQ(q);
  };

  function generatePrimes() {
    let p, q, n;
    do {
      p = generateSmallPrime(Date.now());
      q = generateSmallPrime(p + 100);
      n = p * q;
    } while (n > 999999);
    return { p, q };
  }

  function generateSmallPrime(seed) {
    const primes = [101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191];
    const index = lcg(seed, primes.length);
    return primes[index];
  }

  function lcg(seed, range) {
    const a = 1664525, c = 1013904223, m = 2 ** 32;
    seed = (a * seed + c) % m;
    return seed % range;
  }

  function encryption(message, p, q) {
    const key = keys(p, q);
    const ascii = [...message].map(char => char.charCodeAt(0));
    const cipherText = ascii.map(num => modPow(BigInt(num), BigInt(key[1]), BigInt(key[0])));
    return cipherText.map(n => Number(n));
  }

  function decryption(cipherText, p, q) {
    const key = keys(p, q);
    const decrypted = cipherText.map(num => {
      const decryptedChar = modPow(BigInt(num), BigInt(key[2]), BigInt(key[0]));
      return String.fromCharCode(Number(decryptedChar));
    });
    return decrypted.join('');
  }

  function keys(p, q) {
    const n = p * q;
    const euler = (p - 1) * (q - 1);
    const e = getCoprimes(euler)[0];
    const d = modInverse(e, n, euler);
    return [n, e, d, euler];
  }

  function gcd(a, b) {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  function modPow(base, exponent, mod) {
    let result = 1n;
    while (exponent > 0n) {
      if (exponent % 2n === 1n) {
        result = (result * base) % mod;
      }
      exponent = exponent / 2n;
      base = (base * base) % mod;
    }
    return result;
  }

  function getCoprimes(euler) {
    const coPrimes = [];
    for (let i = 2; i < euler; i++) {
      if (gcd(i, euler) === 1) coPrimes.push(i);
    }
    return coPrimes;
  }

  function modInverse(e, n, euler) {
    for (let d = 1; d < n; d++) {
      if ((e * d) % euler === 1 && d !== e) return d;
    }
    throw new Error("No modular inverse found");
  }

  return <>
    <div className="container content-con pt-4">
      <h1 className="fw-bold text-center">RSA</h1>
      <div className="container gen-con mb-3 p-0">
        <div className="row d-flex justify-content-around">
          <h4 className='fw-bold text-white'>Generate Keys</h4>
          <div className="col-md-6 mb-4">
            <div className="PublicKey pt-3 ">
              <h6 className='fw-bold text-white'>Public Key</h6>
              <div className="input-copy d-flex justify-content-center align-items-center">
                <input type="text" className='public-input form-control' readOnly value={btoa(publicKey)} />
                <i className="fa-solid fa-copy fs-5 text-white"></i>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="PrivateKey pt-3">
              <h6 className='fw-bold text-white'>Private Key</h6>
              <div className="input-copy d-flex justify-content-center align-items-center">
                <input type="text" className='public-input form-control' readOnly value={btoa(privateKey)} />
                <i className="fa-solid fa-copy fs-5 text-white"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="generateBtn d-flex justify-content-start">
          <button className='generate-btn btn fw-bold m-0' onClick={handleGenerateKeys}>Generate</button>
        </div>
      </div>
      <div className="input-output">
        <div className="form-group mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label fw-bold">Enter Text</label>
          <input type="text" className="form-control rsa-text" id="exampleFormControlInput1" onChange={(e) => setMessage(e.target.value)} placeholder="Hello" />
          <button type="button" className="btn" disabled={!message} onClick={encrypt}>Submit</button>
          {/* <button type="button" className="btn ms-2" onClick={encrypt}>Decrypt</button> */}
        </div>
        <label htmlFor="exampleFormControlTextarea1" className="form-label fw-bold">Result</label>
        <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" readOnly value={result}></textarea>
      </div>
    </div>

    <div className="container pt-5">
      <div className="content">
        <h1 className="text-center fw-bold">Overview</h1>
        <h5 className='text-white fw-bold'>🔑 RSA (Rivest–Shamir–Adleman)</h5>
        <p>RSA is a public-key cryptographic system that enables secure data transmission. It is based on the mathematical difficulty of factoring large prime numbers. RSA uses a pair of keys: a public key to encrypt data and a private key to decrypt it. It is widely used for securing sensitive data, digital signatures, and key exchanges.
        Key Features:Asymmetric encryption (different keys for encryption and decryption).
        Provides confidentiality, authenticity, and integrity.
        Security depends on the difficulty of factoring large integers.

        </p>
      </div>
    </div>
  </>
}



// import React, { useState } from 'react'
// import "./RSA.css"
// import Home from '../Home/Home'
// export default function RSA() {
//   const [message, setMessage] = useState('')
//   const [cipherText, setCipherText] = useState('')
//   // const [decryptedText, setDecryptedText] = useState('')
//   const [publicKey, setPublicKey] = useState('')
//   const [privateKey, setPrivateKey] = useState('')
//   const [result, setResult] = useState('')

//   const encrypt = () => {
//     const p = 71, q = 73;
//     const cipherText = encryption(message, p, q);
//     const decryptedMessage = decryption(cipherText, p, q);

//     const key = keys(p, q);
//     setPublicKey(`(${key[0]}, ${key[1]})`);
//     setPrivateKey(`(${key[0]}, ${key[2]})`);
    
//     setResult(`Encrypted: ${cipherText.join(' ')}\nDecrypted: ${decryptedMessage}`);
//   }

//   const handleGenerateKeys = () => {
//     const p = 71, q = 73;
//     const key = keys(p, q);
//     setPublicKey(`(${key[0]}, ${key[1]})`);
//     setPrivateKey(`(${key[0]}, ${key[2]})`);
//   };

//   function encryption(message, p, q) {
//     const key = keys(p, q);
//     const ascii = [...message].map(char => char.charCodeAt(0));
//     const cipherText = ascii.map(num => modPow(BigInt(num), BigInt(key[1]), BigInt(key[0])));
//     return cipherText.map(n => Number(n));
//   }
  
//   function decryption(cipherText, p, q) {
//     const key = keys(p, q);
//     const decrypted = cipherText.map(num => {
//       const decryptedChar = modPow(BigInt(num), BigInt(key[2]), BigInt(key[0]));
//       return String.fromCharCode(Number(decryptedChar));
//     });
//     return decrypted.join('');
//   }

//   function keys(p, q) {
//     const n = p * q;
//     const euler = (p - 1) * (q - 1);
//     const e = getCoprimes(euler)[0];
//     const d = modInverse(e, n, euler);
//     return [n, e, d, euler];
//   }

//   function gcd(a, b) {
//     while (b !== 0) {
//       [a, b] = [b, a % b];
//     }
//     return a;
//   }

//   function modPow(base, exponent, mod) {
//     let result = 1n;
//     while (exponent > 0n) {
//       if (exponent % 2n === 1n) {
//         result = (result * base) % mod;
//       }
//       exponent = exponent / 2n;
//       base = (base * base) % mod;
//     }
//     return result;
//   }

//   function getCoprimes(euler) {
//     const coPrimes = [];
//     for (let i = 2; i < euler; i++) {
//       if (gcd(i, euler) === 1) coPrimes.push(i);
//     }
//     return coPrimes;
//   }

  
//   function keys(p,q) { // to generate keys
//     var n = 0, euler = 0, e = 0, d;
//     n = p * q;
//     let nums_e = [];
//     euler = ((p - 1) * (q - 1));
//     nums_e = getCoprimes(euler);
//     e = nums_e[0];
//     d = modInverse(e, n, euler);
//     let data_key = [n, e, d, euler];
//     return data_key;
//   }

//   function modInverse(e, n, euler) {
//     for (let x = 1; x < n; x++) {
//       if ((e * x) % euler === 1 && x !== e) return x;
//     }
//     throw new Error("No modular inverse found");
//   }
  
  // class LCG {
  //   constructor(seed, a = 1664525, c = 1013904223, m = 2 ** 32) {
  //     this._state = seed;
  //     this.a = a;
  //     this.c = c;
  //     this.m = m;
  //   }
  
  //   next() {
  //     this._state = (this.a * this._state + this.c) % this.m;
  //     return this._state;
  //   }
  // }
  
  // function isPrime(n) {
  //   if (n < 2) return false;
  //   for (let i = 2; i * i <= n; i++) {
  //     if (n % i === 0) return false;
  //   }
  //   return true;
  // }
  
  // function generatePrimeKey(lcg) {
  //   let key;
  //   do {
  //     key = lcg.next() % 999999;
  //   } while (!isPrime(key));
  //   return key;
  // }

//   return <>
//     <div className="container content-con  pt-4">
//       <h1 className="fw-bold text-center">RSA</h1>
//       <div className="container gen-con mb-3 p-0">
//         <div className="row d-flex justify-content-around">
//           <h4 className='fw-bold text-white'>Generate Keys</h4>
//           <div className="col-md-6 mb-4">
//             <div className="PublicKey pt-3 ">
//               <h6 className='fw-bold text-white'>Public Key</h6>
//               <div className="input-copy d-flex justify-content-center align-items-center">
//                 <input type="text" className='public-input form-control' readOnly value={publicKey} />
//                 <i className="fa-solid fa-copy fs-5 text-white"></i>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-6 mb-4">
//             <div className="PrivateKey pt-3">
//               <h6 className='fw-bold text-white'>Private Key</h6>
//               <div className="input-copy d-flex justify-content-center align-items-center">
//                 <input type="text" className='public-input form-control' readOnly value={privateKey} />
//                 <i className="fa-solid fa-copy fs-5 text-white"></i>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="generateBtn d-flex justify-content-start  ">
//           <button className='generate-btn btn fw-bold m-0' onClick={handleGenerateKeys} >Generate</button>
//         </div>
        
//       </div>
//       <div className="input-output">
//         <div className="form-group mb-3">
//           <label htmlFor="exampleFormControlInput1" className="form-label fw-bold">Enter Text</label>
//           <input type="text" className="form-control rsa-text" id="exampleFormControlInput1"  onChange={(e) => setMessage(e.target.value)} placeholder="Hello"/>
//           <button type="button" className="btn" onClick={encrypt}>Result</button>
//         </div>
//         <label htmlFor="exampleFormControlTextarea1" class="form-label fw-bold">Result</label>
//         <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" readOnly value={result}></textarea>
//       </div>
//     </div>
// </>
// }

// import React, { useState } from 'react';
// import "./RSA.css";
// export default function RSAEncryptor() {
//   const [message, setMessage] = useState("");
//   const [result, setResult] = useState("");
//   const [publicKey, setPublicKey] = useState("");
//   const [privateKey, setPrivateKey] = useState("");
//   const [p, setP] = useState(null);
//   const [q, setQ] = useState(null);

//   const handleGenerateKeys = () => {
//     const lcg = new LCG(Math.floor(Math.random() * 1000000));
//     let newP = generatePrimeKey(lcg);
//     let newQ = generatePrimeKey(lcg);
//     while (newP === newQ) {
//       newQ = generatePrimeKey(lcg);
//     }
//     setP(newP);
//     setQ(newQ);
//     const key = keys(newP, newQ);
//     setPublicKey(`(${key[0]}, ${key[1]})`);
//     setPrivateKey(`(${key[0]}, ${key[2]})`);
//   };

//   const handleEncrypt = () => {
//     if (!p || !q) {
//       setResult("Please generate keys first.");
//       return;
//     }
//     const cipherText = encryption(message, p, q);
//     const decryptedMessage = decryption(cipherText, p, q);
//     setResult(`Encrypted: ${cipherText.join(' ')}\nDecrypted: ${decryptedMessage}`);
//   };

//   return (
//     <div className="container content-con pt-4">
//       <h1 className="fw-bold text-center">RSA</h1>

//       <div className="container gen-con mb-3 p-0">
//         <div className="row d-flex justify-content-around">
//           <h4 className='fw-bold text-white'>Generate Keys</h4>

//           <div className="col-md-6 mb-4">
//             <div className="PublicKey pt-3">
//               <h6 className='fw-bold text-white'>Public Key</h6>
//               <div className="input-copy d-flex justify-content-center align-items-center">
//                 <input type="text" className='public-input form-control' value={publicKey} readOnly />
//                 <i className="fa-solid fa-copy fs-5 text-white"></i>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-6 mb-4">
//             <div className="PrivateKey pt-3">
//               <h6 className='fw-bold text-white'>Private Key</h6>
//               <div className="input-copy d-flex justify-content-center align-items-center">
//                 <input type="text" className='public-input form-control' value={privateKey} readOnly />
//                 <i className="fa-solid fa-copy fs-5 text-white"></i>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="generateBtn d-flex justify-content-start">
//           <button className='generate-btn btn fw-bold m-0' onClick={handleGenerateKeys}>Generate</button>
//         </div>
//       </div>

//       <div className="input-output">
//         <div className="form-group mb-3">
//           <label htmlFor="exampleFormControlInput1" className="form-label fw-bold">Enter Text</label>
//           <input
//             type="text"
//             className="form-control"
//             id="exampleFormControlInput1"
//             placeholder="Hello"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <button type="button" className="btn btn-primary mt-2" onClick={handleEncrypt}>Encrypt</button>
//         </div>

//         <label htmlFor="exampleFormControlTextarea1" className="form-label fw-bold">Result</label>
//         <textarea
//           className="form-control"
//           id="exampleFormControlTextarea1"
//           rows="3"
//           value={result}
//           readOnly
//         ></textarea>
//       </div>
//     </div>
//   );
// }

// class LCG {
//   constructor(seed, a = 1664525, c = 1013904223, m = 2 ** 32) {
//     this._state = seed;
//     this.a = a;
//     this.c = c;
//     this.m = m;
//   }

//   next() {
//     this._state = (this.a * this._state + this.c) % this.m;
//     return this._state;
//   }
// }

// function isPrime(n) {
//   if (n < 2) return false;
//   for (let i = 2; i * i <= n; i++) {
//     if (n % i === 0) return false;
//   }
//   return true;
// }

// function generatePrimeKey(lcg) {
//   let key;
//   do {
//     key = lcg.next() % 999999;
//   } while (!isPrime(key));
//   return key;
// }

// function encryption(message, p, q) {
//   const key = keys(p, q);
//   const ascii = [...message].map(char => char.charCodeAt(0));
//   const cipherText = ascii.map(num => modPow(BigInt(num), BigInt(key[1]), BigInt(key[0])));
//   return cipherText.map(n => Number(n));
// }

// function decryption(cipherText, p, q) {
//   const key = keys(p, q);
//   const decrypted = cipherText.map(num => {
//     const decryptedChar = modPow(BigInt(num), BigInt(key[2]), BigInt(key[0]));
//     return String.fromCharCode(Number(decryptedChar));
//   });
//   return decrypted.join('');
// }

// function keys(p, q) {
//   const n = p * q;
//   const euler = (p - 1) * (q - 1);
//   const e = getCoprimes(euler)[0];
//   const d = modInverse(e, n, euler);
//   return [n, e, d, euler];
// }

// function gcd(a, b) {
//   while (b !== 0) {
//     [a, b] = [b, a % b];
//   }
//   return a;
// }

// function getCoprimes(euler) {
//   const coPrimes = [];
//   for (let i = 2; i < euler; i++) {
//     if (gcd(i, euler) === 1) coPrimes.push(i);
//   }
//   return coPrimes;
// }

// function modInverse(e, n, euler) {
//   for (let x = 1; x < n; x++) {
//     if ((e * x) % euler === 1 && x !== e) return x;
//   }
//   throw new Error("No modular inverse found");
// }

// function modPow(base, exponent, mod) {
//   let result = 1n;
//   while (exponent > 0n) {
//     if (exponent % 2n === 1n) {
//       result = (result * base) % mod;
//     }
//     exponent = exponent / 2n;
//     base = (base * base) % mod;
//   }
//   return result;
// }
