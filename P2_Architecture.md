Name: Spencer Fitch \
Netid: slf0232

# **Project Checkpoint 1: Architecture Specification**
This document outlines the full specification and architecture of ***Community Q's***, a web application that enables people to form various question-and-answer communities about whatever topics they are interested in. This application works similar to existing Q&A platforms like Piazza and Campuswire but differs in that Community Q's is not solely academic based. Users are free to create, search, and join any community they have an interest in without needing to register through a school or keep their topics academic focused.

## **User Interface**
![Community Q's user interface](https://github.com/s-fitch/CS396-SP21_Project/blob/main/images/P2_ArchitectureDiagram.jpg)
## **Architecture Diagram**
![Community Q's system architecture diagram](https://github.com/s-fitch/CS396-SP21_Project/blob/main/images/P2_UserInterface.jpg)
## **Architecture Components**
### **Client Application**
The users will interact with the service through a React web application hosted on S3 that is delivered to the client through a request to the "/" endpoint in the backend.
### **Node.js Backend**
In this design, the backend is implemented with a monolithic design, wherein all of the endpoints are handled by one server instance program. The architecture diagram shows many of these instances running in parallel behind an AWS Elastic Beanstalk load balancer in order to increase scalability. Though it currently uses a monolithic design for simplicity, the API endpoints of this backend were designed such that it could be converted to a more scalable microservice API at a later date. The Swagger API specification for this backend is available the website associated with this GitHub repo: https://s-fitch.github.io/CS396-SP21_Project/.
### **MongoDB Databases**
All of the account, community, question, and answer information for the service will be stored in MongoDB databases like those we used in prior assignments. The schema for each type of entry is shown below. On top of the implicit partitioning provided by Mongo's NoSQL structure, the Community, Question, and Answer entries could be manually partitioned based on the community they belong to in order to increase scalability.
#### **Account Database**
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
#### **Community Database**
```JS
{
    _id: "string",                  // Unique Community ID
    name: "string",                 // Short name of Community
    description: "string",          // Full description of Community
    moderators: ["string", ...]     // Account IDs of moderators that have edit access
}
```
#### **Question Database**
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
#### **Answer Database**
```JS
{
    _id: "string",              // Unique Answer Id
    community: "string",        // Community that the answer belongs to
    question: "string",         // Question that the answer belongs to
    author: "string",           // Author of the answer (only for internal use)
    time: integer,              // Epoch time the question was posted
    body: "string",             // Content of the answer
    score: integer              // Cummulative score of the question, which is upvotes-downvotes     
    
    
}
```