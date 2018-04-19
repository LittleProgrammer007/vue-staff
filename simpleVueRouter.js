class SimpleVueRouter {
    constructor() {
        this.routes = {};
        this.currentUrl = '';
        this.refresh = this.refresh.bind(this);
        window.addEventListener('load', this.refresh, false);
        window.addEventListener('hashchange', this.refresh, false);
    }

    route(path, callback) {
        this.routes[path] = callback;
    }

    refresh() {
        const currentUrl = this.currentUrl = window.location.hash.slice(1) || '/';
        this.routes[currentUrl] && this.routes[currentUrl]();
    }
}

let router = new SimpleVueRouter();
router.route('/home', () => { console.info('home') });
router.route('/work', () => { console.info('work') });

class HistoryVueRouter {
    constructor() {
        this.routes = {};
        window.addEventListener('popstate', e => {
            const path = e.state && e.state.path;
            this.routes[path] && this.routes[path]();
        }, false);
    }

    route(path, callback) {
        this.routes[path] = callback;
    }

    push(path) {
        history.pushState({ path: path }, null, path);
        this.routes[path] && this.routes[path]();
    }

    init(path) {
        history.replaceState({ path: path }, null, path);
        this.routes[path] && this.routes[path]();
    }
}

