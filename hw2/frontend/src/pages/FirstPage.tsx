import { useEffect, useState, useRef } from "react";

import { Button } from "@mui/material";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";

import CardList from "@/components/CardList";
import HeaderBar from "@/components/HeaderBar";
import NewListDialog from "@/components/NewListDialog";
import useCards from "@/hooks/useCards";
import {Input} from "@mui/material";

type FirstPageProps = {
  page:string;
  setPage:(page:string) => void;
  listdetail:unknown;
  setlistdetail:(listdetail:unknown) => void;
};

export default function FirstPage({page,setPage,listdetail,setlistdetail}:FirstPageProps) {
  const { lists, fetchLists, fetchCards } = useCards();
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const [buttonWords, setbuttonWords] = useState("DELETE");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    fetchLists();
    fetchCards();
  }, [fetchCards, fetchLists]);

  const wordshandle = async () =>{
    if(buttonWords==="DELETE"){
      setbuttonWords("DONE");
    }else{
      setbuttonWords("DELETE");
    }
  }
  return (
    <>
      <HeaderBar />
      <div className="flex-row">
      <Grid container>
        <Grid item xs ={10}  sm={10} md={10} lg={10}>
        <Typography variant="h4" sx={{display: "inline"}}>My Playlists</Typography>
        </Grid>
        <Grid item xs ="auto">
        <Typography variant="h4" sx={{display: "inline"}}></Typography>
        </Grid>
        <Grid container xs ={2} spacing={1}>
        <Grid item xs ="auto">
        <Button variant="contained" color="success" onClick={() => setNewListDialogOpen(true)}>ADD</Button>
        </Grid>
        <Grid item xs ="auto">
        <Button variant="contained" color="success" onClick={wordshandle}>{buttonWords}</Button>
        </Grid>
        </Grid>
      </Grid>
      </div>
      <Input
                autoFocus
                className="grow"
                placeholder="Search"
                sx={{ fontSize: "2rem" ,display:"none"}}
                inputRef={inputRef}
              />
      <main className="mx-auto flex max-h-full flex-row gap-6 px-24 py-12">
        <Grid container spacing={{xs:0.5 , sm:1, md:2, lg:4}} columns={{ xs: 2, sm: 4, md: 6, lg:8 }}>
        {lists.map((list) => (
          
          list.id&&<Grid item xs={2} sm={2} md={2} lg={2}  key={list.id??""} ><CardList {...list} canceldisplay={buttonWords} page={page} changePage={setPage} listdetail={listdetail} setlistdetail = {setlistdetail} searchname={inputRef.current?.value??""}/></Grid>
        ))}
        {/*
        <div>
          <Grid item xs={2} sm={2} md={2} lg={2}>
          <Button
            variant="contained"
            className="w-80"
            onClick={() => setNewListDialogOpen(true)}
          >
            <AddIcon className="mr-2" />
            Add a list
          </Button>
          </Grid>
        </div>*/}
        </Grid>
        <NewListDialog
          open={newListDialogOpen}
          onClose={() => setNewListDialogOpen(false)}
        />
      </main>
    </>
  );
}

