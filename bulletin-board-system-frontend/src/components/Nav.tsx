import React from "react";
import { Link } from "react-router-dom";
import RootStore from "../stores/RootStore";
import { observer } from "mobx-react-lite";
import { logout } from "../api";

interface NavProps {
  rootStore: RootStore;
}

export const Nav: React.FC<NavProps> = observer(({ rootStore }) => {
  const handleLogout = async (
    e: React.MouseEvent<HTMLButtonElement> | undefined
  ) => {
    console.log(rootStore.userStore?.currentUser?.key);
    const { status } = await logout(rootStore.userStore?.currentUser?.key!);
    if (status === 204) {
      rootStore.userStore?.setCurrentUser(null);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link to="/" className="p-3">
          Bulletin Board System
        </Link>

        <div className="d-flex">
          {rootStore.userStore?.currentUser === null ? (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          ) : (
            <>
              <p className="text-light mt-3 me-5">
                Welcome {rootStore.userStore?.currentUser.user.name}
              </p>
              <Link
                className="mt-3"
                to={`/profile/${rootStore.userStore?.currentUser.user.id}`}
              >
                Profile
              </Link>
              <button
                type="button"
                className="btn btn-dark"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
});
