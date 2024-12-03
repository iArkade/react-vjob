import { Box } from "@mui/material"
import { Outlet } from 'react-router-dom';


export const RegisterCompanyPage = () => {
     return (
          <Box
               sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    p: { xs: 2, md: 3 },
               }}
          >
               <Box sx={{ maxWidth: '560px', width: '100%' }}>
                    <div>hola esta es una prueba</div>
               </Box>
          </Box>   
     )
}
