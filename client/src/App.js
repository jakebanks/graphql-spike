import React from 'react';
import ApolloClient from 'apollo-boost'; //"apollo is the industry standard gql implementation"
import { ApolloProvider } from 'react-apollo'; //wraps our app and injects data from gql (accessed via apollo) into our app

//container components
import ApplicantsList from './components/applicantsList'

//stateless components
import ApplicantDetails from './components/applicantDetails';

//apollo client setup
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>PageUp Talent Acquisition</h1>
        <ApplicantsList />
      </div>
    </ApolloProvider>
  );
}

export default App;
