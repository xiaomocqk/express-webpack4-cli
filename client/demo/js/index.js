import '../styles/common.css';
import '../styles/index.less';
import { abc } from '../proxy';
import '../utils/common';

// const userless = 'userless';
console.log('hello, webpack 4~');
console.log('[mode] ' + process.env.NODE_ENV);

// // 测试结果: if内部所有代码将不会被打包, 包括require/import同、异步引用也不会被打包成文件
if (process.env.NODE_ENV !== 'production') {
  const vue_async = resolve => require(['vue'], resolve);

  // 测试结果: 这里的 vue 不会被打包成文件
  vue_async(Vue =>{
    new Vue({
      el: '#app'
    });
    console.log(Vue);
  });
  console.log('这是开发环境===222');
  require('../views/index.html');
  console.log('哈哈哈123ooo1');
  
}

// // 测试结果: 这里的 vue-router 会被打包成文件
const vueRouter_async = () => import('vue-router');
vueRouter_async().then(data =>{
  const VueRouter = data.default;
  new VueRouter();
});

// // console.log(ab)
let fn = num => num+2;

// window._s = 1;
window._s = 22222;
window._s ++;

function bar(url = '') {
  return url += '__';
}

function foo(...args) {
  return args[0] + args[1];
}

const imgEl = document.createElement('img');
imgEl.src = require('../images/logo.png');
imgEl.alt = '111';
document.body.appendChild(imgEl);

const div = document.createElement('div');
div.innerHTML = '<span>测试</span>';
document.getElementById('app').appendChild(div);

console.log(fn(100));
console.log(bar('www'));// 测试参数默认值
console.log(foo(1, 2));// 测试 rest 参数
console.log(abc);// 测试 tree-shaking
