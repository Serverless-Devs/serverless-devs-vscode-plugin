const vscode = acquireVsCodeApi();

new Vue({
  el: "#app",
  data: {
    pickProvider: '',
    alias: '',
    providerItems: [],
    accessList: [],
    status: 0,
    pickProviderKeys: [],
    normalKeyValue: {},
    customKeyValue: [{
      key: '',
      value: ''
    }],
    credentialAll: {}
  },
  created() {
    this.getProviderItems();
    this.getAccessList();
    this.changeStatus();
  },
  methods: {
    getProviderItems() {
      this.providerItems = this.$config.items;
    },
    getAccessList() {
      this.accessList = this.$config.configAccessList;
    },
    changeStatus(action) {
      vscode.postMessage({
        command: 'getCredential',
      });
      window.addEventListener('message', event => {
        if (action === 'goback') {
          this.status = 0;
        } else if (action === 'add') {
          this.status = 1;
        } else {
          this.status = event.data.data ? 0 : 1;
        }
        this.credentialAll = event.data.data;
      });
    },
    deleteCredential(alias) {
      vscode.postMessage({
        command: 'deleteCredential',
        alias: alias
      });
      this.credentialAll = _.omit(this.credentialAll, alias);
    },
    getProviderPickValue() {
      this.$nextTick(() => {
        this.pickProvider = this.$refs.providerDropdown.currentValue;
        this.pickProviderKeys = _.get(this.accessList, this.$refs.providerDropdown.currentValue);
      });
      this.normalKeyValue = {};
    },
    addKvPair() {
      this.customKeyValue.push({
        key: '',
        value: ''
      });
    },
    subKvPair(index) {
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
    }
  },
  watch: {
    credentialAll: function (newVal, oldVal) {
      console.log(newVal);
    }
  }
});