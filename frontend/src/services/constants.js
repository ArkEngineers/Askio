export const BASE_URL = "http://localhost:8000";
export const RAG_BASE_URL = "http://localhost:5000";

export const AUTH_ROUTE = `${BASE_URL}/api/v1`;
export const RAG_ROUTE = `${RAG_BASE_URL}/api/v1/RAG/`;
export const GET_GOOGLE_TOKEN=`${BASE_URL}/api/v1/auth/getLoginURL`
export const QUERY_ROUTE = `${RAG_BASE_URL}/api/v1/RAG/query`;
`${AUTH_ROUTE}/group/user/:userEmail/groups`;
export const UPDATE_ASKIO_CLASS=`${BASE_URL}/api/v1/auth/update_group`


const CLASSROOM_BASE_URL="https://classroom.googleapis.com"
export const LIST_COURSE=`${CLASSROOM_BASE_URL}/v1/courses`
export const GET_USER_PROFILE=`${CLASSROOM_BASE_URL}/v1/auth/userProfiles`