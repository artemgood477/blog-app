import { AppBar, Box, Button, Toolbar } from '@mui/material';
import { signOut } from 'firebase/auth';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const Navbar = () => {
    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AppBar style={{ display: 'flex', alignItems: 'center' }}>
            <Toolbar>
                <Box display="flex" gap="10px">
                    <Button onClick={() => navigate('/viewblogs')} color="inherit">View Blogs</Button>
                    <Button onClick={() => navigate('/createblog')} color="inherit">Create Blog</Button> {/* Fixed path */}
                    <Button onClick={() => navigate('/viewfavorites')} color="inherit">View Favorites</Button>
                    <Button onClick={handleSignout} variant="outlined" style={{ color: 'white', border: '1px solid white' }}>
                        Signout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
