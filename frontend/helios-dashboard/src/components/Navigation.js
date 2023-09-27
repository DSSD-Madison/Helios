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
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import heliosLogo from "../assets/logo.png";
import useMediaQuery from "@mui/material/useMediaQuery";
import dssdLogo from "../assets/dssd_logo_dark.svg"

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
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "white", color: "black" }}
        {...props}
      >
        <Toolbar>
          {!isDesktop && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: [1, 2] }}
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}

          <a href="https://www.heliosuwmadison.org/" target="_blank" rel="noreferrer">
            <img
              style={{ height: isDesktop ? "40px" : "30px" }}
              src={heliosLogo}
              alt="Helios Logo"
            />
          </a>
          <Typography variant="h3" sx={{ color: "#242424", paddingLeft: 1, paddingRight: 2 }}>
            X
          </Typography>
          <a href="https://madison.dssdglobal.org/" target="_blank" rel="noreferrer">
            <img
              style={{ height: isDesktop ? "40px" : "30px" }}
              src={dssdLogo}
              alt="Data Science for Sustainable Development Logo"
            />
          </a>
          <Typography
            variant={isDesktop ? "h5" : "h6"}
            component="div"
            sx={{ color: "black", pl: [1.5, 3], flexGrow: 1 }}
          >
            {title}
          </Typography>

          {isDesktop &&
            menuOptions.map((item) => (
              <Button
                color="inherit"
                component={Link}
                to={item.path}
                key={item.title}
              >
                {item.title}
              </Button>
            ))}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navigation;
