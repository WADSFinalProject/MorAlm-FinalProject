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
import { auth, createUserWithEmailAndPassword, firebaseDeleteUser } from "../../firebase.js";

const API_URL = "http://127.0.0.1:8001";

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const AddColorButton = styled(Button)(({ theme }) => ({
  color: "black",
  width: "13vw",
  height: "6vh",
  marginTop: "14vh",
  borderRadius: 10,
  fontWeight: 600,
  textTransform: "none",
  fontSize: 20,
  backgroundColor: "#EFEFEF",
  "&:hover": {
    backgroundColor: "#CFCFCF",
  },
}));

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

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const StyledDialogActions = styled(DialogActions)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const LabelInputContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  paddingBottom: "10px",
});

const StyledLabel = styled("label")({
  minWidth: "16vw",
});

const EditAndDeleteColorButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  borderRadius: "10px",
  backgroundColor: "#033324",
  "&:hover": {
    color: "#fff",
    backgroundColor: "#274C08",
  },
}));

function TopDiv() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    FirstName: "",
    LastName: "",
    Password: "",
    RoleType: "",
    CentraType: "",
  });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserIndex, setEditUserIndex] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users/`);
        const usersFromAPI = await response.json();
        // Directly set users and filteredUsers without sorting
        setUsers(usersFromAPI);
        setFilteredUsers(usersFromAPI);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUsers();
  }, []);
  
  
  const handleSearch = (searchId, searchName) => {
    const filtered = users.filter(user =>
      (searchId ? user.UID.includes(searchId) : true) &&
      (searchName ? user.Email.toLowerCase().includes(searchName.toLowerCase()) : true)
    );
    setFilteredUsers(filtered);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewUser({
      FirstName: "",
      LastName: "",
      Password: "",
      RoleType: "",
      CentraType: "",
    });
    setPasswordConfirm("");
    setIsEditMode(false);
    setEditUserIndex(null);
  };

  const handleAddUser = () => {
    const { FirstName, LastName, Password, RoleType, CentraType } = newUser;

    if (!FirstName || !LastName || !Password || !RoleType || (RoleType.toLowerCase() === "centra" && (CentraType === "" || CentraType === null))) {
      alert('Please fill out all the empty fields.');
    } else if (Password !== passwordConfirm) {
      alert('Passwords do not match.');
    } else {
      handleConfirmAddUser();
    }
  };

  const handleConfirmAddUser = async () => {
    const { FirstName, LastName, Password, RoleType, CentraType } = newUser;

    try {
      const email = `${FirstName.toLowerCase()}.${LastName.toLowerCase()}@${RoleType.toLowerCase()}.com`;
      const userCredential = await createUserWithEmailAndPassword(auth, email, Password);
      const firebaseUser = userCredential.user;

      const response = await fetch(`${API_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FirstName,
          LastName,
          Email: email,
          Password,
          RoleType,
          CentraType: RoleType.toLowerCase() === "centra" ? CentraType : null
        }),
      });

      if (!response.ok) {
        throw new Error('Error creating user in the backend');
      }

      const newUserFromAPI = await response.json();

      const updatedUsers = [...users, { ...newUser, UID: firebaseUser.uid, Email: email }];
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setNewUser({ FirstName: "", LastName: "", Password: "", RoleType: "", CentraType: "" });
      handleClose();
    } catch (error) {
      console.error("Error adding user:", error.message);
      alert("Error adding user: " + error.message);
    }
  };

  const handleUpdateUser = async () => {
    const { FirstName, LastName, Password, RoleType, CentraType } = newUser;

    try {
      const email = `${FirstName.toLowerCase()}.${LastName.toLowerCase()}@${RoleType.toLowerCase()}.com`;
      const response = await fetch(`${API_URL}/users/${filteredUsers[editUserIndex].UID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FirstName,
          LastName,
          Email: email,
          Password,
          RoleType,
          CentraType: RoleType.toLowerCase() === "centra" ? CentraType : null
        }),
      });

      if (!response.ok) {
        throw new Error('Error updating user in the backend');
      }

      const updatedUsers = users.map((u, index) => 
        index === editUserIndex ? { ...newUser, UID: filteredUsers[editUserIndex].UID, Email: email } : u
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setNewUser({ FirstName: "", LastName: "", Password: "", RoleType: "", CentraType: "" });
      handleClose();
    } catch (error) {
      console.error("Error updating user:", error.message);
      alert("Error updating user: " + error.message);
    }
  };

  const handleDeleteUser = async (uid) => {
    try {
      const response = await fetch(`${API_URL}/users/${uid}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting user in the backend');
      }

      const userToDelete = users.find(user => user.UID === uid);
      if (userToDelete) {
        const firebaseUser = auth.currentUser;
        if (firebaseUser && firebaseUser.email === userToDelete.Email) {
          await firebaseDeleteUser(firebaseUser);
        }
      }

      const updatedUsers = users.filter(user => user.UID !== uid);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error.message);
      alert("Error deleting user: " + error.message);
    }
  };

  const handleEditUser = (index) => {
    setNewUser(filteredUsers[index]);
    setPasswordConfirm(filteredUsers[index].Password);
    setIsEditMode(true);
    setEditUserIndex(index);
    handleClickOpen();
  };

  return (
    <div className="top-div">
      <div className="add-user">
        <AddColorButton
          variant="contained"
          className="add-user"
          onClick={handleClickOpen}
        >
          Add User
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
            {isEditMode ? "Edit User" : "Add User"}
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
              <StyledLabel className="first-name-text">First Name </StyledLabel>
              <input
                type="text"
                id="first-name"
                value={newUser.FirstName}
                onChange={(e) => setNewUser({ ...newUser, FirstName: e.target.value })}
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <StyledLabel className="last-name-text">Last Name </StyledLabel>
              <input
                type="text"
                id="last-name"
                value={newUser.LastName}
                onChange={(e) => setNewUser({ ...newUser, LastName: e.target.value })}
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <StyledLabel className="password-text">Password </StyledLabel>
              <input
                type="text"
                id="password"
                value={newUser.Password}
                onChange={(e) =>
                  setNewUser({ ...newUser, Password: e.target.value })
                }
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <StyledLabel className="confirm-password-text">Confirm Password </StyledLabel>
              <input
                type="text"
                id="confirm-password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <StyledLabel className="role-text">Role </StyledLabel>
              <select
                name="roles"
                id="role"
                value={newUser.RoleType}
                onChange={(e) =>
                  setNewUser({ ...newUser, RoleType: e.target.value })}
              >
                <option value="">Select Role</option>
                <option value="XYZ">XYZ</option>
                <option value="Harbor">Harbor</option>
                <option value="Centra">Centra</option>
              </select>
            </LabelInputContainer>

            {newUser.RoleType === 'Centra' && (
              <LabelInputContainer>
                <StyledLabel className="centra-number-text">Centra Number </StyledLabel>
                <select
                  name="centraNo"
                  id="centra-number"
                  value={newUser.CentraType}
                  onChange={(e) => setNewUser({ ...newUser, CentraType: e.target.value })}
                >
                  <option value="">Select Centra Number</option>
                  {[...Array(36).keys()].map((i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </LabelInputContainer>
            )}
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

        <SearchBar onSearch={handleSearch} />

<div className="table-items" style={{ overflowY: 'auto', maxHeight: '60vh' }}>
  <TopTable />
  {Array.isArray(filteredUsers) && filteredUsers.map((user, index) => (
    <div key={index} className="table-item-user">
      <p>{user.UID}</p>
      <p>{user.Email}</p>
      <p>{'*'.repeat(user.Password.length)}</p>
      <p>{user.RoleType}</p>
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
          onClick={() => handleDeleteUser(user.UID)}
        >
          Delete
        </EditAndDeleteColorButton>
      </p>
    </div>
  ))}
</div>

      </div>
    </div>
  );
}

export default TopDiv;
