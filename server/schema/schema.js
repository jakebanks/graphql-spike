const graphql = require('graphql');
const _ = require('lodash');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLID, 
    GraphQLList
} = graphql;

//TEST DATA
var applicants = [
    { id: "1", firstName: "Jake", lastName: "Banks" },
    { id: "1", firstName: "Jake", lastName: "Banks2" }, //denormalized
    { id: "2", firstName: "Colin", lastName: "Oh" },
    { id: "3", firstName: "Simond", lastName: "Lee" },
    { id: "4", firstName: "Shaun", lastName: "Tirubeni" }
]

var jobs = [
    { id: "1", title: "Gizmo Builder", description: "Builder of crazy gizmos" },
    { id: "2", title: "Widget Tester", description: "Tester of widgets" },
    { id: "3", title: "Professional Gamer", description: "pwn3r3r 0f n00bz" },
]

var applications = [
    { id: "1", jobId: "1", applicantId: "1" },
    { id: "2", jobId: "2", applicantId: "1" },
    { id: "3", jobId: "3", applicantId: "1" }
]

//TYPE DEFINITIONS (SCHEMA)
const ApplicantType = new GraphQLObjectType({
    name: 'Applicant',
    fields: () => ({
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        applications: {
            type: new GraphQLList(ApplicationType),
            resolve(parent, args) {
                return _.filter(applications, {applicantId: parent.id})
            }
        }
    })
})

const JobType = new GraphQLObjectType({
    name: 'Job',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        applications: {
            type: new GraphQLList(ApplicationType),
            resolve (parent, args) {
                return _.filter(applications, {jobId: parent.id});
            }
        },
        //this is a more complex resolve method, because we need to go through a joining table, applications
        //(my job entity does not refer to applications)
        applicants: {
            type: new GraphQLList(ApplicantType),
            resolve (parent, args) {
                //get applications for this job
                let jobApplicants = _.filter(applications, {jobId: parent.id});

                //get applicants with applications for this job
                let applicantIds = jobApplicants.map(x => x.applicantId);
                return _.filter(applicants, (applicant) => { return applicantIds.includes(applicant.id) })
            }
        },
    })
})

const ApplicationType = new GraphQLObjectType({
    name: 'Application',
    fields: () => ({
        id: { type: GraphQLID },
        job: { 
            type: JobType,
            resolve(parent, args) {
                return _.find(jobs, { id: parent.jobId })
            }
         },
        applicant: { 
            type: ApplicantType, 
            resolve(parent, args) {
                return _.find(applicants, {id: parent.applicantId})
            } 
        },
    })
})

//TODO: need a back end DB before I can do this...
// const Mutation = new GraphQLObjectType({
//     name: 'Mutation',
//     fields: {
//     }
// })

//ROOT QUERIES
const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        applicant: { //GET /applicants/:id
            type: ApplicantType,
            args: { 
                id: { type: GraphQLID },
                lastName: { type: GraphQLString }
            },
            resolve(parent, args) {
                const applicantsWithId = _.filter(applicants, {id: args.id});
                
                if (args.lastName) { //optional argument
                    return _.find(applicantsWithId, {lastName: args.lastName});
                } else {
                    if (applicantsWithId.size === 1) return applicantsWithId[0];
                    throw "Multiple applicants found with id 1";
                }
            }
        },
        applicants: { //GET /applicants
            type: new GraphQLList(ApplicantType),
            args: {},
            resolve(parent, args) {
                return applicants
            }
        },
        job: { //GET /job/:id
            type: JobType,
            args: {id: {type:GraphQLID}},
            resolve(parent, args) {
                return _.find(jobs, {id: args.id})
            }
        },
        jobs: { //GET /jobs
            type: new GraphQLList(JobType),
            resolve() {
                return jobs
            }
        },
        application: { //GET /applications/:id
            type: ApplicationType,
            args: {id: {type:GraphQLID}, jobId: {type:GraphQLID}, applicantId: {type:GraphQLID}}, //todo: how do i support these too?
            resolve(parent, args) {
                return _.find(applications, {id: args.id})
            }
        },
        applications: { //GET /applications
            type: new GraphQLList(ApplicationType),
            resolve() {
                return applications
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})