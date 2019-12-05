import React, { Component } from 'react';
import { getApplicantQuery } from '../queries/queries';
import { graphql } from 'react-apollo';


class ApplicantDetails extends Component {
    render() {
        console.log("props in applicantdetails: ", this.props)
        const data = this.props.data;
        const isLoading = data.loading;
        const loading = <p>Loading applicant details</p>

        const applicantDetails = !data.applicant ? null : (
            <div>
            <h1>Applicant Details</h1>
            <ul>
                <li>{data.applicant.id}</li>
                <li>{data.applicant.firstName}</li>
                <li>{data.applicant.lastName}</li>
            </ul>
            </div>
        )

        return (
            <React.Fragment>
                {isLoading && loading}
                {!isLoading && applicantDetails}
            </React.Fragment>
        )
    } 
}

export default graphql(getApplicantQuery,
    {
        options: (props) => {
            return {
                variables: {
                    id: props.applicantId
                }
            }
        }
    })(ApplicantDetails);