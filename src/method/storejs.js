import store from 'store/dist/store.legacy';
import Cookies from 'cookies-js';

var StoreJS = function(store) {
    this.storejs = store;

    this.get = function(key) {
        var value = this.storejs.get(key);
        if (!value) {
            var cv = Cookies.get(key);
            if (cv) {
                value = JSON.parse(cv);
            }
        }
        if (value) {
            this.storejs.set(key, value);
        }
        return value;
    }

    this.set = function(key, value) {
        Cookies.set(key, JSON.stringify(value));
        return this.storejs.set(key, value);
    }
};

export default new StoreJS(store);