/*
 * @Descripttion: 
 * @version: 
 * @Author: 刘译蓬
 * @Date: 2022-07-15 15:23:55
 * @LastEditors: 刘译蓬
 * @LastEditTime: 2022-07-15 23:41:00
 */
import { useEffect, useRef, useState } from 'react'
import './App.css'
import threeAssets from './utils/threeAssets';
function App() {
  const threeCanvas = useRef<HTMLCanvasElement>(null)
  useEffect(()=>{
    const three = new threeAssets(threeCanvas.current);
  },[])
  return (
    <canvas ref={threeCanvas}/>
  )
}

export default App
