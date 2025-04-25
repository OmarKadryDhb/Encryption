import React, { useState } from 'react'
import "./SHA1.css"
export default function SHA1() {
    const [text , setText] = useState('');
    const [result , setResult] = useState('');

    function sha(msg) {
        function rotateLeft(n, s) {
            return (n << s) | (n >>> (32 - s));
        }
        function toHex(val) {
            return ("00000000" + val.toString(16)).slice(-8);
        }

        // Convert the message to bytes
        const msgBytes = new TextEncoder().encode(msg);
        const msgLenBits = msgBytes.length * 8;

        // Padding
        let wordArray = [];
        for (let i = 0; i < msgBytes.length; i++) {
            wordArray[i >> 2] |= msgBytes[i] << (24 - (i % 4) * 8);
        }
        wordArray[msgBytes.length >> 2] |= 0x80 << (24 - (msgBytes.length % 4) * 8);

    
        wordArray[((msgLenBits + 64 >> 9) << 4) + 15] = msgLenBits;

        // Initialize the hash
        let H0 = 0x67452301;
        let H1 = 0xEFCDAB89;
        let H2 = 0x98BADCFE;
        let H3 = 0x10325476;
        let H4 = 0xC3D2E1F0;

        // Process the message
        for (let i = 0; i < wordArray.length; i += 16) {
            let W = [];
            for (let t = 0; t < 16; t++) W[t] = wordArray[i + t];
            for (let t = 16; t < 80; t++) {
                W[t] = rotateLeft(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
            }

            let a = H0, b = H1, c = H2, d = H3, e = H4;

            for (let t = 0; t < 80; t++) {
                let f, k;
                if (t < 20) {
                    f = (b & c) | (~b & d);
                    k = 0x5A827999;
                } else if (t < 40) {
                    f = b ^ c ^ d;
                    k = 0x6ED9EBA1;
                } else if (t < 60) {
                    f = (b & c) | (b & d) | (c & d);
                    k = 0x8F1BBCDC;
                } else {
                    f = b ^ c ^ d;
                    k = 0xCA62C1D6;
                }

                let temp = (rotateLeft(a, 5) + f + e + k + W[t]) >>> 0;
                e = d;
                d = c;
                c = rotateLeft(b, 30) >>> 0;
                b = a;
                a = temp;
            }

            H0 = (H0 + a) >>> 0;
            H1 = (H1 + b) >>> 0;
            H2 = (H2 + c) >>> 0;
            H3 = (H3 + d) >>> 0;
            H4 = (H4 + e) >>> 0;
        }

        return toHex(H0) + toHex(H1) + toHex(H2) + toHex(H3) + toHex(H4);
    }

    const handleEncrypt = () => {
        const encrypted = sha(text);
        setResult(encrypted);
    }
    



return <>
    <div className="container content-con pt-4">
        <h1 className="fw-bold text-center">SHA-1</h1>
        <div className="form-group mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label fw-bold">Enter Text</label>
            <input type="text" className="form-control" onChange={(e) => setText(e.target.value)} value={text} id="exampleFormControlInput1" placeholder="Hello"/>
            <button type="button" onClick={handleEncrypt} className="btn">Encrypt</button>
        </div>
        <div className="mb-3">
            <label htmlFor="exampleFormControlTextarea1" className="form-label fw-bold">Result</label>
            <textarea className="form-control" value={result} id="exampleFormControlTextarea1" readOnly rows="3"></textarea>
        </div>
    </div>
</>
}
