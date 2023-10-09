import { useState, useRef } from "react";

import { Button } from "@mui/material";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";
import { DataGrid} from '@mui/x-data-grid';
import type { GridColDef } from "@mui/x-data-grid";
import HeaderBar from "@/components/HeaderBar";
import useCards from "@/hooks/useCards";
import music from "../components/music.png"
import CardDialog from "@/components/CardDialog";
import {DeleteDialog} from "@/components/DeleteDialog";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Input from "@mui/material/Input";
import { updateList } from "@/utils/client";
//const {lists} = useCards();

/*

*/
/*
const rows = [

  //{ id: "song1", singer: 'Snow', link:  <a href="${https://www.w3schools.com}" target="_blank">Visit W3Schools.com!</a> , age: 35 },
  { id: "song2", singer: 'Lannister', link: 'Cersei', age: 42 },
  

];
*/
//const rows = [{ id: "song2", singer: 'Lannister', link: <a href="${https://www.w3schools.com}" target="_blank">Visit W3Schools.com!</a>  },];
//console.log(rows[1].link);

export type songProps ={
  id:string;
  song:string;
  singer:string;
  link:string;
  listId:string;
}

type rowProps = Partial<songProps>;

type secondPageProps = {
  id:string;
  name:string;
  description:string;
  cards:songProps[];
  setPage: (page:string) => void;
}

//{id,name,description}: secondPageProps
export default function SecondPage({id,name,description,cards,setPage}: secondPageProps) {
  //const [open, setOpen] = useState(false);
    //console.log(cards);
    const [openNewCardDialog, setOpenNewCardDialog] = useState(false);
    const [open, setOpen] = useState(false);
    const [song, setSong] = useState("");
    const [singer, setSinger] = useState("");
    const [link, setLink] = useState("");
    const [listId, setListId] = useState("");
    const [id2, setId2] = useState("");
    const [deleteOpen, setDeleteOpen] = useState(false);
    const idsRef = useRef([] as string[]);
    const [deleteids, setDeleteids] = useState([] as string[]);
    const [edittingName, setEdittingName] = useState(false);
    const [edittingDescription, setEdittingDescription] = useState(
      false
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const inputRef2 = useRef<HTMLInputElement>(null);
    const {fetchLists} = useCards();
    /*
    let designated_list ={} as any ;
    useMemo(() =>{
      designated_list=lists.filter((list:Partial<songProps>) =>{
        return list.id === id;
      })
    },[lists])
    */
    const handleUpdateName = async () => {
      if (!inputRef.current) return;
  
      const newName = inputRef.current.value;
      if (newName !== name) {
        try {
          await updateList(id, { name: newName });
          fetchLists();
        } catch (error) {
          alert("Error: Failed to update list name");
        }
      }
      setEdittingName(false);
    };
    const handleUpdateDescription = async () => {
      if (!inputRef2.current) return;
      
      const newDescription = inputRef2.current.value;
      if (newDescription !== description) {
        try {
          await updateList(id, { description:newDescription });
          
          fetchLists();
          //console.log(newDescription);
        } catch (error) {
          alert("Error: Failed to update list description");
        }
      }
      setEdittingDescription(false);
    };
    const columns: GridColDef[] = [
      { field: 'id', headerName: 'Song', type:'string', flex :200},
      { field: 'singer', headerName: 'Singer', type:'string', flex:200 },
      { field: 'link', headerName: 'Link', type:"string", renderCell: (params) => {return <a href={params.row.link} target="_blank" rel="noreferrer">{params.row.link}</a>},flex:300 },
      { field: 'edit', headerName:'Edit', renderCell:(params) => {

        const handleClickOpen = () => {
          setSong(params.row.id);
          setSinger(params.row.singer);
          setLink(params.row.link);
          setListId(params.row.listid_);
          setId2(params.row.id_);
          setOpen(true);
        }
        return <Button  variant = "contained" onClick={handleClickOpen}>edit</Button>},flex:200},
      { field: 'id_', headerName: 'none', type:'string', flex:1,},
      { field: 'listid_', headerName: 'none', type:'string', flex :1},
      /*
      {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 90,
      },
      {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params: GridValueGetterParams) =>
          `${params.row.firstName || ''} ${params.row.lastName || ''}`,
      },
      */
    ];
    const rows :rowProps[] = [];
     cards.forEach((card:Partial<songProps>) => {
       const a = {id:card.song, singer:card.singer, link:card.link, edit:123,id_:card.id,listid_:card.listId,};
       rows.push(a);
     })
    const deleteidsprocessing = () => {
      //console.log("ya");
      const ids:string[] =[];
      if(idsRef){
        //console.log(idsRef.current);
        idsRef.current.forEach((id:string) => {
          cards.forEach((card) => {
            if(id === card.song){
              ids.push(card.id);
            }
          })
        });
      }
      setDeleteids(ids);
      setDeleteOpen(true); 
    }
    return(
        <>
          <HeaderBar/>
          <Box sx = {{m:'3em'}}>

          <div className="flex-row">
            <Grid container wrap="nowrap">
              <Grid item xs={3} sm={3} md={3} lg={3}>
                <img style={{width: '15rem', height: '15rem', display:'inline'}} src={music} alt ="music-picture"/ >
              </Grid>
              <Grid item xs zeroMinWidth>
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
              <Typography className="text-start" variant="h4" style={{overflowWrap: 'break-word'}}>
                {name}
              </Typography>
            </button>
          )}
          {edittingDescription ? (
            <ClickAwayListener onClickAway={handleUpdateDescription}>
              <Input
                autoFocus
                defaultValue={description}
                className="grow"
                placeholder="Enter a new description for this list..."
                sx={{ fontSize: "1rem" }}
                inputRef={inputRef2}
              />
            </ClickAwayListener>
          ) : (
            <button
              onClick={() => setEdittingDescription(true)}
              className="w-full rounded-md p-2 hover:bg-white/10"
            >
              <Typography style={{overflowWrap: 'break-word'}} className="text-start" variant="body1">
                {description}
              </Typography>
            </button>
          )}
              </Grid>
            </Grid>
          </div>
          <div>
          
          <Grid container direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
          <Grid item xs ="auto">
            <Button variant="contained" color="success" onClick = {() => {setOpenNewCardDialog(true)}}>ADD</Button>
          </Grid>
          <Grid item xs ="auto">
            <Button variant="contained" color="success" onClick={deleteidsprocessing}>DELETE</Button>
          </Grid>
          <Grid item xs ="auto">
            <Button variant="contained" color="success" onClick={() => setPage("FirstPage")}>RETURN</Button>
          </Grid>
          </Grid>
          </div>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              onRowSelectionModelChange={(ids) => {
                //console.log(ids);
                idsRef.current = ids;
                //console.log(idsRef.current);
              }}
              columnVisibilityModel ={{
                id_: false,
                listid_:false,
              }}
            />
          </div>
          <CardDialog
          variant="new"
          open={openNewCardDialog}
          onClose={() => setOpenNewCardDialog(false)}
          listId={id}
          cards = {cards}
          />
          { open &&
          <CardDialog
        variant="edit"
        
        onClose={() => {setOpen(false)}}
        song={song}
        singer={singer}
        link={link}
        listId={listId}
        cardId={id2}
        open={open}
        cards = {cards}
      /> 
          }
          { deleteOpen && <DeleteDialog open ={deleteOpen} ids ={deleteids} onClose={() => {setDeleteOpen(false)}}/>
          

            
        }    
          </Box>
        </>
    );
}