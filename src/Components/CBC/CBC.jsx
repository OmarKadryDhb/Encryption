import React from 'react'
import "./CBC.css"
import Home from '../Home/Home'
export default function CBC() {
    // let key;
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
    return <>
    <div className="container content-con pt-4">
        <h1 class="fw-bold text-center">CBC</h1>
        <div class="form-group mb-3">
            <label for="exampleFormControlInput1" class="form-label fw-bold">Enter Text</label>
            <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Hello"/>
            <button type="button" class="btn">Encrypt</button>
        </div>
        <div class="mb-3">
            <label for="exampleFormControlTextarea1" class="form-label fw-bold">Result</label>
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
        </div>
    </div>
    </>
}
