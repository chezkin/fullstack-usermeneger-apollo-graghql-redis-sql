import { useSubscription, gql } from "@apollo/client";


const QUERY = gql`
query users {
    users {
    firstname
    lastname
    }
}
`;

const SUBSCRIPTION = gql`
subscription Users {
    users {
    firstname
    lastname
    email
}
}
`;

export { QUERY, SUBSCRIPTION }

function LatestComment() {
    const { data, loading } = useSubscription(
        SUBSCRIPTION,
    );
    return !loading && data.commentAdded.content
}