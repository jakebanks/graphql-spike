import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getApplicantsQuery } from '../queries/queries'; //no default export, so need to name this in curlies
import ApplicantDetails from './applicantDetails';

class ApplicantsList extends Component {
    constructor(props){
        super(props);
        this.state = {
            clickedApplicant: null
        };
    }

    render() {
        console.log(this.state);
        const isLoading = this.props.data.loading;

        const loading = (
            <div>
                <p>Now loading...</p>
            </div>
        );
    
        const applicantItems = !isLoading ? (
            this.props.data.applicants.map(applicant => {
                    return (
                    <li key={applicant.id} onClick={
                        () => {
                            this.setState({clickedApplicant: applicant.id
                            })
                        }
                    }>
                        {applicant.firstName}
                    </li>
                    )
                }
            )) : null;
            

        return (
            <React.Fragment>
                {isLoading && loading}
                {!isLoading && applicantItems}
                <ApplicantDetails applicantId={ this.state.clickedApplicant }/>
            </React.Fragment>
        )
    }
}

export default graphql(getApplicantsQuery)(ApplicantsList); //bind the get applicants query to the ApplicantsList component