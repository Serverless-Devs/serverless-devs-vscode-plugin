const vscode = acquireVsCodeApi();

new Vue({
    el: "#app",
    data: {
        categoryCondition: '',
        providerCondition: '',
        pageStatus: 'search',
        selectedApp: '',
        applicationList: {},
        configItems: {
            'access': '',
            'path': '',
            'dirName': ''
        }
    },
    created() {
        this.applicationList = this.$config.applicationList.Response;
        this.configItems.path = this.$config.defaultPath;
        console.log(this.$config.defaultPath);
    },
    computed: {
        categoryList: function () {
            return {
                0: '全部',
                ...this.$config.categoryList
            };
        },
    },
    methods: {
        sortBySelected(event) {
            this.applicationList = _.orderBy(this.$config.applicationList.Response, function (item) {
                const selected = event.target.currentValue;
                if (selected === '按时间排序') {
                    return -item.version.published_at;
                } else if (selected === '按下载量排序') {
                    return -item.download;
                }
            });
        },
        switchStatus(status, appname) {
            this.pageStatus = status;
            this.selectedApp = appname;
        },
        filterAppList(type, val) {
            if (type === "category" && val !== "全部") {
                this.applicationList = _.filter(this.$config.applicationList.Response, function (o) {
                    return o.tags.indexOf(val) !== -1;
                });
            } else if (type === "category" && val === "全部") {
                this.applicationList = this.$config.applicationList.Response;
            }
        },
        openUrl(appName) {
            vscode.postMessage({
                command: 'openUrl',
                appName: appName
            });
        },
        setConfigItem(k, v) {
            this.configItems[k] = v.target.currentValue;
        },
        setInitPath() {
            vscode.postMessage({
                command: 'setInitPath',
            });
            window.addEventListener('message', event => {
                this.configItems.path = event.data.path;
            });

        },
        submit() {
            vscode.postMessage({
                command: 'create',
                selectedApp: this.selectedApp,
                configItems: this.configItems
            });
        }
    }
});