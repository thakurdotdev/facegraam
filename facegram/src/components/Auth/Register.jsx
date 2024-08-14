import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { toast } from "sonner";
import axios from "axios";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingScreen from "../Load";
import googleIcon from "/google.png?url";

const errMess = {
  message: "This field is required",
};

const validationSchema = yup.object().shape({
  name: yup.string().required(errMess.message),
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .required(errMess.message),
  email: yup.string().required(errMess.message).email("Email is Invalid"),
  password: yup
    .string()
    .required(errMess.message)
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character",
    ),
  bio: yup.string().required(errMess.message),
  profilepic: yup
    .mixed()
    .test("file", "Please upload an Image File", (file) => {
      return file && file.length > 0;
    })
    .test("fileType", "Only images are allowed", (file) => {
      const acceptedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];
      return file && acceptedTypes.includes(file[0]?.type);
    })
    .test("fileSize", "The file is too large", (file) => {
      return file && file[0]?.size < 5000000;
    }),
});

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleFormSubmit = async (data) => {
    const userData = {
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
      bio: data.bio,
      profilepic: data.profilepic[0],
    };

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/register`,
        userData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        setLoading(false);
        toast.success(response.data.message);
        navigate("/verify", {
          state: { email: data.email, name: data.name },
        });
      }
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  const handleError = (error) => {
    let errorMessage = "An error occurred. Please try again.";
    if (error.response && error.response.status === 400) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Box
      sx={{
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          padding: "30px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, color: "#333", marginBottom: "20px" }}
        >
          Register
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                size="small"
                variant="outlined"
                margin="normal"
                sx={{ marginBottom: "16px" }}
              />
            )}
          />
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Username"
                error={!!errors.username}
                helperText={errors.username?.message}
                fullWidth
                size="small"
                variant="outlined"
                margin="normal"
                sx={{ marginBottom: "16px" }}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                size="small"
                variant="outlined"
                margin="normal"
                sx={{ marginBottom: "16px" }}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type={showPassword ? "text" : "password"}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                size="small"
                variant="outlined"
                margin="normal"
                sx={{ marginBottom: "16px" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="bio"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Bio"
                error={!!errors.bio}
                helperText={errors.bio?.message}
                fullWidth
                size="small"
                variant="outlined"
                margin="normal"
                multiline
                rows={2}
                sx={{ marginBottom: "16px" }}
              />
            )}
          />
          <Controller
            name="profilepic"
            control={control}
            defaultValue=""
            render={({ field: { onChange, ...rest } }) => (
              <TextField
                {...rest}
                type="file"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => onChange(e.target.files)}
                error={!!errors.profilepic}
                helperText={errors.profilepic?.message}
                fullWidth
                size="small"
                variant="outlined"
                margin="normal"
                sx={{ marginBottom: "24px" }}
              />
            )}
          />
          <Button
            variant="outlined"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              color: "#333",
              fontWeight: 600,
              borderColor: "#333",
              padding: "10px 0",
            }}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        <Typography
          variant="body2"
          align="center"
          sx={{ marginTop: "16px", color: "#666" }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#1976d2", fontWeight: 500 }}>
            Login
          </Link>
        </Typography>
        <Box mt={2} width="100%">
          <Button
            onClick={() => {
              window.location.href = `${
                import.meta.env.VITE_API_URL
              }/api/auth/google`;
            }}
            variant="text"
            fullWidth
            startIcon={
              <img src={googleIcon} width="30" height="30" alt="google" />
            }
            sx={{
              backgroundColor: "#f5f5f5",
              color: "#333",
              borderColor: "#333",
              fontWeight: 600,
              padding: "10px 0",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Register with Google
          </Button>
        </Box>
      </Box>
      <LoadingScreen isLoading={loading} />
    </Box>
  );
};

export default Register;
