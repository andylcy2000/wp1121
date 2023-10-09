
import { Typography } from "@mui/material"
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import {Button} from "@mui/material";
import useCards from "@/hooks/useCards";
import {deleteCard } from "@/utils/client";

type DeleteDialogProps ={
    open: boolean;
    ids: string[];
    onClose: () => void;
}

export function DeleteDialog({open, ids, onClose}:DeleteDialogProps){
    const {fetchCards} = useCards();
    //console.log(ids);
    if (ids.length===0){
      alert("Please select song(s)!");
      onClose();
    }
    const handleDelete = async () => {
        try {
          ids.forEach( async (id:string) => {
            await deleteCard(id);
            fetchCards();
          })

        } catch (error) {
          alert("Error: Failed to delete card");
        } finally {
          onClose();
        }
      };
    return(
        <>
        <Dialog open = {open}>
            <DialogTitle className="flex gap-4">
               <Typography variant="h5" color = "Error">Are you going to delete these selected songs?</Typography>
            </DialogTitle>
            <DialogActions>
               <Button onClick={handleDelete}>YES</Button>
               <Button onClick={onClose}>NO</Button>
            </DialogActions>
          
        </Dialog>
        </>
    )
}