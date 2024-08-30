import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';

import { MainNav } from './main-nav';
import { SideNav } from './side-nav';
import { layoutConfig } from '../config';



function Copyright(props: any) {
     return (
          <Typography variant="body2" color="text.secondary" align="center" {...props}>
               {'Copyright © '}
               <Link color="inherit" href="https://mui.com/">
                    Your Website
               </Link>{' '}
               {new Date().getFullYear()}
               {'.'}
          </Typography>
     );
}

export interface VerticalLayoutProps {
     children?: React.ReactNode;
}

export default function Layout() {
     return (
          <React.Fragment>
               <GlobalStyles
                    styles={{
                         body: {
                              '--MainNav-height': '56px',
                              '--MainNav-zIndex': 1000,
                              '--SideNav-width': '280px',
                              '--SideNav-zIndex': 1100,
                              '--MobileNav-width': '320px',
                              '--MobileNav-zIndex': 1100,
                         },
                    }}
               />
               <Box
                    sx={{
                         bgcolor: 'var(--mui-palette-background-default)',
                         display: 'flex',
                         flexDirection: 'column',
                         position: 'relative',
                         minHeight: '100%',
                    }}
               >
                    {/* <SideNav color={settings.navColor} items={layoutConfig.navItems} /> */}
                    <SideNav  items={layoutConfig.navItems} />
                    <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>
                         <MainNav items={layoutConfig.navItems} />
                         <Box
                              component="main"
                              sx={{
                                   '--Content-margin': '0 auto',
                                   '--Content-maxWidth': 'var(--maxWidth-xl)',
                                   '--Content-paddingX': '24px',
                                   '--Content-paddingY': { xs: '24px', lg: '64px' },
                                   '--Content-padding': 'var(--Content-paddingY) var(--Content-paddingX)',
                                   '--Content-width': '100%',
                                   display: 'flex',
                                   flex: '1 1 auto',
                                   flexDirection: 'column',
                              }}
                         >
                              {/* {children} */}
                         </Box>
                    </Box>
               </Box>
          </React.Fragment>
     );
     //////////////////////////////////////////////////////////

     // const dispatch = useDispatch();
     // const navigate = useNavigate();

     // const [open, setOpen] = React.useState(true);
     // const toggleDrawer = () => {
     //      setOpen(!open);
     // };

     // const logOut = () =>{
     //      dispatch(clearUser())
     //      navigate('/auth/login')
     // }

     // return (

     //      // <Box sx={{ display: 'flex' }}>
     //      //      <CssBaseline />
     //      //      <AppBar position="absolute" open={open}>
     //      //           <Toolbar
     //      //                sx={{
     //      //                     pr: '24px', // keep right padding when drawer closed
     //      //                }}
     //      //           >
     //      //                <IconButton
     //      //                     edge="start"
     //      //                     color="inherit"
     //      //                     aria-label="open drawer"
     //      //                     onClick={toggleDrawer}
     //      //                     sx={{
     //      //                          marginRight: '36px',
     //      //                          ...(open && { display: 'none' }),
     //      //                     }}
     //      //                >
     //      //                     <MenuIcon />
     //      //                </IconButton>
     //      //                <Typography
     //      //                     component="h1"
     //      //                     variant="h6"
     //      //                     color="inherit"
     //      //                     noWrap
     //      //                     sx={{ flexGrow: 1 }}
     //      //                >
     //      //                     Dashboard
     //      //                </Typography>
     //      //                <IconButton color="inherit">
     //      //                     <Badge badgeContent={4} color="secondary">
     //      //                          <NotificationsIcon />
     //      //                     </Badge>
     //      //                     <LogoutIcon 
     //      //                          sx={{ marginLeft: 3 }}
     //      //                          onClick={logOut}
     //      //                     />
     //      //                </IconButton>
     //      //           </Toolbar>
     //      //      </AppBar>
     //      //      <Drawer variant="permanent" open={open}>
     //      //           <Toolbar
     //      //                sx={{
     //      //                     display: 'flex',
     //      //                     alignItems: 'center',
     //      //                     justifyContent: 'flex-end',
     //      //                     px: [1],
     //      //                }}
     //      //           >
     //      //                <IconButton onClick={toggleDrawer}>
     //      //                     <ChevronLeftIcon />
     //      //                </IconButton>
     //      //           </Toolbar>
     //      //           <Divider />
     //      //           <List component="nav">
     //      //                {mainListItems}
     //      //                <Divider sx={{ my: 1 }} />
     //      //                {secondaryListItems}
     //      //           </List>
     //      //      </Drawer>
     //      //      <Box
     //      //           component="main"
     //      //           sx={{
     //      //                backgroundColor: (theme) =>
     //      //                     theme.palette.mode === 'light'
     //      //                          ? theme.palette.grey[100]
     //      //                          : theme.palette.grey[900],
     //      //                flexGrow: 1,
     //      //                height: '100vh',
     //      //                overflow: 'auto',
     //      //           }}
     //      //      >
     //      //           <Toolbar />
     //      //           <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
     //      //                <Grid container spacing={3}>
     //      //                     <Outlet />
     //      //                </Grid>
     //      //                <Copyright sx={{ pt: 4 }} />
     //      //           </Container>
     //      //      </Box>
     //      // </Box>
     // );
}