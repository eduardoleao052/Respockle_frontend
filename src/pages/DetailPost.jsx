import React, { useEffect, useState } from 'react'
import api from "../api"
import "../styles/Home.css"
import { useNavigate } from "react-router-dom";
import "../index.css"


export default function DetailPost() {
  const navigateTo = useNavigate();
  const idRoot = window.location.href.split("/").pop()
  const id = Number(isNaN(idRoot) ? idRoot.slice(0, idRoot.length - 1) : idRoot);
  const [post, setPost] = useState()
  const [User, setUser] = useState(null);
  const [deletePopUp, setDeletePopUp] = useState(false)
  const [reportPopUp, setReportPopUp] = useState(false)
  const [warningPopUp, setWarningPopUp] = useState(false)
  const [warningPopUpBlocked, setWarningPopUpBlocked] = useState(false)
  const [warning, setWarning] = useState("")
  const [content, setContent] = useState("")
  const [comments, setComments] = useState([])
  const [communities, setCommunities] = useState(null);
  const [PostsLikedByUsers, setPostsLikedByUsers] = useState(null);
  const [PostsReportedByUsers, setPostsReportedByUsers] = useState(null);
  const [PostsSavedByUsers, setPostsSavedByUsers] = useState(null);
  const [CommentsLikedByUsers, setCommentsLikedByUsers] = useState(null);
  const [commenting, setCommenting] = useState(false);
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    getPost();
    getUsers();
    getCommunities();
    getPostsLikedByUser();
    getPostsSavedByUser();
    getPostsReportedByUser();
    getCommentsLikedByUser();
    getComments();
    getProfiles();
  },[])

  function formatTime(time) {
    let timeSinceCreation = (Date.now() - new Date(time).getTime())/1000;
    let days = Math.floor(timeSinceCreation/84600)
    let hours = Math.floor((timeSinceCreation - days*84600)/3600)
    let minutes = Math.floor((timeSinceCreation - 3600*hours - days*84600)/60)
    let seconds = Math.floor((timeSinceCreation - 3600*hours - 60*minutes - days*84600))
    if (days >= 1) {
      return `${days} days`;
    } else if (hours >= 1) {
      return `${hours} h`
    } else if (minutes >= 1) {
      return `${minutes} m`
    } else if (seconds >= 1) {
      return `${seconds} s`
    } else return 'now'
  }

  const getPostsLikedByUser = () => {
    api
    .get(`/api/posts/posts_liked_by_user/`)
    .then((res) => res.data)
    .then((data) => {
      if (data !== PostsLikedByUsers) {
        setPostsLikedByUsers(data)
      }
    }) 
    .catch((error) => alert(error))
  }

  const getPostsReportedByUser = () => {
    api
    .get(`/api/posts/posts_reported_by_user/`)
    .then((res) => res.data)
    .then((data) => {
      if (data !== PostsReportedByUsers) {
        setPostsReportedByUsers(data)
      }
    }) 
    .catch((error) => alert(error))
  }

  const getPostsSavedByUser = () => {
    api
    .get(`/api/posts/posts_saved_by_user/`)
    .then((res) => res.data)
    .then((data) => {
      console.log(data)
      setPostsSavedByUsers(data)
    }) 
    .catch((error) => alert(error))
  }
  const getProfiles = () => {
    api
    .get("/api/posts/all_profiles/")
    .then((res) => res.data)
    .then((data) => {setProfiles(data)})
    .catch((error) => alert(error))
  }

  const getUsers = () => {
    api
    .get("/api/posts/user/")
    .then((res) => res.data)
    .then((data) => {setUser(data)})
    .catch((error) => alert(error))
  }

  const getCommentsLikedByUser = () => {
    api
    .get(`/api/posts/comments_liked_by_user/${id}`)
    .then((res) => res.data)
    .then((data) => {
      if (data !== PostsLikedByUsers) {
        setCommentsLikedByUsers(data)
      }
    }) 
    .catch((error) => alert(error))
  }

  function getFields(input, field) {
    if (!input) return []
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
  }

  const getPost = () => {
    api
    .get(`/api/posts/detail/${id}/`)
    .then((res) => res.data)
    .then((data) => {setPost(data)})
    .catch((error) => alert(error))
  }

  const getComments = () => {
    api
    .get(`/api/posts/comments/${id}/`)
    .then((res) => res.data)
    .then((data) => {setComments(data)})
    .catch((error) => alert(error))
  }

  const getCommunities = () => {
    api
    .get("/api/communities/")
    .then((res) => res.data)
    .then((data) => {setCommunities(data)})
    .catch((error) => alert(error))
  }

  const deletePost = () => {
    api.delete(`/api/posts/delete/${id}/`).then((res) => {
      if (res.status === 204 || res.status === 200) {
        navigateTo(-1)
      }
      else alert("Failed to delete post!")
    }).catch((error) => alert(error))
  }

  const handleLike = (el) => {
    api.post(`/api/posts/like/${el.id}/`).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getPost();
        getPostsLikedByUser();
      } else {
        alert("Failed to like post!")
      }
    }).catch((error) => alert(error))
  }

  const handleReport = (id) => {
    api.post(`/api/posts/report/${id}/`).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getPost();
        getPostsReportedByUser();
        setReportPopUp(false);
      } else {
        alert("Failed to like post!")
      }
    }).catch((error) => alert(error))
  }

  const handleSave = (el) => {
    api.post(`/api/posts/save/${el.id}/`).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getPost();
        getPostsSavedByUser();
      } else {
        alert("Failed to like post!")
      }
    }).catch((error) => alert(error))
  }


  const handleCommentLike = (el) => {
    api.post(`/api/posts/comments/like/${el.id}/`).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getComments();
        getCommentsLikedByUser();
      } else {
        alert("Failed to like post!")
      }
    }).catch((error) => alert(error))
  }

  const toggleCommenting = () => {
    setCommenting(!commenting)
  }

  const createComment = (e) => {
    e.preventDefault()
    if (content) {
      api.post(`/api/posts/comments/create/${id}/`, {content}).then((res) => {
        if (res.status === 201 || res.status === 200) {
          getComments()
        } else {
          alert("Failed to create post!")
        }
      }).catch((error) => alert(error))
      setContent('');
    }
  }

  const handleChangeComment = (e) => {
    setContent(e.target.value)
  }

  const handleWarn = () => {
    api.post(`/api/posts/add_warning/${id}/`, {warning}).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getPost()
      } else {
        alert("Failed to create warning!")
      }
    }).catch((error) => alert(error))
    setWarning('')
    setWarningPopUp(false)
  }


  return (
    post ? 
      <div className="post-detail" key={id}>
        <button className="main-feed-post-body-back" onClick={() => navigateTo(-1)}>&#8592;</button>
        <div className="main-feed-post-header">
            <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
            <img className="main-feed-post-header-image" src={`${import.meta.env.VITE_API_URL}${communities ? communities.filter((c) => c.id === post.community)[0]?.community_picture ? communities.filter((c) => c.id === post.community)[0]?.community_picture : '/assets/default_community_image.png': '/assets/default_community_image.png'}`} alt="" />          
            <div className="main-feed-post-header-info">
              <button className='main-feed-post-url bold' onClick={() => navigateTo(`/community/${post.community}`)}>
                {communities ? communities.filter((community) => community.id === post.community)[0].name : null}
              </button>  
              <button className='main-feed-post-url gray' onClick={(e) => {navigateTo(`/profile/${post.author}`);}}>
                {post.author_username}{post.author_is_health_professional ? <span className='post-header-diamond'>&#9670;</span> : null}
              </button>
            </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center', color: 'gray'}}>
              {communities?.filter((c) => c.id === post.community)[0].author === User?.id ? <p>{post.reports} reports</p> : null}      
              {(post.author === User?.id || communities?.filter((c) => c.id === post.community)[0].author === User?.id) ? <button  style={{margin: '0px'}} className='main-feed-post-body-delete' onClick={() => setDeletePopUp(post.id)}>Delete</button> : null}
            </div>
        </div>
        <p className="main-feed-post-body-title">{post.title}</p>
        <p className="main-feed-post-body-content">{post.content}</p>
        {post.post_picture ? <img className='main-feed-post-image' src={`${import.meta.env.VITE_API_URL}${post.post_picture}`} alt="error loading post image"/> : null}
        {deletePopUp ? 
        <>
          <div className='popup-div'>
            <p>Do you want to delete this post?</p>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0px 20px'}}>
              <button className="main-feed-post-body-back" onClick={() => setDeletePopUp(false)}>Cancel</button>
              <button className="main-feed-post-body-delete" onClick={() => deletePost(deletePopUp)}>
              Delete
            </button>
            </div>
          </div>
          <div className='popup-blackout'></div>
        </> :
        null
        }
        {reportPopUp ? 
        <>
          <div className='popup-div'>
            <p>Do you want to report this post?</p>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0px 20px'}}>
              <button className="main-feed-post-body-back" onClick={() => setReportPopUp(false)}>
                Cancel
              </button>
              <button className="main-feed-post-body-delete" onClick={() => handleReport(reportPopUp)}>
                Report
              </button>
            </div>
          </div>
          <div className='popup-blackout'></div>
        </> :
        null
        }
        {warningPopUp ? 
        <>
          <div className='popup-div'>
            <p>Enter your report message.</p>
            <p style={{marginBottom: "20px"}}> It will be displayed at the top of the comment section.</p>
            <textarea style={{display: "block"}} onChange={(e) => {setWarning(e.target.value)}} value= {warning}></textarea>
            <button style={{marginRight: "30px"}} className="main-feed-post-body-back" onClick={() => setWarningPopUp(false)}>Cancel</button>
            <button style={{marginLeft: "30px"}} className="main-feed-post-body-delete" onClick={() => handleWarn()}>
              Confirm
            </button>
          </div>
          <div className='popup-blackout'></div>
        </> :
        null
        }
        {warningPopUpBlocked ? 
        <>
          <div className='popup-div'>
            <p>A health professional already left a report.</p>
            <p>Please add a comment to the post instead!</p>
            <button className="main-feed-post-body-back" onClick={() => setWarningPopUpBlocked(false)}>Cancel</button>
          </div>
          <div className='popup-blackout'></div>
        </> :
        null
        }
        <div className="main-feed-post-body-footer">
          <div className="main-feed-post-body-footer-left">
            <button
              className='main-feed-post-body-likes'
              style={{backgroundColor: getFields(PostsLikedByUsers, 'id').includes(post.id) ? '#0571d3' : '#a1a1a1'}} 
              onClick={() => {handleLike(post)}}>
              {post.likes} likes
            </button>
            <button 
              className='main-feed-post-body-likes'
              style={{backgroundColor: getFields(PostsSavedByUsers, 'id').includes(post.id) ? '#0571d3' : '#a1a1a1'}} 
              onClick={() => handleSave(post)}>
              Save
            </button>
            <button className="main-feed-post-body-likes"
              style={{backgroundColor: commenting ? '#0571d3' : '#a1a1a1'}}  
              onClick={() => toggleCommenting()}>Comment
            </button>
            {!(post.author === User?.id) ? 
            <button className="main-feed-post-body-likes"
                style={{backgroundColor: getFields(PostsReportedByUsers, 'id').includes(post.id) ? '#9c1010' : '#a1a1a1'}} 
                onClick={() => {
                  console.log(User)
                  if (User.is_health_professional) {
                    if (!post.warning) {
                      setWarningPopUp(true)
                    } else {
                      setWarningPopUpBlocked(true)
                    }
                  } else {
                    getFields(PostsReportedByUsers, 'id').includes(post.id) ?
                    handleReport(post.id) : 
                    setReportPopUp(post.id)
                  }
                }}>
                Report
            </button> : null}
            </div>
            <p className="main-feed-post-body-time">{formatTime(post.created_at)}</p>
          </div>
          <div className='horizontal-line'></div>
        { commenting ? 
        <div>
          <form action=''>
          <textarea onChange={(e) => handleChangeComment(e)} value={content} id="comment-content-form"></textarea>
          </form>
          <button className="main-feed-post-body-comment" onClick={createComment}>Submit</button>
        </div>
        :
        null
        }
        <div>
        {post.warning ? <div style={{background:'lightblue'}}className="post-div">
        <div className="main-feed-post-header">
          <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
            <img 
                  className="main-feed-post-header-image"
                  src={`${import.meta.env.VITE_API_URL}${profiles ? 
                    profiles.filter((c) => c.user_id === post.warn_author)[0]?.profile_picture ? 
                    profiles.filter((c) => c.user_id === post.warn_author)[0].profile_picture : 
                    '/assets/default_profile_picture.png': 
                    '/assets/default_profile_picture.png'}`}/>
              <div className="main-feed-post-header-info">
                  <button style={{paddingTop: '6px'}} className='main-feed-post-url bold' onClick={(e) => {navigateTo(`/profile/${post.warn_author}`);}}>
                    {post.warn_author_username}<span className='post-header-diamond'>&#9670;</span>
                  </button>
              </div>
            </div>
          </div>
          <p style={{margin: '13px 0px'}} className="main-feed-post-body-content">{post.warning}</p>
        </div> : null}
        {comments.map((el,id) => 
        <div className="post-div" key={id}>
          <div className="main-feed-post-header">
            <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
            <img className="main-feed-post-header-image" src={`${import.meta.env.VITE_API_URL}${el.author_profile_picture ? el.author_profile_picture  : '/assets/default_profile_picture.png'}`} alt="" />          
            <div className="main-feed-post-header-info">
              <button style={{paddingTop: '6px'}} className='main-feed-post-url bold' onClick={(e) => {navigateTo(`/profile/${el.author}`);}}>
                {el.author_username}{el.author_is_health_professional ? <span className='post-header-diamond'>&#9670;</span> : null}
              </button>
            </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center', color: 'gray'}}>
            </div>
          </div>
          <p style={{margin: '13px 0px'}} className="main-feed-post-body-content">{el.content}</p>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <button
              className='main-feed-post-body-likes'
              style={{backgroundColor: getFields(CommentsLikedByUsers, 'id').includes(el.id) ? '#0571d3' : '#a1a1a1'}} 
              onClick={() => {handleCommentLike(el)}}>
              {el.likes} likes
            </button>
            <p className="main-feed-post-body-time">{formatTime(el.created_at)}</p>
          </div>
        </div>
      )}
        </div>
      </div> : null
    )
}
