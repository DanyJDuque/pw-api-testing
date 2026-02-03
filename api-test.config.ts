const processENV = process.env.TEST_ENV
const env = processENV || 'dev'
console.log(`Running tests in ${env} environment`)

const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: 'pwapitesting@yopmail.com',
    userPassword: 'PwApiTesting',
    // userEmail: 'pwapitesting2@yopmail.com',
    // userPassword: 'PwApiTesting',
}

// if (env === 'qa') {
//     config.userEmail = 'pwapiuser@test.com',
//         config.userPassword = 'Welcome'
// }
// if (env === 'prod') {
//     config.userEmail = '',
//         config.userPassword = ''
// }

export { config }