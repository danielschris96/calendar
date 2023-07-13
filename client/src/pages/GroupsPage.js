
import React, { useState, useEffect } from 'react';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [groupNameToJoin, setGroupNameToJoin] = useState("");

  useEffect(() => {
    // TODO: fetch groups from your API and update the groups state
    // setGroups(fetchedGroups);
  }, []);

  const createGroup = async () => {
    // TODO: use your API to create a group with newGroupName
    // after group is created, clear the new group name input and refresh the list of groups
    setNewGroupName("");
  };

  const joinGroup = async () => {
    // TODO: use your API to add current user to group with name groupNameToJoin
    // after user has joined group, clear the input and refresh the list of groups
    setGroupNameToJoin("");
  };

  return (
    <div>
      <h2>Groups</h2>
      <h3>Create a new group</h3>
      <input 
        type="text" 
        placeholder="New group name" 
        value={newGroupName}
        onChange={e => setNewGroupName(e.target.value)}
      />
      <button onClick={createGroup}>Create Group</button>
      
      <h3>Join an existing group</h3>
      <input 
        type="text" 
        placeholder="Group name to join" 
        value={groupNameToJoin}
        onChange={e => setGroupNameToJoin(e.target.value)}
      />
      <button onClick={joinGroup}>Join Group</button>

      <h3>Existing Groups</h3>
      <ul>
        {groups.map(group => (
          <li key={group._id}>{group.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GroupsPage;