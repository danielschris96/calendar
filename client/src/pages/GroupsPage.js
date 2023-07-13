import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_GROUPS } from '../utils/queries';
import { CREATE_GROUP, JOIN_GROUP } from '../utils/mutations';

const GroupsPage = () => {
  const { loading, data } = useQuery(GET_GROUPS);
  const [createGroupMutation] = useMutation(CREATE_GROUP);
  const [joinGroupMutation] = useMutation(JOIN_GROUP);

  const [newGroupName, setNewGroupName] = useState("");
  const [groupNameToJoin, setGroupNameToJoin] = useState("");

  const groups = data ? data.groups : [];

  const createGroup = async () => {
    try {
      await createGroupMutation({ variables: { name: newGroupName } });
      setNewGroupName("");
    } catch (err) {
      console.error(err);
    }
  };

  const joinGroup = async () => {
    try {
      await joinGroupMutation({ variables: { name: groupNameToJoin } });
      setGroupNameToJoin("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

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