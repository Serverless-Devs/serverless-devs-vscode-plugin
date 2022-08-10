const vscode = acquireVsCodeApi();

new Vue({
  el: "#app",
  data: {
    pickProvider: '',
    alias: '',
    //当前状态
    status: 'management',
    pickProviderKeys: [],
    normalKeyValue: {},
    customKeyValue: [{
      key: '',
      value: '',
    }],
    credentialAll: {},
    statusTable: {}
  },
  created() {
    this.credentialAll = this.$config.data;
    _.forEach(this.credentialAll, (val, key) => {
      this.statusTable[key] = false;
    });
  },
  computed: {
    providerItems() {
      return this.$config.items;
    },
    accessList() {
      return this.$config.configAccessList;
    },
  },
  methods: {
    secret(data) {
      const len = data.length;
      const res = len > 6 ?
        data.slice(0, 3) + '*'.repeat(len - 6) + data.slice(len - 3) :
        data;
      return res;
    },
    updateHideStatus(alias) {
      const status = this.statusTable[alias];
      this.statusTable = _.omit(this.statusTable, alias);
      this.statusTable[alias] = !status;
    },
    deleteCredential(alias) {
      vscode.postMessage({
        command: 'deleteCredential',
        alias: alias
      });
    },
    getProviderPickValue(event) {
      this.pickProvider = event.target.value;
      this.pickProviderKeys = _.get(this.accessList, event.target.value);
      this.normalKeyValue = {};
    },
    addKvPair() {
      this.customKeyValue.push({
        key: '',
        value: '',
      });
    },
    delKvPair(index) {
      this.customKeyValue.splice(index, 1);
    },
    setAlias(event) {
      this.alias = event.currentTarget.value;
    },
    normalKV(key, event) {
      this.normalKeyValue[key] = event.currentTarget.value;
    },
    customKV(index, event, type) {
      this.customKeyValue[index][type] = event.currentTarget.value;
    },
    submitCredential() {
      let kvPairs = {};
      if (this.pickProvider === 'custom') {
        for (const kv of this.customKeyValue) {
          if (kv['key'] === '' || kv['value'] === '') continue;
          kvPairs[kv['key']] = kv['value'];
        }
      } else {
        kvPairs = this.normalKeyValue;
      }
      vscode.postMessage({
        command: 'setCredential',
        kvPairs: kvPairs,
        provider: this.pickProvider,
        alias: this.alias
      });
      this.status = 'management';
    }
  }
});