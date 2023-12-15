
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
   const [value, setValue] = useState(null);
   const [message, setMessage] = useState(null);
   const [previousChats, setPreviousChats] = useState([]);
   const [currentTitle, setCurrentTitle] = useState(null);
   const [repos, setRepos] = useState([]);

   const createNewChat = () => {
      setMessage(null);
      setValue("");
      setCurrentTitle(null);
   };

   const handleClick = (uniqueTitle) => {
      setCurrentTitle(uniqueTitle);
      setMessage(null);
      setValue("");
   };

   const getMessages = async () => {
      const options = {
         method: "POST",
         body: JSON.stringify({
            message: value,
         }),
         headers: {
            "Content-Type": "application/json",
         },
      };
      try {
         const response = await fetch('http://localhost:8000/completions', options);
         const data = await response.json();
         setMessage(data.choices[0].message);
      } catch (error) {
         console.error(error);
      }
      try {
         await axios.post('http://localhost:3001/saveData', { data: value });
         alert('Data saved successfully!');
      } catch (error) {
         console.error('Error saving data:', error);
      }
   };

   useEffect(() => {
      console.log(currentTitle, value, message);

      if (!currentTitle && value && message) {
         setCurrentTitle(value);
      }

      if (currentTitle && value && message) {
         setPreviousChats((prevChats) => [
            ...prevChats,
            {
               title: currentTitle,
               role: 'Me',
               content: value,
            },
            {
               title: currentTitle,
               role: message.role,
               content: message.content,
            },
         ]);
      }
   }, [message, currentTitle]);

   useEffect(() => {
      const fetchRepos = async () => {
         try {
            const response = await axios.get('https://api.github.com/users/AssasinDEAD/repos');
            setRepos(response.data);
         } catch (error) {
            console.error('Error fetching GitHub repositories:', error);
         }
      };

      fetchRepos();
   }, []); // Empty dependency array means this effect runs once after the initial render

   const currentChat = previousChats.filter((previousChat) => previousChat.title === currentTitle);
   const uniqueTitles = Array.from(new Set(previousChats.map((previousChat) => previousChat.title)));

   return (
      <div className="app">
         <section className="side-bar">
            <ul className="history">
               {uniqueTitles?.map((uniqueTitle, index) => (
                  <li key={index} onClick={() => handleClick(uniqueTitle)}>
                     {uniqueTitle}
                  </li>
               ))}
            </ul>
            <nav></nav>
         </section>
         <section className="main">

            {!currentTitle}
            <ul className="feed">
               {currentChat?.map((chatMessage, index) => (
                  <li key={index}>
                     <p className="role">{chatMessage.role}</p>
                     <p>{chatMessage.content}</p>
                  </li>
               ))}
            </ul>
            <div className="bottom-section">
               <div className="input-container">
                  <input value={value} onChange={(e) => setValue(e.target.value)} />
                  <div id="submit" onClick={getMessages}>
                     <button className="btn">Send</button>
                  </div>
               </div>
            </div>
         </section>
         <section className="github-repos">
            <h2>GitHub Repositories</h2>
            <ul>
               {repos.map((repo) => (
                  <li key={repo.id}>{repo.name}</li>
               ))}
            </ul>
         </section>
      </div>
   );
};

export default App;

//-----------------------------------------------------------------------------------------------------------------------------------------------
// import { useState, useEffect } from 'react'
// import axios from 'axios';
// // import SwaggerUI from 'swagger-ui-react';
// // import 'swagger-ui-react/swagger-ui.css';

// const App = () => {
//    const [value, setValue] = useState(null)
//    const [message, setMessage] = useState(null)
//    const [previousChats, setPreviousChats] = useState([])
//    const [currentTitle, setCurrentTitle] = useState(null)

//    const createNewChat = () => {
//       setMessage(null)
//       setValue("")
//       setCurrentTitle(null)
//    }

//    const handleClick = (uniqueTitle) => {
//       setCurrentTitle(uniqueTitle)
//       setMessage(null)
//       setValue("")
//    }

//    const getMessages = async () => {
//       const options = {
//          method: "POST",
//          body: JSON.stringify({
//             message: value
//          }),
//          headers: {
//             "Content-Type": "application/json"
//          }
//       }
//       try {
//          const response = await fetch('http://localhost:8000/completions', options)
//          const data = await response.json()
//          setMessage(data.choices[0].message)
//       } catch (error) {
//          console.error(error)
//       }
//       try {
//          await axios.post('http://localhost:3001/saveData', { data: value });
//          alert('Data saved successfully!');
//       } catch (error) {
//          console.error('Error saving data:', error);
//       }

