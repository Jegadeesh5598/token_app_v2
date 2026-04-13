import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Container, Grid, Paper, Typography, TextField, MenuItem } from "@mui/material";
import { getEntries, getAdminUsers } from "./api";
import Form from "./components/Form";
import TableComponent from "./components/Table";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


function App() {
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");

  const fetchData = async () => {
    const res = await getEntries();
    setData(res.data);
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await getAdminUsers();
      const users = Array.isArray(res.data) ? res.data : [];
      const names = users
        .map((item) => (typeof item === "string" ? item : item.name || item.username || item.admin || ""))
        .filter(Boolean);
      setAdminUsers(names);
      if (!selectedAdmin && names.length) {
        setSelectedAdmin(names[0]);
      }
    } catch (err) {
      console.warn("Unable to load admin users", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAdminUsers();
  }, []);

  const adminOptions = adminUsers.length
    ? adminUsers
    : [...new Set(data.map((item) => item.admin))].filter(Boolean);

  useEffect(() => {
    if (!selectedAdmin && adminOptions.length) {
      setSelectedAdmin(adminOptions[0]);
    }
  }, [adminOptions, selectedAdmin]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aToken = a.token_number?.toString().trim() || "";
      const bToken = b.token_number?.toString().trim() || "";
      const aNum = Number(aToken);
      const bNum = Number(bToken);
      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
        return aNum - bNum;
      }
      return aToken.localeCompare(bToken, undefined, { numeric: true, sensitivity: "base" });
    });
  }, [data]);

  const selectedAdminData = selectedAdmin ? sortedData.filter((item) => item.admin === selectedAdmin) : sortedData;

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const downloadUserWiseReport = () => {
    // ✅ Add S.No (order wise)
    const formattedData = selectedAdminData.map((row, index) => ({
      "S.No": index + 1,
      "Serial": row.serial_number,
      "Token": row.token_number,
      "Ration": row.ration_card_number,
      "Voters": row.no_of_voters,
      "Non Voters": row.no_of_non_voters,
      "Total": row.no_of_total_peoples,
      "Phone": row.phone_number,
      "Admin": row.admin,
      "Created": formatDate(row.created_at || row.createdAt),
      "Updated": formatDate(row.updated_at || row.updatedAt),
    }));

    // ✅ Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // ✅ Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Report");

    // ✅ Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // ✅ Download
    saveAs(file, `${selectedAdmin || "userwise"}-report.xlsx`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={5}>
          <Form refresh={fetchData} editData={editData} setEditData={setEditData} />
        </Grid>

        <Grid item xs={12} lg={7}>
          <Paper elevation={8} sx={{ p: 3, borderRadius: "24px", background: "rgba(255, 255, 255, 0.98)" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Token Records
            </Typography>
            <TableComponent data={sortedData} refresh={fetchData} setEditData={setEditData} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={8} sx={{ p: 3, borderRadius: "24px", background: "rgba(255, 255, 255, 0.98)" }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  UserWise Table
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Select an admin user from the linked admin table and view the total assigned records.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Typography color="textSecondary">Total admins: {adminOptions.length}</Typography>
                <TextField
                  select
                  label="Admin user"
                  value={selectedAdmin}
                  onChange={(e) => setSelectedAdmin(e.target.value)}
                  size="small"
                  sx={{ minWidth: 220 }}
                >
                  {adminOptions.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={downloadUserWiseReport}
                  sx={{ whiteSpace: "nowrap", borderRadius: 3 }}
                >
                  Get Report
                </Button>
              </Box>
            </Box>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Records for selected admin: {selectedAdminData.length}
            </Typography>
            <TableComponent data={selectedAdminData} refresh={fetchData} setEditData={setEditData} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
