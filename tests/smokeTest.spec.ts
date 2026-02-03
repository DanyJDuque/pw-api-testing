import { expect } from '../utils/custom-expect';
import { test } from '../utils/fixtures';

test('Get Articles', async ({ api }) => {
    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10);
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
        // .headers({ Authorization: authToken })
        .body({ "article": { "title": "Test Two test", "description": "Test description", "body": "Body", "tagList": [] } })
        .postRequest(201)

    expect(createArticleResponse.article.title).shouldEqual('Test Two test');
    const slugId = createArticleResponse.article.slug;

    const articleResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        // .headers({ Authorization: authToken })
        .getRequest(200)
    expect(articleResponse.articles[0].title).shouldEqual('Test Two test');

    await api
        .path(`/articles/${slugId}`)
        // .headers({ Authorization: authToken })
        .deleteRequest(204)

    const articleResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        //  .headers({ Authorization: authToken })
        .getRequest(200)
    expect(articleResponseTwo.articles[0].title).not.shouldEqual('Test Two test');
})

test('Create Update and Delete Articule', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles/')
        // .headers({ Authorization: authToken })
        .body({ "article": { "title": "Test New test", "description": "Test description", "body": "Body", "tagList": [] } })
        .postRequest(201)

    expect(createArticleResponse.article.title).shouldEqual('Test New test');
    const slugId = createArticleResponse.article.slug;

    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        // .headers({ Authorization: authToken })
        .body({ "article": { "title": "Test New test Modified!", "description": "Updated description", "body": "Updated Body", "tagList": [] } })
        .putRequest(200)
    expect(updateArticleResponse.article.title).shouldEqual('Test New test Modified!');
    const slugIdUpdated = updateArticleResponse.article.slug;


    const articleResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        // .headers({ Authorization: authToken })
        .getRequest(200)
    expect(articleResponse.articles[0].title).shouldEqual('Test New test Modified!');

    await api
        .path(`/articles/${slugIdUpdated}`)
        // .headers({ Authorization: authToken })
        .deleteRequest(204)

    const articleResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        // .headers({ Authorization: authToken })
        .getRequest(200)
    expect(articleResponseTwo.articles[0].title).not.shouldEqual('Test New test Modified!');
})