//    }


//    useEffect(() => {
//       console.log(currentTitle, value, message);

//       if (!currentTitle && value && message) {
//          setCurrentTitle(value);
//       }

//       if (currentTitle && value && message) {
//          setPreviousChats(prevChats => (
//             [...prevChats,
//             {
//                title: currentTitle,
//                role: 'Me',
//                content: value,
//             },
//             {
//                title: currentTitle,
//                role: message.role,
//                content: message.content,
//             },
//             ]))
//       }
//    }, [message, currentTitle]);



//    // console.log(previousChats)

//    // console.log(uniqueTitles)
//    console.log(previousChats)
//    const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
//    const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
//    console.log(uniqueTitles)



//    return (
//       <div className="app">
//          <section className="side-bar">
//             <ul className="history">
//                {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
//             </ul>
//             <nav>
//             </nav>
//          </section>
//          <section className="main">
//             {!currentTitle}
//             <ul className="feed">
//                {currentChat?.map((chatMessage, index) => (
//                   <li key={index}>
//                      <p className='role'>{chatMessage.role}</p>
//                      <p>{chatMessage.content}</p>
//                   </li>
//                ))}

//             </ul>
//             <div className="bottom-section">
//                <div className="input-container">
//                   <input value={value} onChange={(e) => setValue(e.target.value)} />
//                   <div id="submit" onClick={getMessages}><button className='btn'>Send</button></div>
//                </div>
//             </div>
//          </section>
//          {/* <section className="swagger-ui">
//             <SwaggerUI url="C:\Users\ARMAGEDDON\Documents\my-chatgpt\my-chatgpt\src\swagger.js" />
//          </section> */}
//       </div>
//    );
// }

// export default App;
//өөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөөө
// import { useState, useEffect } from 'react'
// import axios from 'axios';


// const App = () => {
//    const [value, setValue] = useState(null)
//    const [message, setMessage] = useState(null)
//    const [previousChats, setPreviousChats] = useState([])
//    const [currentTitle, setCurrentTitle] = useState(null)

//    const createNewChat = () => {
//       setMessage(null)
//       setValue("")
//       setCurrentTitle(null)
//    }

//    const handleClick = (uniqueTitle) => {
//       setCurrentTitle(uniqueTitle)
//       setMessage(null)
//       setValue("")
//    }

//    const getMessages = async () => {
//       const options = {
//          method: "POST",
//          body: JSON.stringify({
//             message: value
//          }),
//          headers: {
//             "Content-Type": "application/json"
//          }
//       }
//       try {
//          const response = await fetch('http://localhost:8000/completions', options)
//          const data = await response.json()
//          setMessage(data.choices[0].message)
//       } catch (error) {
//          console.error(error)
//       }
//       try {
//          await axios.post('http://localhost:3001/saveData', { data: value });
//          alert('Data saved successfully!');
//       } catch (error) {
//          console.error('Error saving data:', error);
//       }

//    }


//    useEffect(() => {
//       console.log(currentTitle, value, message);

//       if (!currentTitle && value && message) {
//          setCurrentTitle(value);
//       }

//       if (currentTitle && value && message) {
//          setPreviousChats(prevChats => (
//             [...prevChats,
//             {
//                title: currentTitle,
//                role: 'user',
//                content: value,
//             },
//             {
//                title: currentTitle,
//                role: message.role,
//                content: message.content,
//             },
//             ]))
//       }
//    }, [message, currentTitle]);



//    // console.log(previousChats)

//    // console.log(uniqueTitles)
//    console.log(previousChats)
//    const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
//    const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
//    console.log(uniqueTitles)



//    return (
//       <div className="app">
//          <section className="side-bar">

//             <ul className="history">
//                {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
//             </ul>
//             <nav>
//             </nav>
//          </section>
//          <section className="main">
//             {!currentTitle}
//             <ul className="feed">
//                {currentChat?.map((chatMessage, index) => (
//                   <li key={index}>
//                      <p className='role'>{chatMessage.role}</p>
//                      <p>{chatMessage.content}</p>
//                   </li>
//                ))}

//             </ul>
//             <div className="bottom-section">
//                <div className="input-container">
//                   <input value={value} onChange={(e) => setValue(e.target.value)} />
//                   <div id="submit" onClick={getMessages}><button>Send</button></div>
//                </div>

//             </div>
//          </section>
//       </div>
//    );
// }

// export default App;

