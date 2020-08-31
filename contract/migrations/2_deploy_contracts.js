const LN2tBTC = artifacts.require("LN2tBTC");

module.exports = function(deployer) {
  deployer.deploy(LN2tBTC);
};
