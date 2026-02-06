import { test, expect } from '@playwright/test'


test('create article', async ({ page }) => {

    await page.goto('/')
    await page.getByText('Sign in').click()

    await page.getByRole('textbox', { name: 'Email' }).fill(process.env.PROD_USERNAME!)
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.PROD_PASSWORD!)
    await page.getByRole('button', { name: 'Sign in' }).click()

    await page.getByText('New Article').click();
    await page.getByRole('textbox', { name: 'Article Title' }).fill('Playwright is awesome');
    await page.getByRole('textbox', { name: 'What\'s this article about?' }).fill('ssssssss');
    await page.getByRole('textbox', { name: 'Write your article (in' }).fill('ssssssss');
    await page.getByRole('button', { name: 'Publish Article' }).click();
    await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome')
    await page.getByRole('link', { name: 'Home' }).first().click();
    await page.getByText('Global Feed').click();

    await page.getByText('Playwright is awesome').click()
    await page.getByRole('button', { name: 'Delete Article' }).first().click();
    await page.getByText('Global Feed').click();

    await expect(page.locator('app-article-list h1').first()).not.toContainText('This')
})