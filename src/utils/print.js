// 打印类属性、方法定义
/* eslint-disable */

class Print
{
  dom = null

  options = {}

  constructor (dom, options = {}) {
    // if (!(this instanceof Print)) return new Print(dom, options)

    this.options = this.extend({ 'noPrint': '.no-print' }, options)

    if ( typeof dom === 'string' ) {
      try {
        this.dom = document.querySelector(dom)
      } catch {
        this.dom = document.createElement('div')
        this.dom.innerHTML = dom
      }
    } else {
      this.isDOM(dom)
      this.dom = this.isDOM(dom) ? dom : dom.$el
    }

    this.init()
  }

  init () {
    this.writeIframe(this.getStyle() + this.getHtml())
  }

  extend (obj, obj2) {
    for (let key in obj2) {
      obj[key] = obj2[key]
    }
    return obj
  }

  getStyle () {
    let str = '', styles = document.querySelectorAll('style,link')
    for (let i = 0; i < styles.length; i++) {
      str += styles[i].outerHTML
    }
    str += '<style>' + (this.options.noPrint ? this.options.noPrint : '.no-print') + '{ display: none; }</style>'
    str += '<style>html, body{ background-color: #fff; }</style>'
    return str
  }

  getHtml () {
    const inputs = document.querySelectorAll('input');
    const textAreas = document.querySelectorAll('textarea');
    const selects = document.querySelectorAll('select');

    for (let k = 0; k < inputs.length; k++) {
      if (inputs[k].type === 'checkbox' || inputs[k].type === 'radio') {
        if (inputs[k].checked === true) {
          inputs[k].setAttribute('checked', "checked")
        } else {
          inputs[k].removeAttribute('checked')
        }
      } else if (inputs[k].type === 'text') {
        inputs[k].setAttribute('value', inputs[k].value)
      } else {
        inputs[k].setAttribute('value', inputs[k].value)
      }
    }

    for (let k = 0; k < textAreas.length; k++) {
      if (textAreas[k].type === 'textarea') {
        textAreas[k].innerHTML = textAreas[k].value
      }
    }

    for (let k = 0; k < selects.length; k++) {
      if (selects[k].type === 'select-one') {
        let child = selects[k].children;
        for (let i in child) {
          if (child[i].tagName === 'OPTION') {
            if (child[i].selected === true) {
              child[i].setAttribute('selected', "selected")
            } else {
              child[i].removeAttribute('selected')
            }
          }
        }
      }
    }

    return this.dom.outerHTML
  }

  writeIframe (content) {
    let w, doc, iframe = document.createElement('iframe'), f = document.body.appendChild(iframe)
    iframe.id = 'myIframe'
    iframe.setAttribute('style', 'position:absolute; width:0; height:0; top:-10px; left:-10px;')
    w = f.contentWindow ?? f.contentDocument
    doc = f.contentDocument ?? f.contentWindow.document
    doc.open()
    doc.write(content)
    doc.close()
    const _this = this
    iframe.onload = () => {
      _this.toPrint(w)
      setTimeout(() => { document.body.removeChild(iframe) }, 100)
    }
  }

  toPrint (frameWindow) {
    try {
      setTimeout(() => {
        frameWindow.focus()
        try {
          if (! frameWindow.document.execCommand('print', false, null)) {
            frameWindow.print()
          }
        } catch (e) {
          frameWindow.print()
        }
        frameWindow.close()
      }, 10)
    } catch (err) {
      console.log('err', err)
    }
  }

  isDOM (obj) {
    return (typeof HTMLElement === 'object')
      ? obj instanceof HTMLElement
      : obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'
  }
}

export default Print
