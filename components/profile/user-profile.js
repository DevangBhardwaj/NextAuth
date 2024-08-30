import { useState, useEffect } from "react";
import ProfileForm from "./profile-form";
import { getSession } from "next-auth/react";
import classes from "./user-profile.module.css";

function UserProfile() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        window.location.href = "/auth";
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (isLoading) {
    <p className={classes.profile}>Loading...</p>;
  }

  // Redirect away if NOT auth

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
}

export default UserProfile;
