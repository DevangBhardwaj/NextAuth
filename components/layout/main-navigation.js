import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import classes from "./main-navigation.module.css";

function MainNavigation() {
  const { data: session, status } = useSession();
  console.log(session,"session")
  // data: Can be Session, undefined, or null. When the session hasn’t been fetched yet, data is undefined.
  // In case of a failed retrieval, it’s null. On success, it’s the actual Session object.
  //status can have 3 values:
  //1."loading": Indicates that the session data is still being fetched or verified.
  //2."authenticated": Indicates that the user is authenticated, and the session data is available.
  //3."unauthenticated": Indicates that the user is not authenticated, and there is no valid session data.

  const logoutHandler = () => {
    // The callbackUrl in NextAuth.js’s signOut() function specifies the URL to which the user will be redirected after signing out.
    // By default, it uses the current URL,
    // but you can customize it by passing a different callbackUrl as the second argument to signOut().
    signOut(); //returns a promise to tell if the work is done or not
    // signOut({ callbackUrl: `/protected` });
  };

  return (
    <header className={classes.header}>
      <Link href="/">
        <div className={classes.logo}>Next Auth</div>
      </Link>
      <nav>
        <ul>
          {!session && (
            <li>
              <Link href="/auth">Login</Link>
            </li>
          )}
          {!!session && !!session.authToken && (
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          )}
          {!!session && !!session.authToken && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
