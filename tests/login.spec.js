// tests/login.spec.js fájl
import { test, expect } from '@playwright/test';
import { compareImages } from '../utils/compare.js';

let page;

test.beforeAll('Start Up', async({ browser }) => {
  let context = await browser.newContext();
  page = await context.newPage();
  await page.goto('https://www.saucedemo.com');
});

test('Has Title', async () => {
  await expect(page).toHaveTitle(/Swag Labs/);
});

test('Login Screen', async () => {
  await expect(page.locator('#user-name')).toBeEnabled();
  await expect(page.locator('#password')).toBeEnabled();
  await expect(page.locator('#login-button')).toBeEnabled();
  await page.screenshot({ path: 'img/login-screen.png'});
});

test('Login', async () => {
  await page.locator('#user-name').fill("standard_user");
  await page.locator('#password').fill("secret_sauce");
  await page.getByRole('button', {name: 'Login'}).click();

  await page.screenshot({ path: 'img/dashboard.png'});
  await expect(page.locator('.title')).toBeVisible();
  await page.locator('.title').screenshot({ path: 'img/title-element.png'});
});

test('Compare Images', async () => {
  const numDiffPixels = await compareImages(
    'img/login-screen.png',
    'img/dashboard.png',
    0.1, 
    'img/diff.png'
  );

  expect(numDiffPixels).toBeGreaterThan(0);
});

test('Select an Item', async () => {
  await page.selectOption('select[data-test="product-sort-container"]', 'za');
});

test('Logout', async () => {
  await page.locator('#react-burger-menu-btn').click();
  await page.locator('#logout_sidebar_link').click();
});
