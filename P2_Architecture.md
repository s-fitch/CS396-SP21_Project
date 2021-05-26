Name: Spencer Fitch \
Netid: slf0232

# **Project Checkpoint 1: Architecture Specification**
This document outlines the full specification and architecutre of ***Community Q's***, a web application that enables people to form various question-and-answer communities about whatever topics they are interested in. This application works similar to existing Q&A platforms like Piazza and Campuswire, but differs in that Community Q's is not solely academic based. User's are free to create, search, and join any community they have an interest in without needing to register through a school or keep their topics academic focused. 

## **User Interface**

## **Architecture Diagram**

## **Architecture Components**
### **Client Application**
The client will interact with the service through a React web application hosted on S3. 
### **Node.js Backend**
In this design, the backend is implemented with a monolothic design, wherein all of the endpoints are handled by one server instance program. The architecture diagram shows many of these instances running in parallel behind an AWS Elastic Beanstalk load balancer in order to increase scalability. Though it currently uses a monolithic design for simplicity, the API endpoints of this backend were designed such that it could be converted to a more scalable microservice API at a later date. The Swagger API specification for this backend is available the website associated with this github repo: https://s-fitch.github.io/CS396-SP21_Project/.
### **MongoDB Databases**
All of the account, community, question, and answer information for the service will be stored in MongoDB databases like those we used in prior asignments. The schema for each type of entry is shown below. On top of the implicit partitioning provided by Mongo's NoSQL structure, the Community, Question, and Answer entries could be manually partitioned based on the community they belong to in order to increase scalability.
#### **Account Database**
```JSON
{
    _id: "string",
    email: "string",
    password: "string",
    communities: ["string", ...]
}
```
#### **Community Database**
```JSON
{
    _id: "string",
    name: "string",
    description: "string",
    image_url_profile: "string",
    image_url_banner: "string", 
    moderators: ["string", ...]
}
```
#### **Question Database**
```JSON
{
    _id: "string",
    community: "string",
    author: "string",
    time: integer,
    title: "string",
    body: "string"
}
```
#### **Answer Database**
```JSON
{
    _id: "string",
    community: "string",
    question: "string",
    author: "string",
    time: integer,
    body: "string",
    upvotes: ["string", ...],
    downvotes: ["string", ...]
    
}
```