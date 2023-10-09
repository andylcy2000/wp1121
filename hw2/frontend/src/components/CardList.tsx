import { useRef, useState} from "react";
import CancelIcon from '@mui/icons-material/Cancel';

import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
import ClickAwayListener from "@mui/material/ClickAwayListener";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import music from "./music.png";

import useCards from "@/hooks/useCards";
import { deleteCard, deleteList, updateList } from "@/utils/client";

import type { songProps } from "@/pages/SecondPage";
import CardDialog from "./CardDialog";

export type CardListProps = {
  id: string;
  name: string;
  cards: songProps[];
};
type additional = {
  canceldisplay: string;
  page:string;
  changePage:(page:string) => void;
  listdetail:string;
  setlistdetail:(listdetail:unknown) => void;
  searchname:string;
};

interface NewCardListProps extends additional, CardListProps{}

export default function CardList({ id, name, cards, canceldisplay, changePage, setlistdetail,searchname }: NewCardListProps ) {
  const [openNewCardDialog, setOpenNewCardDialog] = useState(false);
  const [edittingName, setEdittingName] = useState(false);
  const { fetchLists,lists, fetchCards} = useCards();
  const inputRef = useRef<HTMLInputElement>(null);
  const length:number = cards.length;
  /*
  useEffect(() => {
    console.log(searchname);
  },[searchname]);
  */
  /*
  useEffect(() => {
    console.log(page);
  },[page]);
  */
  //console.log(page);
  
  const checkwords = function(canceldisplay:string):string {
    if(canceldisplay==="DELETE"){
      return("none");
    }else{
      return("block");
    }
  }
  const test = checkwords(canceldisplay);
  //console.log(test);
  const handleUpdateName = async () => {
    if (!inputRef.current){
      alert("List name cannot be empty!");
      return;
    } 
    let checker=false;
    const newName = inputRef.current.value;
    if (newName !== name) {
      lists.forEach((list) => {
        if(list.name === newName){
          alert("New name overlaps with other list's name!");
          checker = true;
          return;
        }
      })
      if(!checker){

      
      try {
        await updateList(id, { name: newName });
        fetchLists();
      } catch (error) {
        alert("Error: Failed to update list name");
      }
    }
    setEdittingName(false);
  }else{
    return;
  }
  };

  const handleDelete = async () => {
    try {
      cards.forEach( async (card) => {
        await deleteCard(card.id);
      })
      fetchCards();
      await deleteList(id);
      fetchLists();
    } catch (error) {
      alert("Error: Failed to delete list");
    }
  };
  let checker = false;
  if(name.startsWith(searchname)){
    checker = true;
  }
  let margin ={}
  if(checker){
    margin= {};
  }
  else{
    margin ={};
  }
  return (
    <>
      <Paper className="w-80 p-6" sx ={margin}>
        <div >
          <Grid container display={"inline-flex"} spacing={0}>
            <Grid item >
              <Button onClick={() => {changePage("SecondPage"); setlistdetail({id})}}> 
               <img src={music} alt = "music picture"/ >
              </Button>
            </Grid>
            <Grid item >
            <IconButton color="error" onClick={handleDelete} sx={{display:test}}>
              <CancelIcon />
            </IconButton>
            </Grid>
          </Grid>
        </div>
        <div>
          <Typography variant ={"subtitle2"}>{length} songs</Typography>
        </div>
        <div className="flex gap-4">
          {edittingName ? (
            <ClickAwayListener onClickAway={handleUpdateName}>
              <Input
                autoFocus
                defaultValue={name}
                className="grow"
                placeholder="Enter a new name for this list..."
                sx={{ fontSize: "2rem" }}
                inputRef={inputRef}
              />
            </ClickAwayListener>
          ) : (
            <button
              onClick={() => setEdittingName(true)}
              className="w-full rounded-md p-2 hover:bg-white/10"
            >
              <Typography className="text-start" variant="h4">
                {name}
              </Typography>
            </button>
          )}
          
          {/*
          <div className="grid place-items-center">
            <IconButton color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </div>
          
        </div>
        <Divider variant="middle" sx={{ mt: 1, mb: 2 }} />
        <div className="flex flex-col gap-4">
          {cards.map((card) => (
            <Card key={card.id} {...card} />
          ))}
          <Button
            variant="contained"
            onClick={() => setOpenNewCardDialog(true)}
          >
            <AddIcon className="mr-2" />
            Add a card
          </Button>
          */}
        </div>
        
      </Paper>
      <CardDialog
        variant="new"
        open={openNewCardDialog}
        onClose={() => setOpenNewCardDialog(false)}
        listId={id}
        cards={cards}
      />
    </>
  );
}
