import {test, expect } from '@playwright/test'

test.describe('Home page', ()=>  {
    test.beforeEach(async ({page}) => {
        await page.goto('/');
    });

    test('has the expected title', async ({page}) =>{
        await expect(page).toHaveTitle('Automation Exercise');
    })
});
