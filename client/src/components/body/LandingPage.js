import React from 'react';

class LandingPage extends React.Component {
    render() {
        return (
            <div style={{height: "100%", padding: "10px", overflowY: "auto"}}>
                <h3><b>Welcome to Community Q's</b></h3>
                <p>Community Q's is your one-stop-shop, all-in-one {"Q&A"} platform.</p>
                <p>
                    Below are answers to some of the most frequently asked questions about Community Q's. <br></br>
                    Don't see an answer to your question? Ask us on the "Community Q's Official" community!</p>
                <ul className="list-group">
                    <li className="list-group-item ">
                        <b>How does Community Q's work?</b>
                        <p>Community Q's is composed of many different communities, each with their own topic of interest, inside of which you can ask questions and find answers. A community's feed page shows the list of questions asked, which can then be clicked on to see the answers.</p>
                    </li>
                    <li className="list-group-item">
                        <b>How do I find communities?</b>
                        <p>To find a community, just use the search bar on the left side of the page. Enter terms for the topics you are interested in, and related communities will appear below.</p>
                    </li>
                    <li className="list-group-item">
                        <b>Do I need an account?</b>
                        <p>
                            No, you can freely browse all the communities, questions, and answers that Community Q's has to offer without an account.<br></br>
                            However, you will need an account to access the additional features of Community Q's, such as joining communities, posting your questions, or answering others' questions.

                        </p>
                    </li>
                    <li className="list-group-item">
                        <b>How can I get back to this page?</b>
                        <p>To get back to this homepage, you can click the Community Q's logo in the uppper lefthand corner of the page.</p>
                    </li>

                </ul>
            </div>
        );
    }
}
export default LandingPage