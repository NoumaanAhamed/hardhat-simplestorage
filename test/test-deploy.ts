import { ethers } from "hardhat";
import { expect, assert } from "chai";
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types";

describe("SimpleStorage", function () {
  let simpleStorage: SimpleStorage;
  let SimpleStorageFactory: SimpleStorage__factory;

  //* runs before each test in this block
  this.beforeEach(async function () {
    SimpleStorageFactory = (await ethers.getContractFactory(
      "SimpleStorage",
    )) as unknown as SimpleStorage__factory;
    simpleStorage = await SimpleStorageFactory.deploy();
    const txReceipt = await simpleStorage.deploymentTransaction()?.wait();
  });
  it("should start with a favorite number of 0", async function () {
    const favoriteNumber = await simpleStorage.retrieve();
    const expectedFavoriteNumber = 0;
    // assert.equal(favoriteNumber.toString(), expectedFavoriteNumber.toString());
    expect(favoriteNumber.toString()).to.equal(
      expectedFavoriteNumber.toString(),
    );
  });
  it("should be able to store a favorite number", async function () {
    const expectedFavoriteNumber = 10;
    await simpleStorage.store(expectedFavoriteNumber);
    const favoriteNumber = await simpleStorage.retrieve();
    assert.equal(favoriteNumber.toString(), expectedFavoriteNumber.toString());
  });
});
