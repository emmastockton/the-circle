**[Back to README](./README.md)**

---

# Decisions

The decision that I've made and acted on as part of this tech task can be shown in separate PR's. They are as follows:

### Introduce Makefile ([PR](https://github.com/emmastockton/the-circle/pull/2))

On my initial look through the app architecture, I noticed there were various `build.sh` scripts which had the same, or very similar, code. I wanted to reduce code reuse whilst also making it easier to build, run and deploy the app.

I have had some experience with using `Makefile`'s and thought it would be a good tool to use to simplify the build process and enable the install and run steps to be executed from the root directory.

This was also the first step in making the initial set-up of the app smoother and more efficient.

### Add Linting Rules ([PR](https://github.com/emmastockton/the-circle/pull/3))

As I was going through the front-end code in the `./client` directory, I noticed a lot of inconsistencies in the code format.

I added linting and formatting rules to the app as an extension of the `eslint` which comes as part of the `create-react-app` template.

I extended the existing rules to introduce `prettier` for code formatting and some good practise rules around variable names, and others.

The `husky` package was installed to add a `pre-commit` hook which would check the commit against the linting rules and output an error if they had not been followed. This helps to ensure consistency throughout the code, making easier for others to follow and contribute to the app by closing this feedback loop earlier (rather than waiting for a build failure in CI, for example.)

This PR has a lot of changes due to the linting and prettify rules being enforced and are mostly non-breaking (whitespace or similar) changes.

### Introduce Serverless Framework ([PR](https://github.com/emmastockton/the-circle/pull/4))

Whilst I was introducing a `Makefile`, I wanted to make as much of the AWS set-up process as automated as possible. It was for this reason that I considered using the [Serverless](https://www.serverless.com/) framework to deploy the server-side code.

I had not previously used the serverless framework but had heard and read a lot about it. As `theCircle` is already a serverless app which uses AWS Lambdas, I thought it may make the deployment process easier to deploy and also easier to understand.

After installing the framework and initialising, I added to the `serverless.yml` file to enable the app to be built and deployed from the command line, with the only manual initial set-up being the creation of two S3 buckets.

As I hadn't used the Serverless framework before, I didn't know straight away what the `serverless.yml` was to look like to enable the app to be built and work in the same way as it is now so I took what config I thought would be needed from the CloudFormation files in the `./cfn` directory and used templates from the serverless docs to migrate them.

A lot of trial and error took place before finding the right config for the build to work as expected, moving one Lambda function at a time and testing in isolation.

Having the `serverless.yml` file meant the contents of the `./cfn` directory were no longer required. It also meant that I could simplify the `Makefile` further and add `build` and `deploy` targets for ease of running.

I believe this way of building server-side code not only makes the architecture easier to understand, it also makes it much easier to develop further and add to.

While not a primary consideration for its use, if there was a decision made in the future to stop using AWS as the provider, there would be _less_ changes needed to get the app working with another provider, as Serverless is mostly provider-agnostic.

### Add Error Handling and Simplify State Management ([PR](https://github.com/emmastockton/the-circle/pull/7))

During setting up serverless to deploy the server-side code, there were numerous times where I would complete the quiz on `http://localhost:3000` and although there was and error in sending the data to S3, there was no indication on the quiz that anything had gone amiss.

I decided to add some error handling into the front-end to ensure that if an error was to occur with the API, then the user could try to sumbit the answers again, rather than assuming they had been sumbitted as expected.

I initially found it difficult to add any error handling due to the way the `reducer` was set up which would not have initially allowed for any async checking.

In order to help with this refactor, it was important to clean up the many duplications of mixed business logic and calls to `dispatch` that was repeated throughout the `Render*.js` components. I modified these to be pure presentational components and treated the `Quiz.js` component as the main container. (See: https://reactpatterns.com/#container-component)

To enable error handling to run at the right moment in the user journey, I added a middleware function that would intercept the `dispatch` and check if the `nextQuestion` was actually the end of the quiz. If the async post then succeeded, the original `dispatch` went ahead, otherwise an error was indicated in the global state and is rendered, and the quiz stays on the current question, allowing the user to retry.

As part of this PR, I also added some UI improvements to make the front-end slightly more user-friendly, along with error messages that will show as part of the error handling.

### Bug Fixes and Other Improvements

There were also 2 other PR's raised and merged:

1.  [made some minor changes to set up procedure](https://github.com/emmastockton/the-circle/pull/1), and;
2.  [fixed a bug which caused empty data in DataStore JSON](https://github.com/emmastockton/the-circle/pull/6)

---

**[Prev - Architecture](./01_ARCH.md)** | **[Next - Future](./03_FUTURE.md)**
