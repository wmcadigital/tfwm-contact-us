// This file helps to reroute the webpack build through here first
// This enables to modify the webbpack config without ejecting CRA
// For more: https://www.npmjs.com/package/react-app-rewired

module.exports = {
  webpack(config, env) {
    return config;
  },
  // jest: function(config) {
  //   // customize jest here
  //   return config;
  // },
  // devServer: function(configFunction) {
  //   return function(proxy, host) {
  //     // customize devServer config here
  //     return config;
  //   }
  // }
};
