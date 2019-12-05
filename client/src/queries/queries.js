import {gql} from 'apollo-boost';

const getApplicantsQuery = gql`
{
    applicants{
        id
        firstName
    }
}
`;

const getApplicantQuery = gql`
    query GetApplicant($id: ID){
        applicant(id: $id){
            id
            firstName
            lastName
        }
    }
`;

export { getApplicantsQuery, getApplicantQuery };