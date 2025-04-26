import React, { useState } from 'react';

function Sha1Encryptor() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  function rotateLeft(value, shift) {
    return ((value << shift) | (value >>> (32 - shift))) >>> 0;
  }

  function sha1(message) {
    const msgInBytes = Array.from(new TextEncoder().encode(message));
    const originalLength = msgInBytes.length * 8;

    // Add the bit '1' to the message
    msgInBytes.push(0x80);

    // Pad with zeros until length ≡ 448 mod 512
    while ((msgInBytes.length * 8) % 512 !== 448) {
      msgInBytes.push(0x00);
    }

    // Append original length in bits mod 2^64 to message
    const lengthBytes = new Uint8Array(8);
    const dataView = new DataView(lengthBytes.buffer);
    dataView.setUint32(4, originalLength, false); // only 32-bit supported for small messages
    msgInBytes.push(...lengthBytes);

    // Initialize variables
    let h0 = 0x67452301;
    let h1 = 0xEFCDAB89;
    let h2 = 0x98BADCFE;
    let h3 = 0x10325476;
    let h4 = 0xC3D2E1F0;

    for (let i = 0; i < msgInBytes.length; i += 64) {
      const w = new Array(80).fill(0);

      // Break chunk into sixteen 32-bit big-endian words
      for (let j = 0; j < 16; j++) {
        w[j] = (msgInBytes[i + j * 4] << 24) |
               (msgInBytes[i + j * 4 + 1] << 16) |
               (msgInBytes[i + j * 4 + 2] << 8) |
               (msgInBytes[i + j * 4 + 3]);
      }

      // Extend to 80 words
      for (let j = 16; j < 80; j++) {
        w[j] = rotateLeft(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
      }

      let a = h0;
      let b = h1;
      let c = h2;
      let d = h3;
      let e = h4;

      for (let j = 0; j < 80; j++) {
        let f, k;
        if (j < 20) {
          f = (b & c) | ((~b) & d);
          k = 0x5A827999;
        } else if (j < 40) {
          f = b ^ c ^ d;
          k = 0x6ED9EBA1;
        } else if (j < 60) {
          f = (b & c) | (b & d) | (c & d);
          k = 0x8F1BBCDC;
        } else {
          f = b ^ c ^ d;
          k = 0xCA62C1D6;
        }

        const temp = (rotateLeft(a, 5) + f + e + k + w[j]) >>> 0;
        e = d;
        d = c;
        c = rotateLeft(b, 30);
        b = a;
        a = temp;
      }

      h0 = (h0 + a) >>> 0;
      h1 = (h1 + b) >>> 0;
      h2 = (h2 + c) >>> 0;
      h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0;
    }

    // Produce the final hash value (big-endian) as a hex string
    const digest = [h0, h1, h2, h3, h4]
      .map(h => [
        (h >>> 24) & 0xFF,
        (h >>> 16) & 0xFF,
        (h >>> 8) & 0xFF,
        h & 0xFF,
      ])
      .flat()
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return digest;
  }

  function handleEncrypt() {
    const hash = sha1(text);
    setResult(hash);
  }

  return (
    <div className="container content-con pt-4">
      <h1 className="fw-bold text-center">SHA-1</h1>
      <div className="form-group mb-3">
        <label htmlFor="textInput" className="form-label fw-bold">Enter Text</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setText(e.target.value)}
          value={text}
          id="textInput"
          placeholder="Hello"
        />
        <button
          type="button"
          onClick={handleEncrypt}
          disabled={!text}
          className="btn mt-2"
        >
          Encrypt
        </button>
      </div>
      <div className="mb-3">
        <label htmlFor="resultTextarea" className="form-label fw-bold">Result</label>
        <textarea
          className="form-control"
          value={result}
          id="resultTextarea"
          readOnly
          rows="3"
        />
      </div>
    </div>
  );
}

export default Sha1Encryptor;

// import React, { useState } from 'react';

// function rotateLeft(value, shift) {
//   return ((value << shift) | (value >>> (32 - shift))) >>> 0;
// }

