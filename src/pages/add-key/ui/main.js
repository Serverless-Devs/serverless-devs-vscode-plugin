const vscode = acquireVsCodeApi();

new Vue({
  el: "#app",
  data: {
    pickProvider: '',
    providerItems: [],
    accessList: [],
    pickProviderKeys: [],
    normalKeyValue: [],
    customKeyValue: [
      {
        id: 1,
        kvPair: ''
      }
    ],
    num: 1
  },
  created() {
    this._getProviderItems();
    this._getAccessList();
  },
  methods: {
    _getProviderItems() {
      this.providerItems = this.$config.items;
    },
    _getAccessList() {
      this.accessList = this.$config.configAccessList;
    },
    getProviderPickValue() {
      this.$nextTick(() => {
        this.pickProvider = this.$refs.providerDropdown.currentValue;
        this.pickProviderKeys = _.get(this.accessList, this.$refs.providerDropdown.currentValue);
      });
      this.normalKeyValue = [];
    },
    addKvPair() {
      this.customKeyValue.push({id: this.num++, kvPair: ''});
    },
    subKvPair(index) {
      this.customKeyValue.splice(index, 1);
    },
    normalKV(key, event) {
      this.normalKeyValue[key] = event.currentTarget.value;
      console.log( this.normalKeyValue);
    },
    customKV(index, event) {
      this.customKeyValue[index].kvPair = event.currentTarget.value;
    },
    async submitCredential() {
      if ( this.pickProvider === "alibaba") {
        try {
          const data = await core.getAccountId(this.normalKeyValue); 
          this.normalKeyValue.AccountID = data.AccountId;
          const {...rest } = this.normalKeyValue;
          await core.setKnownCredential(rest, this.pickProvider);
        } catch (error) {
          return;
        }
      } else {
        const {...rest } = this.pickProvider === "custom" ? 
          this.customKeyValue : this.normalKeyValue;
        vscode.postMessage({
          command: 'setCredential',
          rest: rest,
          provider: this.pickProvider
        });
      }
    }
  },
  watch: {
    customKeyValue: function(newVal, oldVal) {
      console.log(newVal);
    }
  }
});

