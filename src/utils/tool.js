import CryptoJS from 'crypto-js'
import uploadConfig from '@/config/upload'
import CityLinkageJson from "@/components/ma-cityLinkage/lib/city.json"

const typeColor = (type = 'default') => {
  let color = ''
  switch (type) {
    case 'default': color = '#35495E'; break
    case 'primary': color = '#3488ff'; break
    case 'success': color = '#43B883'; break
    case 'warning': color = '#e6a23c'; break
    case 'danger': color = '#f56c6c'; break
    default: break
  }
  return color
}

const tool = {}

/**
 * LocalStorage
 */
tool.local = {
  set(table, settings) {
    let _set = JSON.stringify(settings)
    return localStorage.setItem(table, _set);
  },
  get(table) {
    let data = localStorage.getItem(table);
    try {
      data = JSON.parse(data)
    } catch (err) {
      return null
    }
    return data;
  },
  remove(table) {
    return localStorage.removeItem(table);
  },
  clear() {
    return localStorage.clear();
  }
}

/**
 * SessionStorage
 */
tool.session = {
  set(table, settings) {
    let _set = JSON.stringify(settings)
    return sessionStorage.setItem(table, _set);
  },
  get(table) {
    let data = sessionStorage.getItem(table);
    try {
      data = JSON.parse(data)
    } catch (err) {
      return null
    }
    return data;
  },
  remove(table) {
    return sessionStorage.removeItem(table);
  },
  clear() {
    return sessionStorage.clear();
  }
}

/**
 * CookieStorage
 */
tool.cookie = {
  set(name, value, config = {}) {
    var cfg = {
      expires: null,
      path: null,
      domain: null,
      secure: false,
      httpOnly: false,
      ...config
    }
    var cookieStr = `${name}=${escape(value)}`
    if (cfg.expires) {
      var exp = new Date()
      exp.setTime(exp.getTime() + parseInt(cfg.expires) * 1000)
      cookieStr += `;expires=${exp.toGMTString()}`
    }
    if (cfg.path) {
      cookieStr += `;path=${cfg.path}`
    }
    if (cfg.domain) {
      cookieStr += `;domain=${cfg.domain}`
    }
    document.cookie = cookieStr
  },
  get(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"))
    if (arr != null) {
      return unescape(arr[2])
    } else {
      return null
    }
  },
  remove(name) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    document.cookie = `${name}=;expires=${exp.toGMTString()}`
  }
}

/* Fullscreen */
tool.screen = (element) => {
  let isFull = !!(document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
  if (isFull) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  } else {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
  }
}

// 城市代码翻译成名称
tool.cityToCode = function(province, city = undefined, area = undefined, split = ' / ') {
  try {
    let provinceData = CityLinkageJson.filter(item => province == item.code)[0]
    if (! city) {
      return provinceData.name
    }
    let cityData = provinceData.children.filter(item => city == item.code)[0]

    if (! area) {
      return [provinceData.name, cityData.name].join(split)
    }
    let areaData = cityData.children.filter(item => area == item.code)[0]

    return [provinceData.name, cityData.name, areaData.name].join(split)
  } catch (e) {
    return ''
  }
}

/* 复制对象 */
tool.objCopy = (obj) => {
  if (obj === undefined) {
    return undefined
  }
  return JSON.parse(JSON.stringify(obj));
}

tool.generateId = function() {
  return Math.floor(Math.random() * 100000 + Math.random() * 20000 + Math.random() * 5000)
}

tool.viewImage = function(path, defaultStorage = 'LOCAL') {
  let mode = tool.local.get('site_storage_mode') ? tool.local.get('site_storage_mode').toUpperCase() : defaultStorage
  return uploadConfig.storage[mode] + path
}