// function sha1(message) {
//   const msgInBytes = new TextEncoder().encode(message);
//   const msg = Array.from(msgInBytes);

//   const originalLength = msg.length * 8;

//   msg.push(0x80);
//   while ((msg.length * 8) % 512 !== 448) {
//     msg.push(0x00);
//   }

//   const lengthBytes = new Array(8).fill(0);
//   for (let i = 0; i < 8; i++) {
//     lengthBytes[7 - i] = (originalLength >>> (i * 8)) & 0xFF;
//   }

//   msg.push(...lengthBytes);

//   let h0 = 0x67452301;
//   let h1 = 0xEFCDAB89;
//   let h2 = 0x98BADCFE;
//   let h3 = 0x10325476;
//   let h4 = 0xC3D2E1F0;

//   for (let i = 0; i < msg.length; i += 64) {
//     const w = new Array(80).fill(0);
//     for (let j = 0; j < 16; j++) {
//       w[j] =
//         (msg[i + j * 4] << 24) |
//         (msg[i + j * 4 + 1] << 16) |
//         (msg[i + j * 4 + 2] << 8) |
//         msg[i + j * 4 + 3];
//     }

//     for (let j = 16; j < 80; j++) {
//       w[j] = rotateLeft(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
//     }

//     let a = h0;
//     let b = h1;
//     let c = h2;
//     let d = h3;
//     let e = h4;

//     for (let j = 0; j < 80; j++) {
//       let f, k;
//       if (j < 20) {
//         f = (b & c) | (~b & d);
//         k = 0x5A827999;
//       } else if (j < 40) {
//         f = b ^ c ^ d;
//         k = 0x6ED9EBA1;
//       } else if (j < 60) {
//         f = (b & c) | (b & d) | (c & d);
//         k = 0x8F1BBCDC;
//       } else {
//         f = b ^ c ^ d;
//         k = 0xCA62C1D6;
//       }

//       const temp = (rotateLeft(a, 5) + f + e + k + w[j]) >>> 0;
//       e = d;
//       d = c;
//       c = rotateLeft(b, 30);
//       b = a;
//       a = temp;
//     }

//     h0 = (h0 + a) >>> 0;
//     h1 = (h1 + b) >>> 0;
//     h2 = (h2 + c) >>> 0;
//     h3 = (h3 + d) >>> 0;
//     h4 = (h4 + e) >>> 0;
//   }

//   const digest = [h0, h1, h2, h3, h4].map(h =>
//     [h >>> 24, (h >>> 16) & 0xFF, (h >>> 8) & 0xFF, h & 0xFF]
//   ).flat();

//   return digest.map(b => b.toString(16).padStart(2, '0')).join('');
// }

// const SHA1Encryptor = () => {
//   const [text, setText] = useState('');
//   const [result, setResult] = useState('');

//   const handleEncrypt = () => {
//     const hashed = sha1(text);
//     setResult(hashed);
//   };

//   return (
//     <>
//       <div className="container content-con pt-4">
//         <h1 className="fw-bold text-center">SHA-1</h1>
//         <div className="form-group mb-3">
//           <label htmlFor="textInput" className="form-label fw-bold">Enter Text</label>
//           <input
//             type="text"
//             className="form-control"
//             onChange={(e) => setText(e.target.value)}
//             value={text}
//             id="textInput"
//             placeholder="Hello"
//           />
//           <button
//             type="button"
//             onClick={handleEncrypt}
//             disabled={!text}
//             className="btn mt-2"
//           >
//             Encrypt
//           </button>
//         </div>
//         <div className="mb-3">
//           <label htmlFor="resultTextarea" className="form-label fw-bold">Result</label>
//           <textarea
//             className="form-control"
//             value={result}
//             id="resultTextarea"
//             readOnly
//             rows="3"
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default SHA1Encryptor;

// import React, { useState } from 'react';

// function rotateLeft(value, shift) {
//   return ((value << shift) | (value >>> (32 - shift))) >>> 0;
// }

