import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    loading: true,
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);

  //   get Serch users
  const searchUsers = async (text) => {
    const params = new URLSearchParams({
      q: text,
    });

    const response = await fetch(`${GITHUB_URL}/search/users?${params}`);
    const { items } = await response.json();
    dispatch({
      type: "SEARCH_USERS",
      payload: items,
    });
  };

  // get single user
  const getUser = async (login) => {
    const response = await fetch(`${GITHUB_URL}/users/${login}`);
    if (response.status === 404) {
      window.location = "/notfound";
    } else {
      const data = await response.json();

      dispatch({
        type: "GET_USER",
        payload: data,
      });
    }
  };

  // clear users from state

  const clearUsers = () => dispatch({ type: "CLEAR_USERS" });

  const fetchUsers = async () => {
    const response = await fetch(`${GITHUB_URL}/users`);
    const data = await response.json();
    dispatch({
      type: "GET_USERS",
      payload: data,
    });
  };
  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        user: state.user,
        fetchUsers,
        searchUsers,
        clearUsers,
        getUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
