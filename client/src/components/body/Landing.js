import React from 'react';
import { questions } from '../../content/faq.json';

const Landing = () => {
  return (
    <div style={{height: "100%", padding: "10px", overflowY: "auto"}}>
      <h3><b>Welcome to Community Q's</b></h3>
      <p>Community Q's is your one-stop-shop, all-in-one {"Q&A"} platform.</p>
        <p>
          Below are answers to some of the most frequently asked questions about Community Q's. <br></br>
          Don't see an answer to your question? Ask us on the "Community Q's Official" community!
        </p>
        <ul className="list-group">
          {questions.map((elem, idx) => (
            <li key={idx} className="list-group-item ">
              <b>{elem.question}</b>
              <p style={{whiteSpace: 'pre-line'}}>{elem.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    );
}

export default Landing;