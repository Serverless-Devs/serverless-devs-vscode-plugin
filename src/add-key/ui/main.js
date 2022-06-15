const vscode = acquireVsCodeApi();

new Vue({
  el: "#app",
  data: {
    providerItems: [],
    accessList: [],
    pickProvider: ''
  },
  created() {
    this._getProviderItems();
    this._getaccessList();
  },
  methods: {
    _getProviderItems() {
      this.providerItems = this.$config.items;
    },
    _getaccessList() {
      this.accessList = this.$config.configAccessList;
    },
    getProviderPickValue() {
      this.$nextTick(() => {
        this.pickProvider = _.get(this.accessList, this.$refs.providerDropdown.currentValue);
        
      });
    },
  },
  watch: {
    pickProvider: function(newVal, oldVal) {
      console.log(newVal);
    }
  }
});