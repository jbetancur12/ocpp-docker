import React, { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { LoginOutlined } from '@mui/icons-material'

const Login = () => {
  const [formState, setFormState] = useState({
    email: '',
    password: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formState);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          flexDirection="column"
          maxWidth={400}
          alignItems="center"
          justifyContent="center"
          margin="auto"
          marginTop={5}
          padding={3}
          borderRadius={5}
          boxShadow="5px 5px 10px #ccc"
          sx={{
            ':hover': {
              boxShadow: '10px 10px 20px #ccc'
            }
          }}
        >
          <Typography variant="h2" padding={3} textAlign="center">
            Login
          </Typography>
          <TextField
            onChange={handleChange}
            name="email"
            value={formState.email}
            margin="normal"
            type="email"
            variant="outlined"
            placeholder="Email"
          />
          <TextField
            onChange={handleChange}
            name="password"
            value={formState.password}
            margin="normal"
            type="password"
            variant="outlined"
            placeholder="Password"
          />
          <Button
            endIcon={<LoginOutlined />}
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 3, borderRadius: 3 }}
          >
            Login
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Login;