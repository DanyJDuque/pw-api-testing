import { faker } from '@faker-js/faker';
import articleRequestPayload from '../request-objects/POST-article.json';
import { expect } from '../utils/custom-expect';
import { getNewRandomArticle } from '../utils/data-generator';
import { test } from '../utils/fixtures';

test('Get Articles', async ({ api }) => {
    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)
    await expect(response).shouldMatchSchema('articles', 'GET_articles')
    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10);
})

test('Get Test Tags', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200)
    // se pasa el parametro true, sí se desea crea el archivo de schema o sí se actualizas
    await expect(response).shouldMatchSchema('tags', 'GET_tags', true)
    expect(response.tags[0]).shouldEqual('Test');
    expect(response.tags).toContain('Git');
    expect(response.tags.length).toBeLessThanOrEqual(10);
});

test('Create and Delete Articule', async ({ api }) => {
    const articleRequest = getNewRandomArticle()
    const createArticleResponse = await api
        .path('/articles/')
        .body(articleRequest)
        .postRequest(201)
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')
    expect(createArticleResponse.article.title).shouldEqual(articleRequest.article.title);

    const slugId = createArticleResponse.article.slug;
    const articleResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })        
        .getRequest(200)
    expect(articleResponse.articles[0].title).shouldEqual(articleRequest.article.title);

    await api
        .path(`/articles/${slugId}`)        
        .deleteRequest(204)

    const articleResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })        
        .getRequest(200)
    expect(articleResponseTwo.articles[0].title).not.shouldEqual(articleRequest.article.title);
})

test('Create Update and Delete Articule', async ({ api }) => {
    const articleTitle = faker.lorem.sentence(5) // esta crea un texto con 5 palabras
    const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload))
    // articleRequest.article.title = "This is an object title"
    articleRequest.article.title = articleTitle

    const createArticleResponse = await api
        .path('/articles/')
        .body(articleRequest)
        .postRequest(201)

    expect(createArticleResponse.article.title).shouldEqual(articleTitle);
    const slugId = createArticleResponse.article.slug;

    const articleTitleTwo = faker.lorem.sentence(5) // esta crea un texto con 5 palabras
    articleRequest.article.title = articleTitleTwo
    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .body(articleRequest)
        .putRequest(200)
    expect(updateArticleResponse.article.title).shouldEqual(articleTitleTwo);
    const slugIdUpdated = updateArticleResponse.article.slug;


    const articleResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        // .headers({ Authorization: authToken })
        .getRequest(200)
    // expect(articleResponse.articles[0].title).shouldEqual('Test New test Modified!');
    expect(articleResponse.articles[0].title).shouldEqual(articleTitleTwo);

    await api
        .path(`/articles/${slugIdUpdated}`)
        // .headers({ Authorization: authToken })
        .deleteRequest(204)

    const articleResponseTwo = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        // .headers({ Authorization: authToken })
        .getRequest(200)
    // expect(articleResponseTwo.articles[0].title).not.shouldEqual('Test New test Modified!');
    expect(articleResponseTwo.articles[0].title).not.shouldEqual(articleTitleTwo);
})