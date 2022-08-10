const vscode = acquireVsCodeApi();

new Vue({
  el: "#app",
  data: {
    pageStatus: 'search',
    keyword: '',
    applicationList: {},
    originalApplicationList: {},
    aliasList: {},
    categoryListRes: {},
    requireConfig: {},
    currentAppParams: {},
    paramRequired: {},
    configItems: {
      'access': '',
      'path': '',
      'dirName': ''
    },
  },
  created() {
    document.getElementById('app').style.display = 'none';
    this.configItems.path = this.$config.defaultPath;
    vscode.postMessage({
      command: 'requestData'
    });
  },
  mounted() {
    window.addEventListener('message', this.onMessage); 
  },
  beforeDestroy() {
    window.removeEventListener('message', this.onMessage);
  },
  computed: {
    // 加条'all'选项
    categoryList: function () {
      return {
        0: 'All',
        ...this.categoryListRes
      };
    },
  },
  methods: {
    onMessage(event) {
      switch (event.data.command) {
        case 'responseData':
          this.aliasList = event.data.aliasList;
          this.originalApplicationList = event.data.applicationList.Response;
          this.applicationList = this.originalApplicationList;
          this.categoryListRes = event.data.categoryList;
          document.getElementById('app').style.display = 'block';
          document.getElementById('appLoading').style.display = 'none';
          break;

        case 'getParams':
          this.currentAppParams = event.data.params.properties;
          this.paramRequired = event.data.params.required;
          for (const i in this.currentAppParams) {
            this.configItems[i] = this.currentAppParams[i]['default'];
          }
          break;

        case 'updatePath':
          this.configItems.path = event.data.path;
          break;
      }
    },
    updateKeyword(event) {
      this.keyword = event.target.currentValue;
    },
    search() {
      const keyword = this.keyword;
      if (keyword === '') {
        this.applicationList = this.originalApplicationList;
      } else {
        this.applicationList = _.filter(this.originalApplicationList, function (o) {
          return o.package.indexOf(keyword) > -1;
        });
      }
    },
    sortBySelected(event) {
      this.applicationList = _.orderBy(this.originalApplicationList, function (item) {
        const selected = event.target.ariaActiveDescendant;
        if (selected === 'byDate') {
          return -item.version.published_at;
        } else if (selected === 'byDownload') {
          return -item.download;
        }
      });
    },
    switchStatus(status, appname) {
      if (status === 'init') {
        vscode.postMessage({
          command: 'getParams',
          selectedApp: appname,
        });
        this.configItems['access'] = this.aliasList[0];
        this.configItems['path'] = this.$config.defaultPath;
        this.configItems['dirName'] = appname;
      }
      this.pageStatus = status;
      this.selectedApp = appname;
    },
    filterAppList(type, val) {
      if (type === 'category' && val !== 'All') {
        this.applicationList = _.filter(this.$config.applicationList.Response, function (o) {
          return o.tags.indexOf(val) !== -1;
        });
      } else if (type === 'category' && val === 'All') {
        this.applicationList = this.$config.applicationList.Response;
      }
    },
    openUrl(appName) {
      vscode.postMessage({
        command: 'openUrl',
        appName: appName
      });
    },
    isRequire(name) {
      return this.paramRequired.indexOf(name) > -1;
    },
    setConfigItem(name, event) {
      if (event.target.currentValue.length === 0) {
        this.configItems[name] = this.currentAppParams[name]['default'];
      } else {
        this.configItems[name] = event.target.currentValue;
      }
    },
    setInitPath() {
      vscode.postMessage({
        command: 'setInitPath',
      });
    },
    initApplication() {
      vscode.postMessage({
        command: 'initApplication',
        selectedApp: this.selectedApp,
        configItems: this.configItems,
      });
    }
  }
});