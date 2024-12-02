import React from 'react'
import { useState, useEffect } from 'react'
import api from "../api"
import "../index.css"
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

export default function Profile({feed, setFeed}) {
  const [posts, setPosts] = useState([]);
  const [User, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [popUp, setPopUp] = useState(false);
  const [profile, setProfile] = useState(null);
  const [dropDown, toggleDropDown] = useState(false);
  const [PostsLikedByUsers, setPostsLikedByUsers] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [communities, setCommunities] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const navigateTo = useNavigate();
  const location = useLocation();
  const userId = Number(window.location.href.split("/").pop());


  useEffect(() => {
    window.scrollTo(0, 0)
    getUsers();
    getProfile(userId);
    getUsername(userId);
    getLikesByUser();
    getCommunities();
    if (feed==='created_at') {
      getUserPosts();
    } else {
      getUserPostsByLikes();
    }
  },[location])

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

  function getFields(input, field) {
    if (!input) return []
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
  }

  const handleSearch = (query) => {
    if (query === "") {
      setFilteredPosts(posts);
    } else {
      const results = posts.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
        || item.content.toLowerCase().includes(query.toLowerCase())
        || item.author_username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(results);
    }
  };

  const getUserPosts = () => {
    api
    .get(`/api/posts/user_posts/${userId}/`)
    .then((res) => res.data)
    .then((data) => {setPosts(data); setFilteredPosts(data)})
    .catch((error) => alert(error))
  }

  const getUserPostsByLikes = () => {
    api
    .get(`/api/posts/user_posts_by_likes/${userId}/`)
    .then((res) => res.data)
    .then((data) => {setPosts(data); setFilteredPosts(data)})
    .catch((error) => alert(error))
  }

  const getPost = (id) => {
    api
    .get(`/api/posts/detail/${id}/`)
    .then((res) => res.data)
    .then((data) => {
      setPosts((p) => 
        [...p.slice(0,getFields(p,'id').indexOf(data.id)),
          data,
        ...(p.slice(getFields(p,'id').indexOf(data.id) + 1, p.length))])
      setFilteredPosts((p) => 
        [...p.slice(0,getFields(p,'id').indexOf(data.id)),
          data,
        ...(p.slice(getFields(p,'id').indexOf(data.id) + 1, p.length))])
    })
    .catch((error) => alert(error))
  }
   

  const getUsers = () => {
    api
    .get("/api/posts/user/")
    .then((res) => res.data)
    .then((data) => {setUser(data)})
    .catch((error) => alert(error))
  }

  const getProfile = (id) => {
    api
    .get(`/api/user/profile/${id}/`)
    .then((res) => res.data)
    .then((data) => {setProfile(data)})
    .catch((error) => alert(error))
  }

  const getUsername = (id) => {
    api
    .get(`/api/posts/user/username/${id}/`)
    .then((res) => res.data)
    .then((data) => {setUsername(data)})
    .catch((error) => alert(error))
  }


  const getCommunities = () => {
    api
    .get("/api/communities/")
    .then((res) => res.data)
    .then((data) => {setCommunities(data)})
    .catch((error) => alert(error))
  }

  const getLikesByUser = () => {
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

  const handleLike = (el) => {
    api.post(`/api/posts/like/${el.id}/`).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getPost(el.id)
        getLikesByUser(); 
      } else {
        alert("Failed to like post!")
      }
    }).catch((error) => alert(error))
  }

  const handleUpdateProfile = () => {

    let formData = new FormData();
    formData.append("bio", bio);
    if (profilePicture) {
        formData.append("profile_picture", profilePicture); 
    }

    api.post(`/api/user/profile/update/${User.id}/`, formData).then((res) => {
      if (res.status === 201 || res.status === 200) {
        console.log('posted')
        getProfile(userId);
        setPopUp(false);
      } else {
        alert("Failed to create post!")
      }
    }).catch((error) => alert(error))
    setBio('');
    setProfilePicture(null);
  }

  return (
    <div className='main'>
      <div className='main-profile-profile-header'>
        <img className='main-profile-profile-picture' src={`${import.meta.env.VITE_API_URL}${profile ? profile.profile_picture : '/assets/default_profile_picture.png'}`} alt="profile_picture" />
        <div className='main-profile-profile-header-div'>
          <h1>{username ? username.username : '...'}{username ? username.is_health_professional ? <span className='post-header-diamond'>&#9670;</span> : null : null}</h1>
          <p style={{color: 'gray'}}>Joined {profile ? formatTime(profile.created_at) : '...'} ago</p>
        </div>
      </div>
      <p>{profile ? profile.bio : '...'}</p>
      <div>
        {userId === User?.id ? <button className='main-profile-update-button' onClick={(t) => setPopUp(true)}>Update Profile</button> : null}
        {popUp ?
        <> 
          <div className='popup-div'>
            <h1>Update Profile</h1>
            <div className='popup-div-body'>
              <div className='popup-div-body-top more_gap'>
                <label htmlFor="inputField"><img className="btn-info" src={`${profilePicture ? imageUrl : profile.profile_picture ? `${import.meta.env.VITE_API_URL}${profile.profile_picture}` : `${import.meta.env.VITE_API_URL}/assets/default_profile_picture.png`}`}/></label>
                <input type="file" id="inputField" accept="image/*" onChange={(e) => {setProfilePicture(e.target.files[0]); setImageUrl(URL.createObjectURL(e.target.files[0]));}}/>
                <div className='popup-div-body-top-right more_gap'>
                  <p>Description:</p>
                  <textarea name="bio" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                </div>
              </div>
            </div>
            <div className='popup-div-footer'>
              <button className="create-community-button-cancel" onClick={() => {setPopUp(false); setProfilePicture(null)}}>Cancel</button>
              <button className="create-community-button-create" onClick={handleUpdateProfile}>Submit</button>
            </div>
          </div>
          <div className='popup-blackout'></div>
        </>
         : null}
      </div>
      <h2>User's Posts</h2>
      <div className='main-header-div'>
        <div style={{position: 'relative'}}>
          <button className='main-header-sortfeed' onClick={() => toggleDropDown((d) => !d)}>Sort By</button>
          {dropDown ? 
          <div className='main-searchbar-recomendations'>
            <button
              style={{backgroundColor: feed === 'created_at' ? 'white' : '#0268c8', color: feed === 'created_at' ? 'black' : 'white'}}
              onClick={() => {getUserPostsByLikes(); setFeed('likes')}}>
              Most Popular
              </button>
            <button
              style={{backgroundColor: feed === 'created_at' ? '#0268c8' : 'white', color: feed === 'created_at' ? 'white' : 'black'}}
              onClick={() => {getUserPosts(); setFeed('created_at')}}>
              Recent
            </button>
          </div> : null}
        </div>
        <div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      {filteredPosts.map((el,id) => 
        <div className="post-div" onClick={() => navigateTo(`/detail/${el.id}`,{ state: {from: location} })} key={id}>
          <div className="main-feed-post-header">
            <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
            <img className="main-feed-post-header-image" src={`${import.meta.env.VITE_API_URL}${communities ? communities.filter((c) => c.id === el.community)[0]?.community_picture ? communities.filter((c) => c.id === el.community)[0]?.community_picture : '/assets/default_community_image.png': '/assets/default_community_image.png'}`} alt="" />
            <div className="main-feed-post-header-info">
              <button onClick={(e) => {e.stopPropagation(); navigateTo(`/community/${el.community}`);}} className='main-feed-post-url bold'>{communities ? communities.filter((community) => community.id === el.community)[0].name : '...'}</button>
              <button onClick={(e) => {e.stopPropagation(); navigateTo(`/profile/${el.author}`);}} className='main-feed-post-url'>{el.author_username}{el.author_is_health_professional ? <span className='post-header-diamond'>&#9670;</span> : null}</button>
            </div>
            </div>
            <div>
            {communities?.filter((c) => c.id === el.community)[0].author === User?.id ? <p style={{color:'gray'}} className="main-feed-post-body-content">{el.reports} reports</p> : ''}
            <div className="main-feed-post-header-warning">
              {el.warning ? <button className='main-feed-post-body-warned'>!</button> : ""}
            </div>
            </div>
          </div>
          <p className="main-feed-post-body-title">{el.title}</p>
          <p className="main-feed-post-body-content">{el.content.slice(0,400)}{el.content.length > 400 ? '...' : ''}</p>
          {el.post_picture ? <img className='main-feed-post-image' src={`${import.meta.env.VITE_API_URL}${el.post_picture}`} alt="error loading post image"/> : null}
          <div className="main-feed-post-body-footer">
            <button
              className='main-feed-post-body-likes'
              style={{backgroundColor: getFields(PostsLikedByUsers, 'id').includes(el.id) ? '#0571d3' : 'gray'}} 
              onClick={(e) => {e.stopPropagation() ;handleLike(el)}}>
              {el.likes} likes
            </button>
            <p className="main-feed-post-body-time">{formatTime(el.created_at)}</p>
          </div>
        </div>
      )}
    </div>
  )
}