/* 日期格式化 */
tool.dateFormat = (date, fmt = 'yyyy-MM-dd hh:mm:ss', isDefault = '-') => {
  if (date.toString().length == 10) {
    date = date * 1000
  }
  date = new Date(date)

  if (date.valueOf() < 1) {
    return isDefault
  }
  let o = {
    "M+": date.getMonth() + 1,                 //月份
    "d+": date.getDate(),                    //日
    "h+": date.getHours(),                   //小时
    "m+": date.getMinutes(),                 //分
    "s+": date.getSeconds(),                 //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

/* 千分符 */
tool.groupSeparator = (num) => {
  num = num + '';
  if (!num.includes('.')) {
    num += '.'
  }
  return num.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
    return $1 + ',';
  }).replace(/\.$/, '');
}

tool.md5 = (str) => {
  return CryptoJS.MD5(str).toString()
}

tool.base64 = {
  encode(data) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data))
  },
  decode(cipher) {
    return CryptoJS.enc.Base64.parse(cipher).toString(CryptoJS.enc.Utf8)
  }
}

tool.aes = {
  encode(data, secretKey) {
    const result = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(secretKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return result.toString()
  },
  decode(cipher, secretKey) {
    const result = CryptoJS.AES.decrypt(cipher, CryptoJS.enc.Utf8.parse(secretKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return CryptoJS.enc.Utf8.stringify(result);
  }
}

tool.capsule = (title, info, type = 'primary') => {
  console.log(
    `%c ${title} %c ${info} %c`,
    'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
    `background:${typeColor(type)}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
    'background:transparent'
  )
}

tool.formatSize = (size) => {
  if (typeof size == 'undefined') {
    return '0';
  }
  let units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  let index = 0
  for (let i = 0; size >= 1024 && i < 5; i++) {
    size /= 1024
    index = i
  }
  return Math.round(size, 2) + units[index]
}

tool.download = (res, downName = '') => {
  const aLink = document.createElement('a');
  let fileName = downName
  let blob = res //第三方请求返回blob对象

  //通过后端接口返回
  if (res.headers && res.data) {
    blob = new Blob([res.data], {type: res.headers['content-type'].replace(';charset=utf8', '')})
    if (!downName) {
        const contentDisposition = decodeURI(res.headers['content-disposition'])
        const result = contentDisposition.match(/filename\*=utf-8\'\'(.+)/gi)
        fileName = result[0].replace(/filename\*=utf-8\'\'/gi, '')
    }
  }
  
  aLink.href = URL.createObjectURL(blob)
  // 设置下载文件名称
  aLink.setAttribute('download', fileName)
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
  URL.revokeObjectURL(aLink.href)
}

/**
 * 对象转url参数
 * @param {*} data
 * @param {*} isPrefix
 */
tool.httpBuild = (data, isPrefix = false) => {
  let prefix = isPrefix ? '?' : ''
  let _result = []
  for (let key in data) {
    let value = data[key]
    // 去掉为空的参数
    if (['', undefined, null].includes(value)) {
      continue
    }
    if (value.constructor === Array) {
      value.forEach(_value => {
        _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
      })
    } else {
      _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
    }
  }

  return _result.length ? prefix + _result.join('&') : ''
}

tool.getRequestParams = (url) => {
  const theRequest = new Object()
  if (url.indexOf('?') != -1) {
    const params = url.split('?')[1].split('&')
    for (let i = 0; i < params.length; i++) {
      const param = params[i].split('=')
      theRequest[param[0]] = decodeURIComponent(param[1])
    }
  }
  return theRequest
}

tool.attachUrl = (path, defaultStorage = 'LOCAL') => {
	return uploadConfig.storage[defaultStorage] + path
}

/**
 * 获取token
 */
tool.getToken = () => {
  return tool.local.get('token')
}
/**
 * 转Unix时间戳
 */

tool.toUnixTime = (date) => {
  return Math.floor((new Date(date)).getTime() / 1000)
}

tool.arrSum = (arr) => {
  let sum = 0
  arr.map(item => sum += item)
  return sum
}

export default tool
