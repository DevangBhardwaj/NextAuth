import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import classes from "./auth-form.module.css";
import { useRouter } from "next/router";

async function createUser(email, password) {
  const response = await fetch("", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!data.ok) {
    throw new Error("Something went wrong.");
  }
  return data;
}

function AuthForm() {
  const router = useRouter();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHanlder = async (e) => {
    e.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (isLogin) {
      //first argument to signIn() is name of provider, here we are using credentials provider,
      //others may be google or github
      //second argument is configs
      const result = await signIn("credentials", {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });
      console.log("result:", result);
      if (!result.error) {
        router.push("/profile");
      }
    } else {
      try {
        const result = await createUser(enteredEmail, enteredPassword);
        console.log(result);

        if (!result.error) {
          //set some auth state
        }
      } catch (err) {
        // console.log(err);
      }
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHanlder}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
