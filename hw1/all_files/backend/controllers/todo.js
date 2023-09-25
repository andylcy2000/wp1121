import DiaryModel from "../models/todoModel.js";


// Get all diarys
export const getDiarys = async (req, res) => {
  try {
    // Find all todos
    const diarys = await DiaryModel.find({});

    // Return todos
    return res.status(200).json(diarys);
  } catch (error) {
    // If there is an error, return 500 and the error message
    // You can read more about HTTP status codes here:
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // Or this meme:
    // https://external-preview.redd.it/VIIvCoTbkXb32niAD-rxG8Yt4UEi1Hx9RXhdHHIagYo.jpg?auto=webp&s=6dde056810f99fc3d8dab920379931cb96034f4b
    return res.status(500).json({ message: error.message });
  }
};

//Get the designated diary to view
export const getViewDiary = async (req, res) => {
  const { id } = req.params;
  try {
    const diary = await DiaryModel.findById(id);
    if (!diary) {
      return res.status(404).json({ message: "Diary not found!" });
    }
    return res.status(200).json(diary);
  } catch (error) {
    return res.status(500).json({message : error.message});
  }
}

export const createDiary = async (req, res) => {
  const { diary_content, selectTag1_content,selectTag2_content, date_str } = req.body;

  // Check title and description
  if (!diary_content || !selectTag1_content || !selectTag2_content || !date_str ) {
    return res
      .status(400)
      .json({ message: "You haven't input all things!" });
  }

  // Create a new todo
  try {
    const newDiary = await DiaryModel.create({
      diary_content, selectTag1_content,selectTag2_content, date_str,
    });
    return res.status(201).json(newDiary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// Update a diary
export const updateDiary = async (req, res) => {
  const { id } = req.params;
  const { diary_content, selectTag1_content,selectTag2_content } = req.body;
  try {
    // Check if the id is valid
    const existedDiary = await DiaryModel.findById(id);
    if (!existedDiary) {
      return res.status(404).json({ message: "Diary not found!" });
    }

    // Update the diary
    if (diary_content !== undefined) existedDiary.diary_content = diary_content;
    if (selectTag1_content !== undefined) existedDiary.selectTag1_content = selectTag1_content;
    if (selectTag2_content !== undefined) existedDiary.selectTag2_content = selectTag2_content;

    // Save the updated diary
    await existedDiary.save();

    // Rename _id to id
    /*
    existedDiary.id = existedDiary._id;
    delete existedDiary._id;
    */
    return res.status(200).json(existedDiary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a diary
export const deleteDiary = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if the id is valid
    const existedDiary = await DiaryModel.findById(id);
    if (!existedDiary) {
      return res.status(404).json({ message: "Diary not found!" });
    }
    // Delete the diary
    await DiaryModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Diary deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
