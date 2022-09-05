const { assert } = require("chai")
const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

// Before doing anything, we want to make sure that this test will only be executed on real testnets
// "?" is a special type of "if".
// If the network condition is met, the describe is skipped.
// Else, the describe is executed (as we are using a real testnet)
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", async function () {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("0.1")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              // Unlike with unit tests, we assume that the contract is already deployed on the blockchain when testing it
              fundMe = await ethers.getContract("FundMe", deployer)
              // No mock aggregator since we are on a testnet
          })
          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
