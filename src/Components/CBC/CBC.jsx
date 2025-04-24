import React from 'react'
import "./CBC.css"
import Home from '../Home/Home'
export default function CBC() {

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
    <Home/>
    </>
}
