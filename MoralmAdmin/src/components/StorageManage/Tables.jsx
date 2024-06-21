import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "../../Admin.css";
import ModeIcon from '@mui/icons-material/Mode';

const API_URL = "http://127.0.0.1:8000";

// to style the Edit User text in the popup (this comment below only so the theme is not red underlined)
// eslint-disable-next-line no-unused-vars
const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

// style the edit and delete buttons in the table
// eslint-disable-next-line no-unused-vars
const EditAndDeleteColorButton = styled(Button)(({ theme }) => ({
  color: "#fff", // Text color
  borderRadius: "10px",
  backgroundColor: "#033324",
  "&:hover": {
    color: "#fff",
    backgroundColor: "#274C08", // Darker green on hover
  },
}));

// style the Done button in the popup
// eslint-disable-next-line no-unused-vars
const DoneColorButton = styled(Button)(({ theme }) => ({
  color: "white",
  width: "18vw",
  height: "4vh",
  borderRadius: 20,
  fontWeight: 400,
  textTransform: "none",
  fontSize: 20,
  backgroundColor: "#467E18",
  "&:hover": {
    backgroundColor: "#274C08",
  },
}));

// style the popup content positioning
const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1), // Spacing between the form elements
}));

// style the green buttons in the popup so it stays in the middle
const StyledDialogActions = styled(DialogActions)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

// style the input text fields
const LabelInputContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  paddingBottom: "10px",
});

const Label = styled("Label")({
  minWidth: "16vw", // Set a minimum width for labels
});

// SearchBar Component
const SearchBar = ({ onSearch }) => {
  const [searchId, setSearchId] = useState("");

  const handleSearch = () => {
    onSearch(searchId);
  };

  return (
    <div className="search-bar2">
      <input
        type="text"
        placeholder="Search by ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        onKeyPress={(e) => handleSearch() }
      />
    </div>
  );
};  

