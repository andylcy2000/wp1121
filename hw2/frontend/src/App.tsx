import { useMemo, useState } from "react";


import useCards from "@/hooks/useCards";
import FirstPage from "./pages/FirstPage.tsx";
import SecondPage from "./pages/SecondPage.tsx";
//import type CardListProps  from "./components/CardList.tsx";
import type { songProps } from "./pages/SecondPage.tsx";

export type secondPageInformationProps = {
  id:string;
}


type CardListProps = {
  id: string;
  name: string;
  cards: songProps[];
  description:string;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState("FirstPage");
  const [openSecondPage, setOpenSecondPage] = useState(false);
  const [secondPageInformation, setSecondPageInformation] = useState({} as secondPageInformationProps)
  const {lists} = useCards();
  const s:CardListProps[] =[];
  //let secondPageDetails:any = [];
  const [secondPageDetails, setSecondPageDetails] =useState(s);
  let result :CardListProps[]  ;
  useMemo(() => {
    //result = [];
    //console.log(secondPageInformation.id);
    result = lists.filter((list) => {
      //console.log(list.);
      return list.id ===secondPageInformation.id;
   });
    setSecondPageDetails(result);
   console.log(result);
   if(result){
     setOpenSecondPage(true);
   }
   
  },[secondPageInformation,lists]);
  /*
  useEffect(() => {
    secondPageDetails = lists.filter((list) => {
       list.id ===secondPageInformation.listId;
    })
    console.log(secondPageDetails);
  },[secondPageDetails]);
  */
  //console.log(currentPage);
  //id = {secondPageDetails[0].id} name = {secondPageDetails[0].name} description = {secondPageDetails[0].description}
  return (
  <>
    {currentPage === "FirstPage" && <FirstPage page={currentPage} setPage={setCurrentPage} listdetail = {secondPageInformation} setlistdetail = {setSecondPageInformation}/>}
    {(secondPageDetails[0]!==undefined) && currentPage === "SecondPage" && openSecondPage && <SecondPage id = {secondPageDetails[0].id} name = {secondPageDetails[0].name} description = {secondPageDetails[0].description.toString()} cards = {secondPageDetails[0].cards } setPage={setCurrentPage}/> }
  </> 
  );
}


