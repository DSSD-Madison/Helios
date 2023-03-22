import {
  Drawer,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";

import AppBar from "@mui/material/AppBar";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import DashboardIcon from "@mui/icons-material/Dashboard";
import KeyIcon from "@mui/icons-material/Key";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

const menuOptions = [
  {
    title: "Dashboard",
    path: "/",
    icon: DashboardIcon,
  },
  {
    title: "What If?",
    path: "/what-if",
    icon: QuestionMarkIcon,
  },
  {
    title: "Admin",
    path: "/admin",
    icon: KeyIcon,
  },
];

const Navigation = ({ title, ...props }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width:600px)");

  return (
    <>
      <Drawer open={menuOpen && !isDesktop} onClose={() => setMenuOpen(false)}>
        <Box sx={{ width: 250 }} onClick={() => setMenuOpen(false)}>
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.title} disablePadding>
                <ListItemButton component={Link} to={item.path}>
                  <ListItemIcon>
                    <Icon component={item.icon} />
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <AppBar position="fixed" {...props}>
        <Toolbar>
          {!isDesktop && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title} | <b>Helios</b>
          </Typography>

          {isDesktop && menuOptions.map((item) => (
            <Button color="inherit" component={Link} to={item.path} key={item.title}>
              {item.title}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navigation;
