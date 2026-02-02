import { expect } from '../utils/custom-expect';
import { test } from '../utils/fixtures';
import { createToken } from '../helpers/createToken';

let authToken: string;

test.beforeAll('Run Before all', async ({ config }) => {
    // const tokenResponse = await api
    //     .path('/users/login')
    //     .body({ "user": { "email": config.userEmail, "password": config.userPassword } })
    //     .postRequest(200);
     
    // authToken = await createToken(api, config.userEmail, config.userPassword)
   
    authToken = await createToken(config.userEmail, config.userPassword)
})

test('Get Articles', async ({ api }) => {

    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10);

    // const response2 = await api
    //     .path('/tags')
    //     .getRequest(200)

    // expect(response2.tags[0]).shouldEqual('Test');
    // expect(response2.tags).toContain('Git');
    // expect(response2.tags.length).shouldBeLessThanOrEqual(10);
})

test('Get Test Tags', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200)

    expect(response.tags[0]).shouldEqual('Test');
    expect(response.tags).toContain('Git');
    expect(response.tags.length).toBeLessThanOrEqual(10);
});

test('Create and Delete Articule', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles/')
        .header({ 'Authorization': `Token ${authToken}` })
        .body({ "article": { "title": "Test Two test", "description": "Test description", "body": "Body", "tagList": [] } })
        .postRequest(201)

    expect(createArticleResponse.article.title).shouldEqual('Test Two test');
    const slugId = createArticleResponse.article.slug;

    const articleResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .header({ 'Authorization': `Token ${authToken}` })
        .getRequest(200)
    expect(articleResponse.articles[0].title).shouldEqual('Test Two test');

    await api
        .path(`/articles/${slugId}`)
        .header({ 'Authorization': `Token ${authToken}` })
        .deleteRequest(204)

    const articleResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .header({ 'Authorization': `Token ${authToken}` })
        .getRequest(200)
    expect(articleResponseTwo.articles[0].title).not.shouldEqual('Test Two test');
})

test('Create Update and Delete Articule', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles/')
        .header({ 'Authorization': `Token ${authToken}` })
        .body({ "article": { "title": "Test New test", "description": "Test description", "body": "Body", "tagList": [] } })
        .postRequest(201)

    expect(createArticleResponse.article.title).shouldEqual('Test New test');
    const slugId = createArticleResponse.article.slug;

    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .header({ 'Authorization': `Token ${authToken}` })
        .body({ "article": { "title": "Test New test Modified!", "description": "Updated description", "body": "Updated Body", "tagList": [] } })
        .putRequest(200)
    expect(updateArticleResponse.article.title).shouldEqual('Test New test Modified!');
    const slugIdUpdated = updateArticleResponse.article.slug;


    const articleResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .header({ 'Authorization': `Token ${authToken}` })
        .getRequest(200)
    expect(articleResponse.articles[0].title).shouldEqual('Test New test Modified!');

    await api
        .path(`/articles/${slugIdUpdated}`)
        .header({ 'Authorization': `Token ${authToken}` })
        .deleteRequest(204)

    const articleResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .header({ 'Authorization': `Token ${authToken}` })
        .getRequest(200)
    expect(articleResponseTwo.articles[0].title).not.shouldEqual('Test New test Modified!');
})