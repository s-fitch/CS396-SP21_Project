# Community Q's

Community Q's is an anonymous, community based Q&A web application that enables people to form various question-and-answer communities about whatever topics they are interested in. Visit [Community Q's](https://spencerfitch.github.io/community-qs) and create a free account to discover all that Community Q's has to offer.

This application works similar to existing Q&A platforms like Piazza and Campuswire but differs in two key ways:

1. Community Q's is not solely academic based, but instead seeks to provide an all-encompassing Q&A platform for everyone.
2. All behavior on the platform is anonymous from the user's perspective, so they can feel free to ask and answer questions as honestly as possible.

By providing a community based approach to a Q&A forum, Community Q's makes it much easier to ask, find, and answer multiple related questions than many current platforms allow. Additionally, the anonymity amongst users means that they can be completely honest in both asking and answering questions, enabling everyone to gain the most information from the platform. In order to ensure this freedom of anonymity is not abused by malicious actors, the accounts associated with a given community, question, or answer are stored in Community Q's database for later reference to enable moderation of the platform. 

This application was originally created as an end-of-course project for an Introduction to Web Development course that I took in Spring Quarter 2021, but it has since been updated to improve efficiency and documentation.

## Architecture Specification

Below is the full architecture specification for this application, which outlines how all of the components of the application interact with one another to create the full Community Q's experience.

### User Interface

![Community Q's user interface](https://github.com/s-fitch/CS396-SP21_Project/blob/main/images/P2_UserInterface.jpg)

### Architecture Diagram

![Community Q's application architecture diagram](https://github.com/s-fitch/CS396-SP21_Project/blob/main/images/P2_ArchitectureDiagram.jpg)

### Architecture Components

#### Client Application

The users interact with the platform through a dynamic React single page web application (SPA). Currently, the application is best experienced on large viewports, such as a desktop, laptop, or tablet, but a mobile friendly version will be coming in the future.

#### Node.js Backend

In this design, the backend is implemented with a monolithic design, wherein all of the endpoints are handled by one server instance program. The architecture diagram shows many of these instances running in parallel behind an AWS Elastic Beanstalk load balancer in order to increase scalability. Though it currently uses a monolithic design for simplicity, the API endpoints of this backend were designed such that it could be converted to a more scalable microservice API at a later date. The Swagger API specification for this backend is available as part website associated with this GitHub repo: https://spencerfitch.github.io/community-qs/docs/.

### MongoDB Database

All of the account, community, question, and answer information for the service is stored in a MongoDB database, specifically hosted with MongoDB Atlas. The schema for each type of entry is shown below. By using a NoSQL structure, the database can easily be partitioned as the user base and total size of the database grows.

#### Account

```JS
{
    _id: "string",                  // Unique Account Id
    email: "string",                // Unique email for the account
    password: "string",             // Hash of the account password
    communities: ["string", ...]    // Community IDs user has joined
    upvotes: ["string", ...]        // Answer IDs user has upvoted
    downvotes: ["string", ...]      // Answer IDs user has downvoted

}
```

#### Community

```JS
{
    _id: "string",                  // Unique Community ID
    name: "string",                 // Short name of Community
    description: "string",          // Full description of Community
    moderators: ["string", ...]     // Account IDs of moderators that have edit access
}
```

#### Question

```JS
{
    _id: "string",          // Unique Question ID
    community: "string",    // Community that the question belongs to
    author: "string",       // Author of the question (only for internal use)
    time: integer,          // Epoch time the question was posted
    title: "string",        // Short title of the question
    body: "string"          // Full content of the question
}
```

#### Answer

```JS
{
    _id: "string",              // Unique Answer Id
    community: "string",        // Community that the answer belongs to
    question: "string",         // Question that the answer belongs to
    author: "string",           // Author of the answer (only for internal use)
    time: integer,              // Epoch time the question was posted
    body: "string",             // Content of the answer
    score: integer              // Cumulative score of the question (upvotes - downvotes)   
}
```
