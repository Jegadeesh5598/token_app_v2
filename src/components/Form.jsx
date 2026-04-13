import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, MenuItem, Paper, Typography, Box } from "@mui/material";
import Swal from "sweetalert2";
import { addEntry, updateEntry } from "../api";

const Form = ({ refresh, editData, setEditData }) => {
  const [form, setForm] = useState({
    serial_number: "",
    token_number: "",
    ration_card_number: "",
    no_of_voters: "",
    no_of_non_voters: "",
    no_of_total_peoples: "",
    phone_number: "",
    admin: "Jegadeesh",
  });

  useEffect(() => {
    if (editData) setForm(editData);
  }, [editData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (form.phone_number && form.phone_number.length !== 10) {
      Swal.fire("Error", "Phone must be 10 digits", "error");
      return false;
    }

    if (form.ration_card_number && form.ration_card_number.length !== 12) {
      Swal.fire("Error", "Ration must be 12 digits", "error");
      return false;
    }

    if (
      Number(form.no_of_total_peoples) !==
      Number(form.no_of_voters) + Number(form.no_of_non_voters)
    ) {
      Swal.fire("Error", "Total mismatch", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editData) {
        await updateEntry(editData.id, form);
        Swal.fire("Updated!", "Entry updated successfully.", "success");
        setEditData(null);
      } else {
        await addEntry(form);
        Swal.fire("Success!", "Entry added successfully.", "success");
      }

      refresh();
      setForm({
        serial_number: "",
        token_number: "",
        ration_card_number: "",
        no_of_voters: "",
        no_of_non_voters: "",
        no_of_total_peoples: "",
        phone_number: "",
        admin: "Jegadeesh",
      });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Unable to save entry.", "error");
    }
  };

  return (
    <Paper elevation={10} sx={{ p: 4, borderRadius: 5, backgroundColor: "#ffffff", boxShadow: "0 24px 64px rgba(15, 42, 85, 0.12)" }}>
      <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {editData ? "Edit Entry" : "Add Entry"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Capture ration token details in a secure, audit-ready form. Fields are grouped for faster entry and better clarity.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="serial_number"
              label="Serial (comma)"
              fullWidth
              variant="outlined"
              value={form.serial_number}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="token_number"
              label="Token"
              fullWidth
              variant="outlined"
              required
              value={form.token_number}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="ration_card_number"
              label="Ration Card"
              fullWidth
              variant="outlined"
              required
              value={form.ration_card_number}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="no_of_voters"
              label="Voters"
              type="number"
              fullWidth
              variant="outlined"
              value={form.no_of_voters}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="no_of_non_voters"
              label="Non Voters"
              type="number"
              fullWidth
              variant="outlined"
              value={form.no_of_non_voters}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="no_of_total_peoples"
              label="Total"
              type="number"
              fullWidth
              variant="outlined"
              value={form.no_of_total_peoples}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="phone_number"
              label="Phone"
              fullWidth
              variant="outlined"
              value={form.phone_number}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              name="admin"
              label="Admin"
              fullWidth
              variant="outlined"
              value={form.admin}
              onChange={handleChange}
            >
              <MenuItem value="Jegadeesh">Jegadeesh</MenuItem>
              <MenuItem value="Divya">Divya</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, flexWrap: "wrap" }}>
              {editData && (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => setEditData(null)}
                  sx={{ borderRadius: 3, textTransform: "none", px: 4 }}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                type="submit"
                size="large"
                sx={{
                  px: 4,
                  borderRadius: 3,
                  textTransform: "none",
                  background: "linear-gradient(135deg, #0f2a55 0%, #3b6fa7 100%)",
                  boxShadow: "0 16px 28px rgba(15, 42, 85, 0.18)",
                }}
              >
                {editData ? "Update" : "Submit"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default Form;
