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
import TopTable from "./TopTable";
import SearchBar from "./SearchBar";
import ModeIcon from '@mui/icons-material/Mode';

const API_URL = "http://127.0.0.1:8000";

// to style the Add User text in the popup
const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

// style the Add button in the website
const AddColorButton = styled(Button)(({ theme }) => ({
  color: "black",
  width: "13vw",
  height: "6vh",
  borderRadius: 10,
  marginTop: "14vh",
  fontWeight: 600,
  textTransform: "none",
  fontSize: 20,
  backgroundColor: "#EFEFEF",
  "&:hover": {
    backgroundColor: "#CFCFCF",
  },
}));

// style the Add button in the popup
const ConfirmColorButton = styled(Button)(({ theme }) => ({
  color: "white",
  width: "20vw",
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

// style the edit and delete buttons in the table
const EditAndDeleteColorButton = styled(Button)(({ theme }) => ({
  color: "#fff", // Text color
  borderRadius: "10px",
  backgroundColor: "#033324",
  "&:hover": {
    color: "#fff",
    backgroundColor: "#274C08", // Darker green on hover
  },
}));

// style the scrollable table container
const ScrollableTableContainer = styled("div")({
  maxHeight: "60vh", // Adjust this value as needed
  overflowY: "auto",
});

function TopDiv() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // for search function
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    id: "",
    centra: "",
    location: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserIndex, setEditUserIndex] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/centra/`);
        const usersFromAPI = await response.json();
        const mappedUsers = usersFromAPI.map(user => ({
          id: user.Centra_ID,
          centra: user.CentraName,
          location: user.CentraAddress,
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

  const handleSearch = (searchId, searchName) => {
    const filtered = users.filter(user =>
      (searchId ? String(user.id).includes(searchId) : true) &&
      (searchName ? user.centra.toLowerCase().includes(searchName.toLowerCase()) : true)
    );
    setFilteredUsers(filtered);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewUser({
      id: "",
      centra: "",
      location: "",
    });
    setIsEditMode(false);
    setEditUserIndex(null);
  };

  const handleAddUser = async () => {
    const { id, centra, location } = newUser;

    if (!centra || !location) {
      alert('Please fill out all the empty fields.');
    } else {
      try {
        const response = await fetch(`${API_URL}/centra/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Centra_ID: id,
            CentraName: centra,
            CentraAddress: location,
          }),
        });

        if (!response.ok) {
          throw new Error('Error adding user in the backend');
        }

        const newUserFromAPI = await response.json();
        const mappedUser = {
          id: newUserFromAPI.Centra_ID,
          centra: newUserFromAPI.CentraName,
          location: newUserFromAPI.CentraAddress,
        };
        setUsers([...users, mappedUser]);
        setFilteredUsers([...users, mappedUser]);
        handleClose();
      } catch (error) {
        console.error("Error adding user:", error);
        alert("Error adding user: " + error.message);
      }
    }
  };

  const handleUpdateUser = async () => {
    const { id, centra, location } = newUser;

    try {
      const response = await fetch(`${API_URL}/centra/${filteredUsers[editUserIndex].id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CentraName: centra,
          CentraAddress: location,
        }),
      });

      if (!response.ok) {
        throw new Error('Error updating user in the backend');
      }

      const updatedUserFromAPI = await response.json();
      const mappedUser = {
        id: updatedUserFromAPI.Centra_ID,
        centra: updatedUserFromAPI.CentraName,
        location: updatedUserFromAPI.CentraAddress,
      };
      const updatedUsers = users.map((u, index) =>
        index === editUserIndex ? mappedUser : u
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      handleClose();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user: " + error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}/centra/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting user in the backend');
      }

      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user: " + error.message);
    }
  };

  const handleEditUser = (index) => {
    const userToEdit = filteredUsers[index];
    setNewUser(userToEdit);
    setIsEditMode(true);
    setEditUserIndex(index);
    handleClickOpen();
  };

  console.log("Rendering users:", filteredUsers);

  return (
    <div className="top-div">
      <div className="add-user">
        <AddColorButton
          variant="contained"
          className="add-user"
          onClick={handleClickOpen}
        >
          Add Centra
        </AddColorButton>
        
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{
            "& .MuiDialog-paper": {
              padding: "2rem",
              backgroundColor: "white",
              borderRadius: "20px",
            },
          }}
        >
          <StyledDialogTitle>
            {isEditMode ? "Edit Centra" : "Add Centra"}
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </StyledDialogTitle>

          <StyledDialogContent>

            <LabelInputContainer>
              <Label className="centra-name-text">Centra Name </Label>
              <input
                type="text"
                id="centra-name"
                value={newUser.centra}
                onChange={(e) => setNewUser({ ...newUser, centra: e.target.value })}
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label className="location-text">Location </Label>
              <input
                type="text"
                id="location"
                value={newUser.location}
                onChange={(e) =>
                  setNewUser({ ...newUser, location: e.target.value })
                }
              />
            </LabelInputContainer>
          </StyledDialogContent>

          <StyledDialogActions>
            <ConfirmColorButton
              variant="contained"
              onClick={isEditMode ? handleUpdateUser : handleAddUser}
              className="add-user-popup-button"
            >
              {isEditMode ? "Edit" : "Add"}
            </ConfirmColorButton>
          </StyledDialogActions>
        </Dialog>

        <SearchBar onSearch={handleSearch}/>

        <ScrollableTableContainer className="table-items">
          <TopTable />
          {Array.isArray(filteredUsers) && filteredUsers.map((user, index) => (
            <div key={index} className="table-item-centra">
              <p>{user.id}</p>
              <p>{user.centra}</p>
              <p>{user.location}</p>
              <p>
                <EditAndDeleteColorButton 
                  variant="outlined"
                  onClick={() => handleEditUser(index)}
                >
                  <ModeIcon />
                </EditAndDeleteColorButton>
              </p>
              <p>
                <EditAndDeleteColorButton
                  variant="outlined"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </EditAndDeleteColorButton>
              </p>
            </div>
          ))}
        </ScrollableTableContainer>
      </div>
    </div>
  );
}

export default TopDiv;
