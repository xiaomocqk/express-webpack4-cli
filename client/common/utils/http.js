/* eslint-disable */

// import Promise from './promise';

/**
 * 
 * @param {Object} option 
 * @param {string='GET'} option.type 
 * @param {string} option.url 
 * @param {Object} option.data 
 * @param {Object?} option.headers 
 * @param {boolean=true} option.async 
 * @param {Function} option.success 
 * @param {Function} option.error 
 */
export default function http(option) {
  // return new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();

  let type = option.type ? option.type.toUpperCase() : 'GET';
  let isGet = type === 'GET';
  let data = option.data;

  if (isGet) {
    let arr = [];
    for (let key in data) {
      arr.push(key + '=' + encodeURIComponent(data[key]));
    }
    option.url += arr.length ? '?' + arr.join('&') : '';
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 400) {
        // resolve(xhr.response);
        option.success && option.success(xhr.response);
      } else {
        // console.warn('Somthing was wrong.');
        // reject(xhr.response);
        option.error && option.error(xhr.response);
      }
    }
  };

  if (typeof option.async === 'undefined') {
    option.async = true;
  }
  xhr.open(type, option.url, option.async || true);

  //设置请求头，请求头的设置必须在xhr打开之后，并且在send之前
  if (option.headers) {
    for (const key in option.headers) {
      xhr.setRequestHeader(key, option.headers[key]);
    }
  }

  let dataString = JSON.stringify(data);
  if (!isGet) {
    xhr.setRequestHeader('Content-Length', dataString.length + 1);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  }

  xhr.send(isGet ? null : dataString);
  // });
}