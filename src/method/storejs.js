var StoreJS = function() {
    this.base = '/setting/';
    this.prefix = 'austin_';
    this.disconnected = false;
    this.connectCallback = null;

    this.getItem = function(key) {
        return this.getRemote(this.prefix + key, this);
    }

    this.setItem = function(key, value) {
        return this.setRemote(this.prefix + key, value, this);
    }

    this.removeItem = function(key) {
        return Promise.resolve();
    }

    this.getRemote = function(key, self) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', self.base + encodeURIComponent(key), true);  // asynchronous request
            xhr.onload = () => {
                if (xhr.status == 200)
                {
                    //if (self.disconnected && self.connectCallback != null) {
                    //    self.connectCallback(key, xhr.responseText);
                    //}
                    self.disconnected = false;
                    resolve(xhr.responseText);
                } else {
                    self.disconnected = true;
                    //window.setTimeout(self.getRemote, 5000, key, self);
                }
            };
            xhr.onerror = () => {
                self.disconnected = true;
                //window.setTimeout(self.getRemote, 5000, key, self);
            }
            xhr.send(null);
        });
    }

    this.setRemote = function(key, value, self) {
        return new Promise((resolve, reject) => {
            if (self.disconnected) {
                reject();
                return;
            }
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