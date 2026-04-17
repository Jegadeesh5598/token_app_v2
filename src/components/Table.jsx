import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  Typography,
  Box,
} from "@mui/material";
import Swal from "sweetalert2";
import { deleteEntry } from "../api";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const TableComponent = ({ data, refresh, setEditData }) => {
  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "Delete entry?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!res.isConfirmed) return;

    await deleteEntry(id);
    Swal.fire("Deleted", "The entry has been removed.", "success");
    refresh();
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ boxShadow: "none" }}>
      <Box sx={{ px: 2, py: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Latest token records
        </Typography>
        <Typography color="textSecondary">{data.length} records</Typography>
      </Box>
      <Table sx={{ minWidth: 680 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#0f2a55" }}>
            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Serial</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Token</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Phone</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Ration</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Voters</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Non Voters</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Total</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Admin</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Created</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Updated</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>{row.serial_number}</TableCell>
              <TableCell>{row.token_number}</TableCell>
              <TableCell>{row.phone_number}</TableCell>
              <TableCell>{row.ration_card_number}</TableCell>
              <TableCell>{row.no_of_voters}</TableCell>
              <TableCell>{row.no_of_non_voters}</TableCell>
              <TableCell>{row.no_of_total_peoples}</TableCell>
              <TableCell>{row.admin}</TableCell>
              <TableCell>{formatDate(row.created_at || row.createdAt)}</TableCell>
              <TableCell>{formatDate(row.updated_at || row.updatedAt)}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <Button variant="outlined" size="small" onClick={() => setEditData(row)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="error" size="small" onClick={() => handleDelete(row.id)}>
                    Delete
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
