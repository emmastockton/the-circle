**[Back to README](./README.md)**

---

# Future

It was not easy to stop where I have as there is so much more that I would have loved to have done and experiemented with as part of this app. I have listed below some of the areas I would carry on/start with if I could.

### Testing

#### Client-side

There is no testing within this app apart from a test which came when `create-react-app` was executed and it currently fails.

I have used `jest` a lot, and combined with `react-testing-library`, I think these would provide good test coverage for the `react` components and client-side JS.

For browser/visaul testing I would look at adding `puppeteer` or `cypress`.

The way that the components have now been split and simplified as part of the [add error handling & simplify state management PR](https://github.com/emmastockton/the-circle/pull/7), it would make testing each individual component much easier with minimal mocking.

#### Server-side

I haven't used golang before, but enjoyed working with a new language. I would want to look into what testing frameworks and tools work well with golang before starting on any testing for the serverside code.

### Config

As part of the [add error handling & simplify state management PR](https://github.com/emmastockton/the-circle/pull/7/files#diff-e1baee45d42c874faeadd6cdc2bcbc6fR1), I moved the contents of the `settings.js` file into a new `config/index.js` file in the `clinet/src/` directory.

This was the first step in what I would have liked to have done to allow the API Endpoint to be set as an environment variable and having a fallback value, rather than having to explicitly set the value manually.

This would also have taking me down the path of allowing other environment variables as part of the build process which has currently been set to a defualt value of `dev`.

### Data Reporting/Visualisation

Another path that I would have like to explored was how the data from the quiz could be accessed and presented for analysis.

Data processing and reporting could be improved by adding AWS Glue to transform the JSON data into something more structured and QuickSight to create visual reports for the data

This wasn't something that I chose as a priority for the tech task.

### Front-end App

The front end app isn't visually appealing and has some issues with accessiblity. I would like to explore how to make the app more user-friendly using more items from `reactstrap`.

While I did make some small changes to the UI to improve responsiveness (adding `Container` and `Row/Col` from reactstrap) I think the overall aesthetics could be improved to work better on mobile, desktop and tablet.

From a UX point of view, I would add the ability to go 'back' to previous questions and improve keyboard usability.

To aid with accessibility, build size and overall performance, I would look at automating [Lighthouse testing](https://developers.google.com/web/tools/lighthouse).

### Deploying the App

Lastly I would have liked to add the ability to build and deploy the React app to S3/CloudFront so that it can be accessed from a URL. This would tie into the per-environment config, allowing a `dev` and `prod` version of the app pointing at the respective resources in AWS (Lambda/SQS/S3)

---

**[Prev - Decisions](./02_DECISIONS.md)**
