import { useState } from "react";

import { Delete as DeleteIcon } from "@mui/icons-material";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import useCards from "@/hooks/useCards";
import { createCard, deleteCard, updateCard } from "@/utils/client";
import type { CardData } from "@lib/shared_types";
// this pattern is called discriminated type unions
// you can read more about it here: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
// or see it in action: https://www.typescriptlang.org/play#example/discriminate-types
type NewCardDialogProps = {
  variant: "new";
  open: boolean;
  onClose: () => void;
  listId: string;
  cards: Partial<CardData>[];
};

type EditCardDialogProps = {
  variant: "edit";
  open: boolean;
  onClose: () => void;
  listId: string;
  cardId: string;
  song:string;
  singer:string;
  link:string;
  cards: Partial<CardData>[];
};

type CardDialogProps = NewCardDialogProps | EditCardDialogProps;

export default function CardDialog(props: CardDialogProps) {
  const { variant, open, onClose, listId } = props;
  const song = variant === "edit" ? props.song : "";
  const singer = variant === "edit" ? props.singer : "";
  const link = variant === "edit" ? props.link : "";

  const [edittingSong, setEdittingSong] = useState(variant === "new");
  const [edittingSinger, setEdittingSinger] = useState(
    variant === "new",
  );
  const [edittingLink, setEdittingLink] = useState(
    variant === "new",
  );

  // using a state variable to store the value of the input, and update it on change is another way to get the value of a input
  // however, this method is not recommended for large forms, as it will cause a re-render on every change
  // you can read more about it here: https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
  const [newSong, setNewSong] = useState(song);
  const [newSinger, setNewSinger] = useState(singer);
  const [newLink, setNewLink] = useState(link);
  const [newListId, setNewListId] = useState(listId);
  const [checked, setChecked] =useState(false);
  const { lists, fetchCards } = useCards();

  const handleClose = () => {
    onClose();
    if (variant === "edit") {
      setNewSong(song);
      setNewSinger(singer);
      setNewLink(link);
      setNewListId(listId);
    }
  };

  const handleSave = async () => {
    if(!newSong){
      alert("Please enter the name of the song");
      return;
    }
    if(!newSinger){
      alert("Please enter the singer's name");
      return;
    }
    if(!newLink){
      alert("Please enter the link of the song");
      return;
    }
    let checker = false;
    props.cards.forEach((card:Partial<CardData>) => {
      if(card.song === newSong ){
        if(variant === "new"){
          alert("New song name overlaps other song's name!");
        checker = true;
        return;
        }else{
          if(card.id !== props.cardId){
            alert("New song name overlaps other song's name!");
            checker = true;
            return;
          }
        }
        
      }
    })
    if(!checker){

    
    try {
      if (variant === "new") {
        await createCard({
          song:newSong,
          singer:newSinger,
          link:newLink,
          list_id: newListId,
        });
      } else {
        if (
          newSong === song &&
          newSinger === singer &&
          newLink === link &&
          newListId === listId
        ) {
          return;
        }
        // typescript is smart enough to know that if variant is not "new", then it must be "edit"
        // therefore props.cardId is a valid value
        if(checked){
          await createCard(/*props.cardId, */{
            song: newSong,
            singer: newSinger,
            link: newLink,
            list_id: newListId,
          });
        }else{
          await updateCard(props.cardId, {
            song: newSong,
            singer: newSinger,
            link: newLink,
            list_id: newListId,
          });
        }

      }
      
      fetchCards();
      //console.log(1);
    } catch (error) {
      alert("Error: Failed to save card");
    } finally {
      handleClose();
    }
  }else{
    return
  }
  };

  const handleDelete = async () => {
    if (variant !== "edit") {
      return;
    }
    try {
      await deleteCard(props.cardId);
      fetchCards();
    } catch (error) {
      alert("Error: Failed to delete card");
    } finally {
      handleClose();
    }
  };
  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className="flex gap-4">
        {edittingSong ? (
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEdittingSong(false);
              }
            }}
          >
            <Input
              autoFocus
              defaultValue={song}
              onChange={(e) => setNewSong(e.target.value)}
              className="grow"
              placeholder="Enter a title for this card..."
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEdittingSong(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newSong}</Typography>
          </button>
        )}
        <Select
          value={newListId}
          onChange={(e) => setNewListId(e.target.value)}
        >
          {lists.map((list) => (
            <MenuItem value={list.id} key={list.id}>
              {list.name}
            </MenuItem>
          ))}
        </Select>
        {variant === "edit" && (
          <>
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
          <label htmlFor="subscribe">
          <input
          type="checkbox"
          onChange={handleChange}
        />
        <Typography variant="body2" sx={{display:"inline"}}>Add a copy</Typography>
      </label>
          </>
        )}
      </DialogTitle>
      <DialogContent className="w-[600px]">
        {edittingSinger ? (
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEdittingSinger(false);
              }
            }}
          >
            <textarea
              className="bg-white/0 p-2"
              autoFocus
              defaultValue={singer}
              placeholder="Add a singer"
              onChange={(e) => setNewSinger(e.target.value)}
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEdittingSinger(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newSinger}</Typography>
          </button>
        )}
      </DialogContent>
      <DialogContent className="w-[600px]">
        {edittingLink ? (
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEdittingLink(false);
              }
            }}
          >
            <textarea
              className="bg-white/0 p-2"
              autoFocus
              defaultValue={link}
              placeholder="Add a link"
              onChange={(e) => setNewLink(e.target.value)}
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEdittingLink(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newLink}</Typography>
          </button>
        )}
        <DialogActions>
          <Button onClick={handleSave}>save</Button>
          <Button onClick={handleClose}>close</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
