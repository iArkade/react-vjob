import { Box } from "@mui/material"
import { Outlet } from 'react-router-dom';


export const AuthLayout = () => {
     return (
          <Box
               sx={{
               //display: { xs: 'flex', lg: 'grid' },
               flexDirection: 'column',
               gridTemplateColumns: '1fr 1fr',
               minHeight: '100%',
               }}
          >
               <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
                    <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
                         <Box sx={{ maxWidth: '450px', width: '100%' }}>
                              <Outlet />
                         </Box>
                    </Box>
               </Box>

          </Box>   
     )
}
