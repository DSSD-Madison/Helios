import {
  Box,
  Button,
  Container,
  FormHelperText,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { Link, useSearchParams } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { object, ref, string } from "yup";
import { useLocation, useNavigate } from "react-router";

import Input from "../components/Input.js";
import Page from "../layouts/Page";
import { Stack } from "@mui/system";
import { auth } from "../firebase.js";
import { useEffect } from "react";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const action = location.pathname.split("/").pop();

  // When authenticated, redirect
  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      if (user) {
        const redirect = searchParams.get("redirect");

        navigate(redirect ? redirect : "/admin");
      }
    });

    return () => {
      unSub();
    };
  }, [navigate]);

  const getTitle = () => {
    switch (action) {
      case "create-account":
        return "Create Account";
      case "reset-password":
        return "Reset Password";
      default:
        return "Log In";
    }
  };

  const AuthLinks = () => {
    return (
      <Box sx={{ textAlign: "center" }}>
        {action !== "log-in" && (
          <Button component={Link} to="/auth/log-in">
            Log In
          </Button>
        )}
        {action !== "create-account" && (
          <Button component={Link} to="/auth/create-account">
            Create Account
          </Button>
        )}
        {action !== "reset-password" && (
          <Button component={Link} to="/auth/reset-password">
            Reset Password
          </Button>
        )}
      </Box>
    );
  };

  const validationSchema = (values) =>
    object().shape({
      action: string(),
      email: string()
        .email("Must be a valid email")
        .required("Must enter email address"),
      password: string()
        .min(8, "Password is too weak")
        .when("action", {
          is: (val) => val !== "reset-password",
          then: (schema) => schema.required("Must enter password"),
        }),
      confirmPassword: string().when("action", {
        is: (val) => val === "create-account",
        then: (schema) =>
          schema
            .required("Must confirm password")
            .oneOf([ref("password"), null], "Passwords must match"),
      }),
    });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    switch (action) {
      case "create-account":
        try {
          await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
          );
        } catch (err) {
          setErrors({ submit: err.message });
          return;
        }

        break;
      case "reset-password":
        try {
          await sendPasswordResetEmail(auth, values.email);
        } catch (err) {
          setErrors({ submit: err.message });
          return;
        }

        break;
      default:
        try {
          await signInWithEmailAndPassword(auth, values.email, values.password);
        } catch (err) {
          setErrors({ submit: err.message });
          return;
        }
        break;
    }

    setSubmitting(false);
  };

  return (
    <Page title={getTitle()}>
      <Container maxWidth="sm">
        <Typography variant="h3" align="center" gutterBottom>
          {getTitle()}
        </Typography>

        <Formik
          enableReinitialize
          initialValues={{
            action,
            email: "",
            password: "",
            confirmPassword: "",
            submit: null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form>
              <Stack spacing={2}>
                <Input
                  name="email"
                  label="Email"
                  type="text"
                  variant="outlined"
                  formik={formik}
                />
                {action !== "reset-password" && (
                  <>
                    <Input
                      name="password"
                      label="Password"
                      type="password"
                      variant="outlined"
                      formik={formik}
                    />
                    {action === "create-account" && (
                      <Input
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        formik={formik}
                      />
                    )}
                  </>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting}
                >
                  Submit
                </Button>

                <AuthLinks />

                {formik.errors.submit && (
                  <Box mt={3}>
                    <FormHelperText error sx={{ textAlign: "center" }}>
                      {formik.errors.submit}
                    </FormHelperText>
                  </Box>
                )}
              </Stack>
            </Form>
          )}
        </Formik>
      </Container>
    </Page>
  );
};

export default Login;
