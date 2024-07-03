import { useState } from 'react';
import Card from '@mui/material/Card';
//import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import MapPinIcon from '@mui/icons-material/Room';
import UserOrders from '../pages/userOrders/UserOrders';


export default function ProfileComponent() {
  const [interests] = useState(['Beaches', 'Mountains', 'Cities']); // Replace with actual data

  return (
    <Card className="w-full max-w-md">

      <CardContent className="p-6 bg-muted text-muted-foreground">
        <Grid container spacing={4} alignItems="center">
          <Grid item>
            <Avatar className="w-16 h-16 border-2 border-primary">
              <Avatar alt="John Doe" src="https://firebasestorage.googleapis.com/v0/b/mantratour-37a6e.appspot.com/o/logo%20mantra.png?alt=media&token=add80bfd-737e-4d8f-a001-c0a2a43493fc" />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" component="div" className="font-semibold">
              John Doe
            </Typography>
            <Typography variant="body2" className="text-muted-foreground">
              32 years old
            </Typography>
            <Typography variant="body2" className="text-muted-foreground">
              <MapPinIcon sx={{ width: '1em', height: '1em', marginRight: '0.5em' }} />
              San Francisco, CA
            </Typography>
          </Grid>
        </Grid>
        <Separator className="my-6" />
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" className="font-medium text-foreground">
              Travel Interests
            </Typography>
            <div className="flex gap-2 mt-2">
              {interests.map((interest, index) => (
                <Chip key={index} label={interest} variant="outlined" />
              ))}
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" className="font-medium text-foreground">
              About Me
            </Typography>
            <Typography variant="body2" className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis libero
              justo, sed dignissim nunc iaculis sit amet.
            </Typography>
            <UserOrders/>
          </Grid>

        </Grid>
        
      </CardContent>

    </Card>
  );
}


function Separator({ className }) {
  return <hr className={className} />;
}
