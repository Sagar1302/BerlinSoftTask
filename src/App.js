import axios from "axios";
import { useEffect, useState } from "react";
//import './App.css';
export default function App() {
  const [content, setContent] = useState(""); //To store the posted content
  const [userName, setUserName] = useState(""); //To store the user name
  const [displayContent, setDisplayContent] = useState([]); //To store the content from api rather than calling api for every post
  const [nameSuggestions, setNameSuggestions] = useState([]); //To store the name list
  const [showSuggestions, setShowSuggestions] = useState(false); //To hide and display the suggestion list
  const [currentTime, setCurrentTime] = useState(new Date()); //To store the post posted time

  const initializedNames = [
    "Ajay",
    "Akash",
    "Arun",
    "Abiness",
    "Bhanu",
    "Bharath Raj",
    "Bala",
    "Dhinesh",
    "Jayanthan",
    "Karthick",
    "Mukesh",
    "Mustafa",
    "Naveen",
    "Tharun",
    "Vignesh",
    "Vishwa",
  ];

  // Set namesuggestions to the initialized list of names(user names who post content)
  useState(() => {
    setNameSuggestions(initializedNames);
  });

  //This function allows us to calculate the time the user has posted the post
  const formatTimeAgo = (timestamp) => {
    const currentTime = new Date(); // Current time
    const postTime = new Date(timestamp); // Time when the post was made

    const elapsedMilliseconds = currentTime - postTime; // Elapsed time in milliseconds
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000); // Elapsed time in seconds
    const elapsedMinutes = Math.floor(elapsedSeconds / 60); // Elapsed time in minutes
    const elapsedHours = Math.floor(elapsedMinutes / 60); // Elapsed time in hours
    const elapsedDays = Math.floor(elapsedHours / 24); // Elapsed time in days
    const elapsedYears = Math.floor(elapsedDays / 365);

    //The following if conditions calculates the time the post is posted and returns it
    if (elapsedYears > 0) {
      return `${elapsedYears} day${elapsedYears > 1 ? "s" : ""} ago`;
    } else if (elapsedDays > 0) {
      return `${elapsedDays} day${elapsedDays > 1 ? "s" : ""} ago`;
    } else if (elapsedHours > 0) {
      return `${elapsedHours} hour${elapsedHours > 1 ? "s" : ""} ago`;
    } else if (elapsedMinutes > 0) {
      return `${elapsedMinutes} minute${elapsedMinutes > 1 ? "s" : ""} ago`;
    } else {
      return "just now";
    }
  };

  //To check wheather the @ is typed ot not
  const handleContentChange = (event) => {
    const inputValue = event.target.value;
    setContent(inputValue);

    const searchTerm = inputValue
      .slice(inputValue.lastIndexOf("@") + 1)
      .toLowerCase(); // To check the terms after the @
    if (inputValue.includes("@") && searchTerm !== "@") {
      //condition to avoid the consecutive @@
      setShowSuggestions(true); //if true the dropdown will displayed
    } else {
      setShowSuggestions(false); //if false the dropdown willnot be displayed
    }
  };

  //The selected name is concatenated with the previous content
  const handleNameSelection = (name) => {
    const atIndex = content.lastIndexOf("@"); // Find the index of the last "@" symbol
    const prefix = content.slice(0, atIndex); // Get content before the "@" symbol
    const updatedContent = `${prefix}${name} `; // Combine prefix with the selected name and a space
    setContent(updatedContent);
    setShowSuggestions(false);
  };

  //To store the content in the api so that we can retrieve the data even the page is loaded multiple times
  const postDataInApi = (e) => {
    e.preventDefault();
    setCurrentTime(new Date());
    axios
      .post("https://663f4222e3a7c3218a4c979c.mockapi.io/posts", {
        //mock api url
        postedContent: content.trim(),
        username: userName.trim(),
        time: currentTime,
      })
      .then((content) => {
        //console.log(content.data);
        setDisplayContent([...displayContent, content.data]); // setting the content data
        setContent("");
      })
      .catch((err) => {
        console.log(err); // If error occurs we can see it through the console
      });
  };

  //useEffect to retrive the data initially from the api
  useEffect(() => {
    axios
      .get("https://663f4222e3a7c3218a4c979c.mockapi.io/posts")
      .then((content) => {
        setDisplayContent(content.data); //Set the content to the Displaycontent
      })
      .catch((err) => {
        console.log(err); // If error occurs we can see it through the console
      });
  }, []);
  return (
    <div className="min-h-screen  flex items-center justify-center bg-gray-900 ">
      <div className="flex flex-col items-center justify-center space-y-4  w-2/3 mb-3.5 text-black">
        <div className="w-full p-6 bg-gray-800 rounded-lg shadow-lg">
          {/* //  Input tag to get the user name ,the user name is same until it is changed intentionally */}

          <input
            className="w-full px-5 py-4 mb-4 bg-gray-200 rounded"
            type="text"
            placeholder="Enter your name"
            onChange={(event) => setUserName(event.target.value)}
          />
          {/*Input tag to get the content details ,it is changed when we posted the content */}
          <input
            className="w-full px-5 py-10  bg-gray-200 rounded"
            type="text"
            placeholder="Create a post..."
            value={content}
            onChange={handleContentChange}
          />
          {/* When @ is typed the nameList will be displayed */}
          {showSuggestions && (
            <ul className="p-2 max-h-32 overflow-y-auto bg-gray-200 rounded text-black bg-white">
              {nameSuggestions
                .filter((name) =>
                  name
                    .toLowerCase()
                    .includes(
                      content.slice(content.lastIndexOf("@") + 1).toLowerCase()
                    )
                )
                .map((name, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 rounded cursor-pointer hover:bg-gray-300 flex items-center"
                    onClick={() => handleNameSelection(name)}
                  >
                    {/* Conditional display based on index */}
                    {index % 2 === 0 ? ( // Even index
                      <div className="bg-pink-400 w-8 h-5 px-2 py-4 rounded-full shadow-lg flex items-center justify-center text-base">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      // Odd index
                      <div className="bg-green-500 w-8 h-5 px-2 py-4 rounded-full shadow-lg flex items-center justify-center text-base">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Display the name */}
                    <span className="ml-2  ">{name}</span>
                  </li>
                ))}
            </ul>
          )}
          <div class="grid justify-items-end ">
            {/* Post button to post the data to API */}
            <button
              className="w-24 py-1 mt-4 bg-fuchsia-500 rounded hover:bg-fuchsia-600"
              onClick={postDataInApi}
            >
              Post
            </button>
          </div>
        </div>
        <div className="w-full  p-6 bg-gray-800 rounded-lg shadow-lg">
          {/* Used to display the posts */}
          {displayContent.map((item, index) => (
            <div
              key={index}
              className="mb-4 bg-gray-200 px-5 py-4 mb-4 rounded-lg shadow-lg"
            >
              <h2 class="break-words">{item.postedContent}</h2>
              <br />
              <hr className="my-2 border-gray-400" />
              <div className="flex items-center">
                {index % 2 === 0 ? ( //Condition to check the index is odd
                  <div className="bg-pink-400 w-5 px-7 py-3 rounded-full shadow-lg flex items-center justify-center text-2xl">
                    {item.username.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  // Else Condition
                  <div className="bg-green-500 w-5 px-7 py-3 rounded-full shadow-lg flex items-center justify-center text-2xl">
                    {item.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="ml-3 flex flex-col">
                  {" "}
                  <span class="text-lb text-black">{item.username}</span>
                  <span class="text-neutral-500">{formatTimeAgo(item.time)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
