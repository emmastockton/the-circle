> **NOTE** see [docs/README.md](./docs/README.md) for a summary of changes made as part of this tech task summary.

---

# theCircle - A tool to help us listen to our employees

theCircle is a POC project where we are experimenting with tools and techniques to gather and then analyse feedback from our teams.

Every week we will launch a new internal survey to find out how our staff are doing.

Each survey will have a unique quiz id, (but we could re-use questions) and each question within a quiz has a unique questionId. Once users have started submitting results, administrators will be able to run reports that allow them to analyse the mood of our staff.

The system consists of a front end (React) that allows users to submit the answers to a series of different types of questions and a back end which stores and processes the response to these questions.

theCircle is in active development and should very much be seen as a POC that will be iterated upon until it is of production quality, where it will be incorporated as a module into our SAAS offering.

## Architecture

theCircle is a serverless application. It is an experiment in building systems that avoid relational databases.

Each quiz (feedback) is represented as a JSON document. We will build a tool that allows us to create new quizes from a bank of questions. In the POC the first quiz is currently hard-coded into the application.

Each quiz has a unique id number (top level id field).

Each question has a unique questionId (id at top level of each question object).

Each answer has a unique id (id at top level of each answer object).

Here is an example of a quiz.

```
{
    id: 0,
    title: "Daily Engagement Service",
    questions: [
        {
            id: 0,
            title: "Did you enjoy yourself today?",
            type: "button",
            answers: [
                {
                    id: 0,
                    text: "Hell Yes!",
                    nextQuestionId: 1
                },
                {
                    id: 1,
                    text: "Nope... :-(",
                    nextQuestionId: 2
                }
            ]
        },
        {
            id: 1,
            title: "Great what contributed to your success today?",
            type: "multiSelect",
            nextQuestionId: 4,
            answers: [
                {
                    id: 2,
                    text: "My colleagues.",
                },
                {
                    id: 3,
                    text: "I felt empowered to get my job done.",
                },
                {
                    id: 4,
                    text: "I had access to all of the tools I needed to smash it."
                },
                {
                    id: 5,
                    text: "I could focus on my most important tasks."
                },
                {
                    id: 6,
                    text: "I knew exactly what I was doing so just nailed it."
                },
                {
                    id: 7,
                    text: "I don't know.  I was just on a role."
                }
            ]
        },
        {
            id: 2,
            title: "Sorry to hear that.  Why didn't work out today?",
            type: "multiSelect",
            nextQuestionId: 3,
            answers: [
                {
                    id: 8,
                    text: "Too much to do.",
                },
                {
                    id: 9,
                    text: "Our processes got in the way."
                },
                {
                    id: 10,
                    text: "Too many meetings."
                },
                {
                    id: 11,
                    text: "I'm missing some skills."
                },
                {
                    id: 12,
                    text: "I found my work boring."
                },
                {
                    id: 13,
                    text: "I don't know I just had a bad day."
                }
            ]
        },
        {
            id: 3,
            title: "Do you need some help?",
            type: "button",
            answers: [
                {
                    id: 14,
                    text: "Yes Please",
                    nextQuestionId: 5
                },
                {
                    id: 15,
                    text: "No thanks",
                    nextQuestionId: 4
                }
            ]
        },
        {
            id: 4,
            title: "Thanks for your input.",
            type: "text"
        },
        {
            id: 5,
            title: "Thanks for your input.  Help is on its way!",
            type: "text"
        }
    ]
}
```

Rather than storing the results in tables, data is stored within json documents. There are two types of document. When feedback is submitted it is assigned a guid and stored in its entirity in a s3 bucket by the listenCaptureFunction. We call these raw documents.

Once the raw document is stored in s3 a trigger implemented within listenQuestionTrigger fires which puts a processing job on a FIFO queue.

The listenDataStore lambda takes jobs from the FIFO Queue and creates json documents that can be read by the reporting tools. As we are not using a database the listenDataStore lambda may choose to store the same data in many formats to make reporting easier and more efficient.

