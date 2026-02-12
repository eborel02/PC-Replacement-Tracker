import React from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { mainNavBarItems } from './consts/navBarListItems';
import { navBarStyles } from './styles';
import { NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <Drawer
        sx={ navBarStyles.drawer }
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        
        <List>
          {mainNavBarItems.map((text) => (
            <ListItem key={ text.id } disablePadding>
              <ListItemButton component={NavLink} to={text.route} selected={location.pathname.includes(text.route)}>
                <ListItemIcon sx={ navBarStyles.icons }>
                  {text.icon}
                </ListItemIcon>
                <ListItemText sx={ navBarStyles.text } primary={ text.label } />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

      </Drawer>
  );
}

export default Navbar