// function sha1(message) {
//   const msgInBytes = new TextEncoder().encode(message);
//   const msg = Array.from(msgInBytes);

//   const originalLength = msg.length * 8;

//   // إضافة 0x80 للحشو
//   msg.push(0x80);

//   // إضافة بايتات 0x00 حتى يصل الطول إلى 448 بت
//   while ((msg.length * 8) % 512 !== 448) {
//     msg.push(0x00);
//   }

//   // إضافة طول الرسالة الأصلية في النهاية (8 بايت)
//   const lengthBytes = new Array(8).fill(0);
//   for (let i = 0; i < 8; i++) {
//     lengthBytes[7 - i] = (originalLength >>> (i * 8)) & 0xFF;
//   }

//   msg.push(...lengthBytes);

//   let h0 = 0x67452301;
//   let h1 = 0xEFCDAB89;
//   let h2 = 0x98BADCFE;
//   let h3 = 0x10325476;
//   let h4 = 0xC3D2E1F0;

//   // معالجة الكتل (64 بايت لكل كتلة)
//   for (let i = 0; i < msg.length; i += 64) {
//     const w = new Array(80).fill(0);
//     for (let j = 0; j < 16; j++) {
//       w[j] =
//         (msg[i + j * 4] << 24) |
//         (msg[i + j * 4 + 1] << 16) |
//         (msg[i + j * 4 + 2] << 8) |
//         msg[i + j * 4 + 3];
//     }

//     for (let j = 16; j < 80; j++) {
//       w[j] = rotateLeft(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
//     }

//     let a = h0;
//     let b = h1;
//     let c = h2;
//     let d = h3;
//     let e = h4;

//     for (let j = 0; j < 80; j++) {
//       let f, k;
//       if (j < 20) {
//         f = (b & c) | (~b & d);
//         k = 0x5A827999;
//       } else if (j < 40) {
//         f = b ^ c ^ d;
//         k = 0x6ED9EBA1;
//       } else if (j < 60) {
//         f = (b & c) | (b & d) | (c & d);
//         k = 0x8F1BBCDC;
//       } else {
//         f = b ^ c ^ d;
//         k = 0xCA62C1D6;
//       }

//       const temp = (rotateLeft(a, 5) + f + e + k + w[j]) >>> 0;
//       e = d;
//       d = c;
//       c = rotateLeft(b, 30);
//       b = a;
//       a = temp;
//     }

//     h0 = (h0 + a) >>> 0;
//     h1 = (h1 + b) >>> 0;
//     h2 = (h2 + c) >>> 0;
//     h3 = (h3 + d) >>> 0;
//     h4 = (h4 + e) >>> 0;
//   }

//   const digest = [h0, h1, h2, h3, h4].map(h =>
//     [h >>> 24, (h >>> 16) & 0xFF, (h >>> 8) & 0xFF, h & 0xFF]
//   ).flat();

//   return digest.map(b => b.toString(16).padStart(2, '0')).join('');
// }

// const SHA1Encryptor = () => {
//   const [text, setText] = useState('');
//   const [result, setResult] = useState('');

//   const handleEncrypt = () => {
//     const hashed = sha1(text);
//     setResult(hashed);
//   };

//   return (
//     <>
//       <div className="container content-con pt-4">
//         <h1 className="fw-bold text-center">SHA-1</h1>
//         <div className="form-group mb-3">
//           <label htmlFor="textInput" className="form-label fw-bold">Enter Text</label>
//           <input
//             type="text"
//             className="form-control"
//             onChange={(e) => setText(e.target.value)}
//             value={text}
//             id="textInput"
//             placeholder="Hello"
//           />
//           <button
//             type="button"
//             onClick={handleEncrypt}
//             disabled={!text}
//             className="btn mt-2"
//           >
//             Encrypt
//           </button>
//         </div>
//         <div className="mb-3">
//           <label htmlFor="resultTextarea" className="form-label fw-bold">Result</label>
//           <textarea
//             className="form-control"
//             value={result}
//             id="resultTextarea"
//             readOnly
//             rows="3"
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default SHA1Encryptor;