As the listenDataStore lambda processes a consolidated view of a quiz / question, it is vitally important that multiple processes are not allowed to process the same consolidated json document at the same time as this could lead to data loss. This is why raw feedback is placed on a FIFO queue and processed in sequence. Remember s3 is eventually consisent and has no locking functionality!

Here is an example of a raw json document:

```
{
    "quizData": {
        "quizId": "0",
        "questionAnswers": [
            {
                "id": "0",
                "answers": [
                    "1"
                ]
            },
            {
                "id": "2",
                "answers": [
                    "8",
                    "9",
                    "10",
                    "11",
                    "12",
                    "13"
                ]
            },
            {
                "id": "3",
                "answers": [
                    "15"
                ]
            }
        ]
    }
}
```

Raw documents are stored in an s3 bucket within the following folder structure /\<quizId\>/\<month-year\>/guid.json

Here is an example of a consolidated json document, written through the questionStorageHandler implementation of the dataStorageHandler interface:

```
{
    "questionId": "2",
    "quizId": "0",
    "answerData": [
        {
            "answerId": "8",
            "responseFile": [
                "0/3-2020/04a60537-302e-4311-80b1-f977fede663d.json"
            ]
        },
        {
            "answerId": "9",
            "responseFile": [
                "0/3-2020/04a60537-302e-4311-80b1-f977fede663d.json"
            ]
        },
        {
            "answerId": "10",
            "responseFile": [
                "0/3-2020/04a60537-302e-4311-80b1-f977fede663d.json"
            ]
        },
        {
            "answerId": "11",
            "responseFile": [
                "0/3-2020/04a60537-302e-4311-80b1-f977fede663d.json"
            ]
        },
        {
            "answerId": "12",
            "responseFile": [
                "0/3-2020/04a60537-302e-4311-80b1-f977fede663d.json"
            ]
        },
        {
            "answerId": "13",
            "responseFile": [
                "0/3-2020/04a60537-302e-4311-80b1-f977fede663d.json"
            ]
        }
    ]
}
```

The architecture uses a number of lambda functions that are written in golang.

### The listenCapture function

The responsibility of this function is to sit behind the AWS API gateway and store incoming feedback into an s3 bucket as a json document.

### The listenQuestionTrigger function

This function is called as an s3 trigger when a new document is stored, the trigger fires and adds the bucketName and filename to a FIFO Queue.

### The listenDataStore function

This function is triggered when a message is placed on the FIFO Queue. It takes the new data from the new survey and outputs it in a number
of formats that make it easier to write useful reports.

## Directory Structure

- client - The frontEnd written in React
- server / lambda - The lambda functions that implement the back-end (written in golang)

Each folder has its own README.md that goes into greater depth about each component.

## Build instructions

### Lambda Functions

Build and deploy Lambda:

```
make deploy
```

**Note** This requires some S3 buckets to be created first and AWS to be configured on your machine. See AWS instructions below.

By default, the serverless deployment will use the `dev` stage.

### Client

Follow the AWS installation instructions, specifically the part about updating settings.js.

```
make install
make run
```

## AWS installation instructions

In order to set-up the application on AWS.

- Login to the console.

- Create 2 s3 buckets:-

  - `answers-tech-task-the-circle`
  - `datastorage-dev`

- Locally, ensure that you have an AWS config in `~/.aws/credentials` (See: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)

- Deploy the stack using: `make deploy`

- When deployed, make note of the endpoint URL outputted by serverless. Update **client/public/settings.js** with this url as follows:

```js
window.awsAPI = {
  apiEndpoint: '<your-endpoint-url>',
};
```

- run the local app using `make install && make run`

- The app should load in your browser.

- Run through the survey. If everything goes ok you should get a message thanking you for your input, and you should see a post request to the back end.

- You can now check the back-end to see if everything has worked ok. From the AWS console load s3 and check out the s3 buckets created earlier
  - `answers-tech-test-the-circle` - which will contain the answers (1 file per entry), and;
  - `datastorage-dev` - which will contain the formatted/aggregated data JSON files
