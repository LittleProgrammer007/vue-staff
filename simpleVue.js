const Dep = function () {
    this.subs = [];
}

Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub);
    },
    notify: function () {
        this.subs.forEach(sub => sub.update());
    }
}

const Watcher = function (vm, node, name) {
    Dep.target = this;
    this.vm = vm;
    this.name = name;
    this.node = node;
    this.update();
    Dep.target = null;
}

Watcher.prototype = {
    update: function () {
        this.get();
        if (this.node.nodeType === 1) {
            this.node.value = this.value;
        } else {
            this.node.nodeValue = this.value;
        }
    },
    get: function () {
        this.value = this.vm[this.name];
    }
}

const compile = function (node, vm) {

    switch (node.nodeType) {
        case 1:
            let attrs = node.attributes;
            for (let attr of attrs) {
                if (attr.nodeName === 'v-model') {
                    let name = attr.nodeValue;

                    node.addEventListener('input', function (e) {
                        vm[name] = this.value;
                    }, false);

                    new Watcher(vm, node, name);

                    node.value = vm[name];
                    node.removeAttribute('v-model');
                    break;
                }
            }
            break;
        case 3:
            if (/\{\{(.*)\}\}/.test(node.nodeValue)) {
                let name = RegExp.$1;
                name = name.trim();
                if (name) {
                    node.nodeValue = vm[name];
                    new Watcher(vm, node, name);
                }
            }
            break;

    }
}

const observe = data => {
    if (!data || typeof data !== 'object') return;
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]));
}

const defineReactive = (data, key, value) => {
    const dep = new Dep();
    observe(value);
    Object.defineProperty(data, key, {
        set: (newVal) => {
            value = newVal;
            dep.notify();
        },
        get: () => {
            if (Dep.target) {
                dep.addSub(Dep.target);
            }
            return value;
        }
    })
}

const compileNode = (node, vm) => {
    let frag = document.createDocumentFragment();
    let child;
    while (child = node.firstChild) {
        compile(child, vm);
        frag.appendChild(child);
    }

    node.appendChild(frag);
}

const SimpleVue = function (options) {
    let data = this.data = options.data;
    observe(data);
    let id = options.el;
    compileNode(document.getElementById(id), data);
}

let simpleVueTest = new SimpleVue({
    el: 'app',
    data: {
        text: 'Hello World',
        msg: 'ni hao'
    }
})
