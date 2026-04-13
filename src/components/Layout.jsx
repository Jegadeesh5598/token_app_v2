import React from "react";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "linear-gradient(90deg, #0f2a55 0%, #113560 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 72, gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  color: "#0f2a55",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 700,
                }}
              >
                RT
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "0.08em" }}>
                Ration Token Management
              </Typography>
            </Box>
            <Typography sx={{ color: "rgba(255,255,255,0.78)", ml: "auto" }}>
              Secure distribution · Audit-ready · Mobile responsive
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ background: "linear-gradient(180deg, #f8fafc 0%, #eef3f8 100%)", minHeight: "100vh", pb: 6 }}>
        {children}
      </Box>
    </>
  );
};

export default Layout;
