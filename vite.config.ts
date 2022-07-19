/*
 * @Descripttion: 
 * @version: 
 * @Author: 刘译蓬
 * @Date: 2022-07-15 15:23:55
 * @LastEditors: 刘译蓬
 * @LastEditTime: 2022-07-17 21:46:57
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // base:'/labPage/grassTestPage/', // hexo服务器路径
  server:{
    host: '0.0.0.0',
 },
  plugins: [react()]
})
