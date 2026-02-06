import { test, expect } from '@playwright/test';

let authToken: string = '';

// 18. GET Request
test('Get Test Tags', async ({ request }) => {
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const tagsResponseJSON = await tagsResponse.json();

  expect(tagsResponse.status()).toEqual(200);
  expect(tagsResponseJSON.tags[0]).toEqual('Test');
  expect(tagsResponseJSON.tags).toContain('Git');
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10);
});


test('Get All Articles', async ({ request }) => {
  const articleResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
  const articleResponseJSON = await articleResponse.json();

  expect(articleResponse.status()).toEqual(200);
  expect(articleResponseJSON.articles.length).toBeLessThanOrEqual(10);
  expect(articleResponseJSON.articlesCount).toEqual(10);
})

// 19. Post Resquest
test('Create Article', async ({ request }) => {
  // const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  //   data: { "user": { "email": "pwapitesting@yopmail.com", "password": "PwApiTesting" } }
  // })
  // const tokenResponseJSON = await tokenResponse.json();
  // const authToken = tokenResponseJSON.user.token;

  // 20. Authorized Post Request
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "Test Two test",
        "description": "Test description",
        "body": "Body",
        "tagList": []
      }
    },
    headers: {
      'Authorization': `Token ${authToken}`
    }
  })
  const newArticleResponseJSON = await newArticleResponse.json();
  // console.log('New Article Response:', newArticleResponseJSON);
  expect(newArticleResponse.status()).toEqual(201);
  expect(newArticleResponseJSON.article.title).toEqual('Test Two test');

  const articleResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      'Authorization': `Token ${authToken}`
    }
  })
  const articleResponseJSON = await articleResponse.json();
  expect(articleResponse.status()).toEqual(200);
  expect(articleResponseJSON.articles[0].title).toEqual('Test Two test');

  // 21. Delete Request
  const articleSlug = newArticleResponseJSON.article.slug;
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`, {
    headers: {
      'Authorization': `Token ${authToken}`
    }
  })
  expect(deleteArticleResponse.status()).toEqual(204);

  // this part is optional, just to make sure that article is deleted
  const articleResponseAfterDelete = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      'Authorization': `Token ${authToken}`
    }
  })
  const articleResponseAfterDeleteJSON = await articleResponseAfterDelete.json();
  expect(articleResponseAfterDelete.status()).toEqual(200);
  expect(articleResponseAfterDeleteJSON.articles[0].title).not.toEqual('Test Two test');
})

// 22. Put Request

test('Create, Update and Delete Article', async ({ request }) => {
  // Get Auth Token
  // const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  //   data: { "user": { "email": "pwapitesting@yopmail.com", "password": "PwApiTesting" } }
  // })
  // const tokenResponseJSON = await tokenResponse.json();
  // const authToken = tokenResponseJSON.user.token;

  // Post Request to create a new article
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "Test New Article",
        "description": "Test description",
        "body": "Body",
        "tagList": []
      }
    },
    headers: {
      'Authorization': `Token ${authToken}`
    }
  })
  const newArticleResponseJSON = await newArticleResponse.json();
  expect(newArticleResponse.status()).toEqual(201);
  expect(newArticleResponseJSON.article.title).toEqual('Test New Article');

  // Verify the creation with a GET request
  const articleResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      'Authorization': `Token ${authToken}`
    }
  })
  const articleResponseJSON = await articleResponse.json();
  expect(articleResponse.status()).toEqual(200);
  expect(articleResponseJSON.articles[0].title).toEqual('Test New Article');


  // Put Request to update the article
  const articleSlug = newArticleResponseJSON.article.slug;
  const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`, {
    data: {
      "article": {
        "title": "Test New Article Modified",
        "description": "Test description",
        "body": "Body",
        "tagList": []
      }
    },
    headers: {
      'Authorization': `Token ${authToken}`
    }
  })

  const updateArticleResponseJSON = await updateArticleResponse.json();
  expect(updateArticleResponse.status()).toEqual(200);
  expect(updateArticleResponseJSON.article.title).toEqual('Test New Article Modified');
  const newSlugId = updateArticleResponseJSON.article.slug;

  // Verify the update with a GET request
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      'Authorization': `Token ${authToken}`
    }
  })
  const articlesResponseJSON = await articlesResponse.json();
  expect(articlesResponse.status()).toEqual(200);
  expect(articlesResponseJSON.articles[0].title).toEqual('Test New Article Modified');

  // Delete the article
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${newSlugId}`, {
    headers: {
      'Authorization': `Token ${authToken}`
    }
  })
  expect(deleteArticleResponse.status()).toEqual(204);
});


// 23. Test Hooks
/*
 Se modifica el archivo playwright.config.ts para agregar el reporter de tipo lista y html
 al ejecutar los tests se puede observar el listado

 Running 4 tests using 1 worker

  ok 1 [chromium] › tests\example.spec.ts:4:5 › Get Test Tags (732ms)
  ok 2 [chromium] › tests\example.spec.ts:15:5 › Get All Articles (401ms)
  ok 3 [chromium] › tests\example.spec.ts:25:5 › Create Article (1.5s)
  ok 4 [chromium] › tests\example.spec.ts:82:5 › Create, Update and Delete Article (1.7s)

  4 passed (21.4s)


*/

test.beforeAll('Run Before all', async ({ request }) => {
  // console.log('This is executed before all tests');
  const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: { "user": { "email": "pwapitesting@yopmail.com", "password": "PwApiTesting" } }
  })
  const tokenResponseJSON = await tokenResponse.json();
  authToken = tokenResponseJSON.user.token;
})


/*
Running 4 tests using 1 worker

This is executed before all tests
  ok 1 [chromium] › tests\example.spec.ts:4:5 › Get Test Tags (2.4s)
  ok 2 [chromium] › tests\example.spec.ts:15:5 › Get All Articles (795ms)
  ok 3 [chromium] › tests\example.spec.ts:25:5 › Create Article (2.1s)
This is executed after all tests
  ok 4 [chromium] › tests\example.spec.ts:82:5 › Create, Update and Delete Article (2.0s)

  4 passed (36.5s)
*/

// 24. Test Execution
// npx playwright test 
// npx playwright test --project api-testing
// npx playwright test --project api-testing --last-failed
// npx playwright test --project api-testing -g "Get Test Tags"
// test.only to run a single test
// test.skip to skip a single test
// test.fixme to mark a test as broken


// 25. Wrap Up





// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
