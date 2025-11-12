(function (global) {
  const utils = {};

  function query(selector) {
    if (typeof selector === "string") {
      return Array.from(document.querySelectorAll(selector));
    }
    if (selector instanceof HTMLElement) {
      return [selector];
    }
    return Array.from(selector);
  }

  function animate(element, properties, duration = 400, easing = "linear", callback) {
    const startStyles = {};
    const unitStyles = {};
    const target = {};
    for (let prop in properties) {
      startStyles[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
      unitStyles[prop] = properties[prop].toString().replace(/[\d.-]/g, "");
      target[prop] = parseFloat(properties[prop]);
    }

    let startTime = performance.now();

    function step(time) {
      let progress = (time - startTime) / duration;
      progress = Math.min(progress, 1);

      if (easing === "ease-in") progress = progress * progress;
      if (easing === "ease-out") progress = 2 - (2 - progress) * progress;

      for (let prop in properties) {
        element.style[prop] = startStyles[prop] + (target[prop] - startStyles[prop]) * progress + unitStyles[prop];
      }

      if (progress < 1) requestAnimationFrame(step);
      else if (callback) callback();
    }

    requestAnimationFrame(step);
  }

  function IWO(selector) {
    this.elements = query(selector);
  }

  IWO.prototype.css = function (styles) {
    if (typeof styles === "object") {
      this.elements.forEach((el) => {
        for (let prop in styles) {
          el.style[prop] = styles[prop];
        }
      });
    } else if (typeof styles === "string" && arguments.length > 1) {
      this.elements.forEach((el) => {
        el.style[styles] = arguments[1];
      });
    }
    return this;
  };

  IWO.prototype.addClass = function (className) {
    this.elements.forEach((el) => el.classList.add(className));
    return this;
  };

  IWO.prototype.removeClass = function (className) {
    this.elements.forEach((el) => el.classList.remove(className));
    return this;
  };

  IWO.prototype.toggleClass = function (className) {
    this.elements.forEach((el) => el.classList.toggle(className));
    return this;
  };

  IWO.prototype.on = function (event, callback, options = {}) {
    this.elements.forEach((el) => el.addEventListener(event, callback, options));
    return this;
  };

  IWO.prototype.off = function (event, callback, options = {}) {
    this.elements.forEach((el) => el.removeEventListener(event, callback, options));
    return this;
  };

  IWO.prototype.html = function (html) {
    if (html !== undefined) {
      this.elements.forEach((el) => (el.innerHTML = html));
      return this;
    }
    return this.elements[0]?.innerHTML;
  };

  IWO.prototype.text = function (text) {
    if (text !== undefined) {
      this.elements.forEach((el) => (el.textContent = text));
      return this;
    }
    return this.elements[0]?.textContent;
  };

  IWO.prototype.ajax = function ({
    url,
    method = "GET",
    data = null,
    headers = {},
    success,
    error,
    timeout = 0,
    dataType = "json",
  }) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);

      for (let header in headers) {
        xhr.setRequestHeader(header, headers[header]);
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          let response = xhr.responseText;
          if (xhr.status >= 200 && xhr.status < 300) {
            if (xhr.getResponseHeader("Content-Type")?.includes("application/json") && dataType === "json") {
              try {
                response = JSON.parse(response);
              } catch (err) {
                reject(`Error parsing JSON: ${err.message}`);
                if (error) error(err);
                return;
              }
            }
            resolve(response);
            if (success) success(response);
          } else {
            reject(xhr);
            if (error) error(xhr);
          }
        }
      };

      if (timeout > 0) {
        xhr.timeout = timeout;
        xhr.ontimeout = function () {
          reject(new Error("Request timed out"));
          if (error) error(new Error("Request timed out"));
        };
      }

      xhr.send(data);
    });
  };

  IWO.prototype.fadeIn = function (duration = 400) {
    this.elements.forEach((el) => {
      el.style.opacity = 0;
      el.style.display = "block";
      animate(el, { opacity: 1 }, duration);
    });
    return this;
  };

  IWO.prototype.fadeOut = function (duration = 400) {
    this.elements.forEach((el) => {
      animate(el, { opacity: 0 }, duration, "linear", () => (el.style.display = "none"));
    });
    return this;
  };

  IWO.prototype.slideUp = function (duration = 400) {
    this.elements.forEach((el) => {
      el.offsetHeight;
      animate(el, { height: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 }, duration, "linear", () => {
        el.style.display = "none";
      });
    });
    return this;
  };

  IWO.prototype.slideDown = function (duration = 400) {
    this.elements.forEach((el) => {
      el.style.display = "";
      const height = el.scrollHeight;
      el.style.height = 0;
      animate(el, { height }, duration);
    });
    return this;
  };

  IWO.prototype.delegate = function (selector, event, callback) {
    this.elements.forEach((el) => {
      el.addEventListener(event, (e) => {
        if (e.target.matches(selector)) {
          callback(e);
        }
      });
    });
    return this;
  };

  global.iwo = function (selector) {
    return new IWO(selector);
  };

})(window);
