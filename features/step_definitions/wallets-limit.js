import { Given, When, Then } from 'cucumber';
import { expect } from 'chai';
import { createWallets } from '../support/helpers/wallets-helpers';
import { createRawTable } from '../support/helpers/shared-helpers';
import { MAX_ADA_WALLETS_COUNT } from '../../source/renderer/app/config/numbersConfig';

Given('I create wallets until I reach the maximum number permitted', async function () {
  const wallets = [...Array(MAX_ADA_WALLETS_COUNT)].map((x, i) => ({
    name: `Wallet ${i}`,
    password: ''
  }));
  await createWallets(createRawTable(wallets), this);
});

When('I should see maximum number of wallets in the wallets list', async function () {
  const wallets = await this.client.elements('.SidebarWalletMenuItem_component');
  expect(wallets.value.length).to.equal(MAX_ADA_WALLETS_COUNT);
});

Then('The buttons in the Add Wallet screen should be disabled', async function () {
  const buttonsAreDisabled = await this.client
    .getAttribute('.WalletAdd_buttonsContainer .BigButtonForDialogs_component', 'disabled');

  expect(buttonsAreDisabled)
    .to.be.an('array')
    .that.include('true')
    .and.not.include('false');

});

Then('I should see a disclaimer saying I have reached the maximum number of wallets', async function () {
  const disclaimer = await this.client.getText('.WalletAdd_notification');
  expect(disclaimer.replace(/\n/, ' ')).to.equal(`You have reached the maximum of ${MAX_ADA_WALLETS_COUNT} wallets. No more wallets can be added.`);
});
