var StoreJS = function() {
    this.base = '/setting/';
    this.prefix = 'austin_';

    this.getItem = function(key) {
        return this.getRemote(this.prefix + key);
    }

    this.setItem = function(key, value) {
        return this.setRemote(this.prefix + key, value);
    }

    this.removeItem = function(key) {
        return Promise.resolve();
    }

    this.getRemote = function(key) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.base + encodeURIComponent(key), true);  // asynchronous request
            xhr.onload = () => {
                resolve(xhr.responseText);
            };
            xhr.onerror = () => {
                reject();
            }
            xhr.send(null);
        });
    }

    this.setRemote = function(key, value) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', this.base + encodeURIComponent(key), true);  // asynchronous request
            xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
            xhr.onload = () => {
                resolve();
            }
            xhr.onerror = () => {
                reject();
            }
            xhr.send(value);
        });
    }
};

export default new StoreJS();