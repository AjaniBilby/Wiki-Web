var module = {
  exports: {}
};


(function(){
  var element = document.createElement('div');
  element.style.position = 'fixed';
  element.style.top = '0px';
  element.style.bottom = '30px';
  element.style.right = '0px';
  element.style.width = '300px';
  element.style['padding-top'] = '10px';
  element.style['font-family'] = "Calibre, Liberation Sans, Arial";


  module.exports.message = class{
    constructor(string, timeout){
      if (timeout === undefined){
        timeout = string.length * 100;
      }

      var self = this;
      this.s = string;
      this.t = setTimeout(function () {
        self.destroy();
      }, timeout);

      this.e = document.createElement('div');
      this.e.style.display = "block";
      this.e.style.padding = "5px 0px 0px 0px";
      this.e.style['background-color'] = "rgba(255,255,255,.5)";
      this.e.innerHTML = this.s;
      element.appendChild(this.e);
    }

    append(){}
    destroy(){
      clearTimeout(this.t);
      element.removeChild(this.e);

      delete this;
    }
  };

  window.onload = function(){
    console.log('Document loaded');
    document.body.appendChild(element);
  };
})();


var logger = module.exports;
