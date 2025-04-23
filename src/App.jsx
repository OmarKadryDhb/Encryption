import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './Components/Home/Home.jsx';
import './App.css';
import Layout from './Components/Layout/Layout.jsx';
import CBC from './Components/CBC/CBC.jsx';
import RSA from './Components/RSA/RSA.jsx';
import SHA1 from './Components/SHA1/SHA1.jsx';

const myRouter = createBrowserRouter([
  {path:"/Encryption",element:<Layout/>,children:[
  {path:"",element:
    <Home/>
  },
  {path:"Home",element:
    <Home/>
  },
  {path:"CBC",element:
    <CBC/>  
  },
  {path:"SHA-1",element:
    <SHA1/>
  },
  {path:"RSA",element:
    <RSA/>
  }
  ]}
])
function App() {

  let queryClient = new QueryClient();

  return <>
  <QueryClientProvider client={queryClient}>
  
  <RouterProvider router={myRouter}/>
  
  </QueryClientProvider>

  </>
}

export default App;
