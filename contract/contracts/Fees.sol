// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.7.0;

library Fees{
	function convert(uint amount,uint conversionRate) public pure returns (uint convertedAmount)
	{
		return amount * conversionRate;
	}
}
