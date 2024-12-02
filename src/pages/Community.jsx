import React from 'react'
import { useState, useEffect } from 'react'
import api from "../api"
import "../styles/Home.css"
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import "../index.css"

export default function Community({setTrigger, feed, setFeed}) {
  const [posts, setPosts] = useState([]);
  const [User, setUser] = useState(null);
  const [dropDown, toggleDropDown] = useState(false);
  const [profiles, setProfiles] = useState  (null);
  const [PostsLikedByUsers, setPostsLikedByUsers] = useState(null);
  const [usersInCommunity, setUsersInCommunity] = useState(null);
  const [communities, setCommunities] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const communityId = Number(window.location.href.split("/").pop());
  const navigateTo = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0,0);
    getUsers();
    getLikesByUser();
    getProfiles();
    getCommunities();
    setTrigger((t) => !t)
    if (feed==='created_at') {
      getCommunityPosts();
    } else if (feed==='likes') {
      getCommunityPostsByLikes();
    } else if (feed==='reports') {
      getCommunityPostsByReports();
    }
    getUsersInCommunity();
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

  const getCommunityPostsByLikes = () => {
    api
    .get(`/api/community_by_like/${communityId}/`)
    .then((res) => res.data)
    .then((data) => {setPosts(data); setFilteredPosts(data)})
    .catch((error) => alert(error))
  }

  const getCommunityPostsByReports = () => {
    api
    .get(`/api/community_by_report/${communityId}/`)
    .then((res) => res.data)
    .then((data) => {setPosts(data); setFilteredPosts(data)})
    .catch((error) => alert(error))
  }

  function getFields(input, field) {
    if (!input) return []
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
  }

  const getCommunityPosts = () => {
    api
    .get(`/api/community/${communityId}/`)
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

  const getUsersInCommunity = () => {
    api
    .get(`/api/community/users_in_community/${communityId}/`)
    .then((res) => res.data)
    .then((data) => {
      if (data !== usersInCommunity) {
        setUsersInCommunity(data)
      }
    }) 
    .catch((error) => alert(error))
  }

  const deleteCommunity = () => {
    api.delete(`/api/community/delete/${communityId}/`).then((res) => {
      if (res.status === 204 || res.status === 200) {
        navigateTo('/')
        setTrigger((t) => !t)
      }
      else alert("Failed to delete post!")
    }).catch((error) => alert(error))
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

  const handle_membership = () => {
    api.post(`/api/community/handle_membership/${communityId}/`).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getUsersInCommunity();
        getCommunities();
        getCommunityPosts();
        setTrigger((t) => !t)
      } else {
        alert("Failed to like post!")
      }
    }).catch((error) => alert(error))
  }

  return (
    <div className='main'>
      <div className='main-header'>
        <div className='community-title-picture'>
          <img className="community-profile-picture" src={`${import.meta.env.VITE_API_URL}${communities ? communities.filter((c) => c.id === communityId)[0]?.community_picture ? communities.filter((c) => c.id === communityId)[0]?.community_picture : '/assets/default_profile_picture.png': '/assets/default_profile_picture.png'}`} alt="" />
          <h1>{communities ? communities.filter((c) => c.id === communityId)[0]?.name : null}</h1>
        </div>
        <h4 style={{marginTop:'10px', marginBottom:'10px'}}>{communities ? communities.filter((c) => c.id === communityId)[0]?.description : null}</h4>
        <h4 style={{marginBottom:'10px'}}>{communities ? communities.filter((c) => c.id === communityId)[0]?.members.length : null} members</h4>
        {(communities?.filter((c) => c.id === communityId)[0]?.author === User?.id) ? 
        <button className='community-delete' onClick={() => setDeletePopUp(true)}>Delete Community</button> :
        <button className='community-leave-join' onClick={() => handle_membership()}>{User ? (getFields(usersInCommunity, 'id').includes(User.id) ? 'leave' : 'join') : false}</button>}
        {deletePopUp ?
          <>
            <div className='popup-div'>
              <p>Do you want to delete the community?</p>
              <div style={{display:'flex', flexDirection:'row',justifyContent:'space-around'}}>
                <button className='community-delete-cancel' onClick={() => setDeletePopUp(false)}>Cancel</button>
                <button className='community-delete-confirm' onClick={() => deleteCommunity()}>
              
                Delete
              </button>
              </div>
            </div>
            <div className='popup-blackout'></div>
          </> :
          null
        }
        <div className='main-header-div'>
          <div style={{position: 'relative'}}>
            <button className='main-header-sortfeed' onClick={() => toggleDropDown((d) => !d)}>Sort By</button>
            {dropDown ? 
            <div className='main-searchbar-recomendations'>
              <button 
                style={{backgroundColor: feed === 'likes' ? '#0268c8' : 'white', color: feed === 'likes' ? 'white' : 'black'}}
                onClick={() => {getCommunityPostsByLikes(); setFeed('likes')}}>
                Most Popular
                </button>
              <button 
                style={{backgroundColor: feed === 'created_at' ? '#0268c8' : 'white', color: feed === 'created_at' ? 'white' : 'black'}}
                onClick={() => {getCommunityPosts(); setFeed('created_at')}}>
                Recent
              </button>
              {communities?.filter((c) => c.id === communityId)[0].author === User?.id ?
              <button 
                style={{backgroundColor: feed === 'reports' ? '#0268c8' : 'white', color: feed === 'reports' ? 'white' : 'black'}}
                onClick={() => {getCommunityPostsByReports(); setFeed('reports')}}>
                Reports
              </button> : null}
            </div> : null}
          </div>
          <div>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>
      {filteredPosts.map((el,id) => 
        <div className="post-div" onClick={() => navigateTo(`/detail/${el.id}`,{ state: {from: location} })} key={id}>
          <div className="main-feed-post-header">
            <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
              <img 
              className="main-feed-post-header-image"
              src={`${import.meta.env.VITE_API_URL}${profiles ? 
                profiles.filter((c) => c.user_id === el.author)[0]?.profile_picture ? 
                profiles.filter((c) => c.user_id === el.author)[0].profile_picture : 
                '/assets/default_profile_picture.png': 
                '/assets/default_profile_picture.png'}`}/>
              <div className="community-feed-post-header-info">
                <button onClick={(e) => {e.stopPropagation(); navigateTo(`/profile/${el.author}`);}} className='community-feed-post-url'>{el.author_username}{el.author_is_health_professional ? <span className='post-header-diamond'>&#9670;</span> : null}</button>
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
