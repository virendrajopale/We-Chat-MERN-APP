exports.getSender=(loggedUser,chatUser)=>{
    return chatUser[0]._id===loggedUser._id?chatUser[1].name:chatUser[0].name;
}

exports.getSenderDetails=(loggedUser,chatUser)=>{
    return chatUser[0]._id===loggedUser._id?chatUser[1]:chatUser[0];
}

exports.isSameSender=(messages,msg,i,userdId)=>{
    return (
        i<messages.length-1 && (
            messages[i+1].sender._id!==msg.sender._id ||
            messages[i+1].sender._id===undefined) &&
            messages[i].sender._id!==userdId
        )
    
}
exports.isLastMessage=(messages,i,userdId)=>{
    return (
        i===messages.length-1 &&(
            messages[messages.length-1].sender._id!==userdId &&
            messages[messages.length-1].sender._id
        )
    )
}
exports.isSameSenderMargin=(messages,msg,i,userId)=>{
    if( i<messages.length-1 && (
        messages[i+1].sender._id===msg.sender._id &&
        messages[i].sender._id!==userId) 
      ){
        return 33
      }
      else if(
        i<messages.length-1 && (
            messages[i+1].sender._id!==msg.sender._id &&
            messages[i].sender._id!==userId) || 
            (i===messages.length-1 && messages[i].sender._id!==userId)
      ){
        return 0
      }
      else return 'auto'
}
exports.isSameUser=(messages,msg,i)=>{
    return i>0 && messages[i-1].sender._id===msg.sender._id
}