function Tables() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // for search function
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState({
    batchId: "",
    centraId: "",
    status: "",
    inTimeRaw: "",
    rawWeight: "",
    inTimeWet: "",
    outTimeWet: "",
    wetWeight: "",
    inTimeDry: "",
    outTimeDry: "",
    dryWeight: "",
    inTimePowder: "",
    outTimePowder: "",
    powderWeight: "",
    packageId: "",
    rescaleWeight: "",
  });
  const [editUserIndex, setEditUserIndex] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/batch/`);
        const usersFromAPI = await response.json();
        const mappedUsers = usersFromAPI.map(user => ({
          batchId: user.Batch_ID,
          centraId: user.Centra_ID,
          status: user.Status,
          inTimeRaw: user.InTimeRaw,
          rawWeight: user.RawWeight,
          inTimeWet: user.InTimeWet,
          outTimeWet: user.OutTimeWet,
          wetWeight: user.WetWeight,
          inTimeDry: user.InTimeDry,
          outTimeDry: user.OutTimeDry,
          dryWeight: user.DryWeight,
          inTimePowder: user.InTimePowder,
          outTimePowder: user.OutTimePowder,
          powderWeight: user.PowderWeight,
          packageId: user.Package_ID,
          rescaleWeight: user.WeightRescale,
        }));
        console.log("Mapped users:", mappedUsers);
        setUsers(mappedUsers);
        setFilteredUsers(mappedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUsers();
  }, []);

  // search functions
  const handleSearch = (searchId) => {
    const filtered = users.filter(
      (user) => (searchId ? String(user.batchId).includes(searchId) : true)
    );
    setFilteredUsers(filtered);
  };

  // open popup
  const handleClickOpen = () => {
    setOpen(true);
  };

  // close popup
  const handleClose = () => {
    setOpen(false);
    setEditUser({
      batchId: "",
      centraId: "",
      status: "",
      inTimeRaw: "",
      rawWeight: "",
      inTimeWet: "",
      outTimeWet: "",
      wetWeight: "",
      inTimeDry: "",
      outTimeDry: "",
      dryWeight: "",
      inTimePowder: "",
      outTimePowder: "",
      powderWeight: "",
      packageId: "",
      rescaleWeight: "",
    });
    setEditUserIndex(null);
  };

  // update user
  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`${API_URL}/batch/${editUser.batchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          centra_id: editUser.centraId,
          status: editUser.status,
          in_time_raw: editUser.inTimeRaw,
          raw_weight: editUser.rawWeight,
          in_time_wet: editUser.inTimeWet,
          out_time_wet: editUser.outTimeWet,
          wet_weight: editUser.wetWeight,
          in_time_dry: editUser.inTimeDry,
          out_time_dry: editUser.outTimeDry,
          dry_weight: editUser.dryWeight,
          in_time_powder: editUser.inTimePowder,
          out_time_powder: editUser.outTimePowder,
          powder_weight: editUser.powderWeight,
          package_id: editUser.packageId,
          weight_rescale: editUser.rescaleWeight,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Error details:', errorDetails);
        throw new Error('Error updating user in the backend');
      }

      const updatedUserFromAPI = await response.json();
      const updatedUsers = users.map((user, index) =>
        index === editUserIndex ? {
          batchId: updatedUserFromAPI.Batch_ID,
          centraId: updatedUserFromAPI.Centra_ID,
          status: updatedUserFromAPI.Status,
          inTimeRaw: updatedUserFromAPI.InTimeRaw,
          rawWeight: updatedUserFromAPI.RawWeight,
          inTimeWet: updatedUserFromAPI.InTimeWet,
          outTimeWet: updatedUserFromAPI.OutTimeWet,
          wetWeight: updatedUserFromAPI.WetWeight,
          inTimeDry: updatedUserFromAPI.InTimeDry,
          outTimeDry: updatedUserFromAPI.OutTimeDry,
          dryWeight: updatedUserFromAPI.DryWeight,
          inTimePowder: updatedUserFromAPI.InTimePowder,
          outTimePowder: updatedUserFromAPI.OutTimePowder,
          powderWeight: updatedUserFromAPI.PowderWeight,
          packageId: updatedUserFromAPI.Package_ID,
          rescaleWeight: updatedUserFromAPI.WeightRescale,
        } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      handleClose();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user: " + error.message);
    }
  };

  // opens the popup with pre-filled data for editing
  const handleEditUser = (index) => {
    const userToEdit = filteredUsers[index];
    setEditUser(userToEdit);
    setEditUserIndex(index);
    handleClickOpen();
  };

  const handleDeleteUser = async (batchId) => {
    try {
      const response = await fetch(`${API_URL}/batch/${batchId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting user in the backend');
      }

      const updatedUsers = users.filter(user => user.batchId !== batchId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user: " + error.message);
    }
  };

  return (
    <div className="top-div">
      <div className="add-user">
        <div style={{ height: "6vh" }} /> {/* Maintain spacing */}

        <div className="container">
          <div className="container1">
            <div className="container2">
              <div className="search-bar-container" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <SearchBar onSearch={handleSearch} />
              </div>
              <table>
                <thead>
                  <tr>
                    <td className="table-title">Batch ID</td>
                    <td className="table-title">Centra ID</td>
                    <td className="table-title">Status</td>
                    <td className="table-title">In Time Raw</td>
                    <td className="table-title">Raw Weight</td>
                    <td className="table-title">In Time Wet</td>
                    <td className="table-title">Out Time Wet</td>
                    <td className="table-title">Wet Weight</td>
                    <td className="table-title">In Time Dry</td>
                    <td className="table-title">Out Time Dry</td>
                    <td className="table-title">Dry Weight</td>
                    <td className="table-title">In Time Powder</td>
                    <td className="table-title">Out Time Powder</td>
                    <td className="table-title">Powder Weight</td>
                    <td className="table-title">Package ID</td>
                    <td className="table-title">Rescale Weight</td>
                    <td className="table-title">Delete</td>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={index}>
                      <td className="table-contents">{user.batchId}</td>
                      <td className="table-contents">{user.centraId}</td>
                      <td className="table-contents">{user.status}</td>
                      <td className="table-contents">{user.inTimeRaw}</td>
                      <td className="table-contents">{user.rawWeight}</td>
                      <td className="table-contents">{user.inTimeWet}</td>
                      <td className="table-contents">{user.outTimeWet}</td>
                      <td className="table-contents">{user.wetWeight}</td>
                      <td className="table-contents">{user.inTimeDry}</td>
                      <td className="table-contents">{user.outTimeDry}</td>
                      <td className="table-contents">{user.dryWeight}</td>
                      <td className="table-contents">{user.inTimePowder}</td>
                      <td className="table-contents">{user.outTimePowder}</td>
                      <td className="table-contents">{user.powderWeight}</td>
                      <td className="table-contents">{user.packageId}</td>
                      <td className="table-contents">{user.rescaleWeight}</td>
                      <td className="table-contents">
                        <EditAndDeleteColorButton
                          variant="outlined"
                          onClick={() => handleDeleteUser(user.batchId)}
                        >
                          Delete
                        </EditAndDeleteColorButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            padding: "2rem",
            backgroundColor: "white",
            borderRadius: "20px",
            maxHeight: "80%",
          },
        }}
      >
        {/* Edit User title and the x cancel button */}
        <StyledDialogTitle>
          Edit Item
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>

        {/* content of the popup */}
        <StyledDialogContent>

          <LabelInputContainer>
            <Label className="centra-name-text">Centra ID </Label>
            <input
              type="text"
              id="centra-name"
              value={editUser.centraId}
              onChange={(e) =>
                setEditUser({ ...editUser, centraId: e.target.value })
              }
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className="status-text">Status </Label>
            <input
              type="text"
              id="status"
              value={editUser.status}
              onChange={(e) =>
                setEditUser({ ...editUser, status: e.target.value })
              }
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className="in-time-raw-text">In Time Raw </Label>
            <input
              type="date"
              id="in-time-raw"
              value={editUser.inTimeRaw}
              onChange={(e) =>
                setEditUser({ ...editUser, inTimeRaw: e.target.value })
              }
              className="date-picker"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className="raw-weight-text">Raw Weight </Label>
            <input
              type="text"
              id="raw-weight"
              value={editUser.rawWeight}
              onChange={(e) =>
                setEditUser({ ...editUser, rawWeight: e.target.value })
              }
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className="in-time-wet-text">In Time Wet </Label>
            <input
              type="date"
              id="in-time-wet"
              value={editUser.inTimeWet}
              onChange={(e) =>
                setEditUser({ ...editUser, inTimeWet: e.target.value })
              }
              className="date-picker"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className="out-time-wet-text">Out Time Wet </Label>
            <input
              type="date"
              id="out-time-wet"
              value={editUser.outTimeWet}
              onChange={(e) =>
                setEditUser({ ...editUser, outTimeWet: e.target.value })
              }
              className="date-picker"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className="wet-weight-text">Wet Weight </Label>
            <input
              type="text"
              id="wet-weight"
              value={editUser.wetWeight}
              onChange={(e) =>
                setEditUser({ ...editUser, wetWeight: e.target.value })
              }
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className="in-time-dry-text">In Time Dry </Label>
            <input
              type="date"
              id="in-time-dry"
              value={editUser.inTimeDry}
              onChange={(e) =>
                setEditUser({ ...editUser, inTimeDry: e.target.value })
              }
              className="date-picker"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className="out-time-dry-text">Out Time Dry </Label>
            <input
              type="date"
              id="out-time-dry"
              value={editUser.outTimeDry}
              onChange={(e) =>
                setEditUser({ ...editUser, outTimeDry: e.target.value })
              }
              className="date-picker"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className="dry-weight-text">Dry Weight </Label>
            <input
              type="text"
              id="dry-weight"
              value={editUser.dryWeight}
              onChange={(e) =>
                setEditUser({ ...editUser, dryWeight: e.target.value })
              }
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className="in-time-powder-text">In Time Powder </Label>
            <input
              type="date"
              id="in-time-powder"
              value={editUser.inTimePowder}
              onChange={(e) =>
                setEditUser({ ...editUser, inTimePowder: e.target.value })
              }
              className="date-picker"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className="out-time-powder-text">Out Time Powder </Label>
            <input
              type="date"
              id="out-time-powder"
              value={editUser.outTimePowder}
              onChange={(e) =>
                setEditUser({ ...editUser, outTimePowder: e.target.value })
              }
              className="date-picker"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className="powder-text">Powder Weight </Label>
            <input
              type="text"
              id="powder"
              value={editUser.powderWeight}
              onChange={(e) =>
                setEditUser({ ...editUser, powderWeight: e.target.value })
              }
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className="package-id-text">Package ID </Label>
            <input
              type="text"
              id="package-id"
              value={editUser.packageId}
              onChange={(e) =>
                setEditUser({ ...editUser, packageId: e.target.value })
              }
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className="rescale-weight-text">Rescale Weight </Label>
            <input
              type="text"
              id="rescale-weight"
              value={editUser.rescaleWeight}
              onChange={(e) =>
                setEditUser({ ...editUser, rescaleWeight: e.target.value })
              }
            />
          </LabelInputContainer>
        </StyledDialogContent>

        {/* the update button in the popup */}
        <StyledDialogActions>
          <DoneColorButton
            variant="contained"
            onClick={handleUpdateUser}
            className="update-user-popup-button"
          >
            Update
          </DoneColorButton>
        </StyledDialogActions>
      </Dialog>
    </div>
  );
}

export default Tables;
