import React from 'react';
import axios from 'axios'
import Friend from './friend';

class Friends extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            friends: [],
            name:'',
            location:'',
            updatename:'',
            updatelocation:'',
            updatelikes:0,
            updatedislikes:0,
            updateid:0
        }
        this.getName = this.getName.bind(this)
        this.getLocation = this.getLocation.bind(this)
        this.addFriend = this.addFriend.bind(this)
        this.receiveIdAndDelete = this.receiveIdAndDelete.bind(this)
        this.receiveIdAndEdit = this.receiveIdAndEdit.bind(this)
        this.getNameUpdate = this.getNameUpdate.bind(this)
        this.getLocationUpdate = this.getLocationUpdate.bind(this)
        this.updateFriend = this.updateFriend.bind(this)
        this.updateLike = this.updateLike.bind(this)
        this.updateDislike = this.updateDislike.bind(this)
    }



    componentWillMount() {
        this.getFriends()
    }

    getFriends() {
        axios.get('http://localhost:1234/all')
            .then((response) => {
                console.log(response);
                console.log(response.data);
                this.setState({ friends: response.data })
            }, (error) => {
                console.log(error);
            })
    }

    receiveIdAndDelete = function(receivedID){
        console.log("I am called from Friend (child) component!");
        console.log("I am in Friends component!");
        console.log("Deleting with ID: " + receivedID);

        axios.delete('http://localhost:3000/allfriends/' + receivedID)
                .then(res=>{
                    console.log("Deleted with Id: " + receivedID);
                    //udpate this.state.friends with new response after delete!
                    this.getFriends()
                }, err =>{
                    console.log(err);
                })
    }

    getFriendWithId(id){
        console.log("Get friend with ID: " + id);
        axios.get('http://localhost:1234/get/' + id)
        .then(res =>{
            console.log(res);
            console.log(res.data[0]);
            this.setState({
                updatename:res.data[0].name,
                updatelocation:res.data[0].location,
                updatelikes:res.data[0].likes,
                updatedislikes:res.data[0].dislikes,
                updateid:res.data[0].id
            })
            console.log("Received updated state: " + this.state.updatelikes);
        }, err =>{
            console.log(err);
        })

    }

    receiveIdAndEdit = function(receivedID){
        console.log("Edit with ID: " + receivedID );
        //get the friend detail for receivedId
       this.getFriendWithId(receivedID)

    }

    updateLike = function(receivedID){
        console.log("Change like in Friends for ID: " +  receivedID);
        //retrieve the value of likes for ID
        axios.get('http://localhost:1234/get/'+ receivedID)
            .then(res=>{
                this.setState({
                    updatelikes: res.data[0].likes + 1
                })
                console.log(this.state.updatelikes);
                var updateLikeJson = {
                    "likes": this.state.updatelikes
                }
                axios.put('http://localhost:1234/update/likes/'+ receivedID, updateLikeJson)
                        .then(res =>{
                            console.log(res.data);
                            this.getFriends()
                        }, err=>{
                            console.log(err);
                        })

            },  err=>{
                console.log(err);
            })
        
        
    }

    updateDislike = function(receivedID){
        console.log("Change dislike in Friends for ID: " +  receivedID);
         //retrieve the value of likes for ID
         axios.get('http://localhost:1234/get/'+ receivedID)
         .then(res=>{
             this.setState({
                 updatedislikes: res.data[0].dislikes + 1
             })
             console.log(this.state.updatedislikes);
             var updateDisLikeJson = {
                 "dislikes": this.state.updatedislikes
             }
             axios.put('http://localhost:1234/update/dislikes/'+ receivedID, updateDisLikeJson)
                     .then(res =>{
                         console.log(res.data);
                         this.getFriends()
                     }, err=>{
                         console.log(err);
                     })

         },  err=>{
             console.log(err);
         })
    }

    displayFriends = function () {
        return this.state.friends.map((friend) => {
                    return (
                        <Friend key={friend.id}
                            id={friend.id}
                            name={friend.name}
                            loc={friend.location}
                            like={friend.likes}
                            dislike={friend.dislikes}
                            deleteWithId={this.receiveIdAndDelete}
                            editWithId={this.receiveIdAndEdit}
                            changeLike ={this.updateLike}
                            changeDislike={this.updateDislike}
                        ></Friend>
                    )
        })


    }

    addFriend = function(){
        if (!(this.state.name == '') && !(this.state.location=='')) {
            var friendJson = {
                "name":this.state.name,
                "location":this.state.location,
                "likes": 0,
                "dislikes":0
            }
           
            axios.post('http://localhost:1234/add?name='+this.state.name+"&location=" + this.state.location)
                    .then(res=>{
                        console.log("Friend Added!");
                        this.setState({name: ''})
                        this.setState({location:''})
                        console.log(res);
                        this.getFriends()
                    }, err=>{
    
                    })
        }

        
    }

    getName = function(e){
        //e.preventDefault()
        this.setState({name: e.target.value})
        console.log(this.state.name);
    }

    getLocation = function(e){
        //e.preventDefault()
        this.setState({location: e.target.value})
        console.log(this.state.location);
    }

    updateFriend = function(){
        console.log("Update Friend With ID: " + this.state.updateid);

        if (!(this.state.updatename == '') && !(this.state.updatelocation=='')) {
            var updatefriendJson = {
                "name":this.state.updatename,
                "location":this.state.updatelocation,
                "likes": this.state.updatelikes,
                "dislikes":this.state.updatedislikes
            }
            
            axios.put('http://localhost:1234/update/' + this.state.updateid, updatefriendJson)
                    .then(res=>{
                        console.log("Friend Updated!");
                        this.setState({ 
                            updatename: '',
                            updatelocation:'',
                            updatelikes:0,
                            updatedislikes:0,
                            updateid:0
                        })
                        console.log(res);
                        console.log(res.data);
                        this.getFriends()
                    }, err=>{
                        console.log(err);
                    })
        }


    }

    getNameUpdate = function(e){
        this.setState({updatename: e.target.value})
    }

    getLocationUpdate = function(e){
        this.setState({updatelocation: e.target.value})
    }

    render() {
        return (
            <div>


                <table border='1'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Like</th>
                            <th>Dislike</th>
                            <th colSpan='4'>
                                Actions
                             </th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.displayFriends()}
                    </tbody>

                </table>
                <br />
                <fieldset>
                   <legend>Add Friend</legend>
               
               
                    Name:       <input type="text" 
                                    value={this.state.name} 
                                    onChange={this.getName}/>
                    <br />
                    Location:   <input type="text" 
                                    value={this.state.location} 
                                    onChange={this.getLocation}/>
                    <br />
                    <button onClick={this.addFriend}>Add</button>
                    
                </fieldset>
                <br />
                <fieldset>
                <legend>Update Friend</legend>
                 Id:         <input type="text" 
                                 value={this.state.updateid}   
                                 readOnly/>
                <br />
                 Likes:         <input type="text" 
                                 value={this.state.updatelikes}   
                                 readOnly/>
                <br />
                 Dislikes:         <input type="text" 
                                 value={this.state.updatedislikes}
                                 readOnly/>
                <br />

                 Name:       <input type="text" 
                                 value={this.state.updatename} 
                                 onChange={this.getNameUpdate}/>
                 <br />
                 Location:   <input type="text" 
                                 value={this.state.updatelocation} 
                                 onChange={this.getLocationUpdate}/>
                 <br />
                 <button onClick={this.updateFriend}>Update</button>
                 
             </fieldset>
          
            </div>
        );
    }
}

export default Friends;