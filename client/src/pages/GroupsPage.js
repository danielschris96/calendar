import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_GROUPS } from '../utils/queries';
import { CREATE_GROUP, JOIN_GROUP } from '../utils/mutations';

const GroupsPage = () => {
  const { loading, data } = useQuery(GET_GROUPS);
  const [createGroupMutation] = useMutation(CREATE_GROUP);
  const [joinGroupMutation] = useMutation(JOIN_GROUP);

  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupPassword, setNewGroupPassword] = useState("");
  const [groupNameToJoin, setGroupNameToJoin] = useState("");
  const [groupPasswordToJoin, setGroupPasswordToJoin] = useState("");

  const groups = data ? data.groups : [];

  const createGroup = async () => {
    try {
      await createGroupMutation({
        variables: {
          name: newGroupName,
          password: newGroupPassword,
        }
      });
      setNewGroupName("");
      setNewGroupPassword("");
    } catch (err) {
      console.error(err);
    }
  };

  const joinGroup = async () => {
    try {
      await joinGroupMutation({
        variables: {
          groupId: groupNameToJoin,
          userId: 'user_id_here', // Replace 'user_id_here' with the actual user ID if available
          password: groupPasswordToJoin,
        }
      });
      setGroupNameToJoin("");
      setGroupPasswordToJoin("");
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
      <input 
        type="password" 
        placeholder="Group password" 
        value={newGroupPassword}
        onChange={e => setNewGroupPassword(e.target.value)}
      />
      <button onClick={createGroup}>Create Group</button>

      <h3>Join an existing group</h3>
      <input 
        type="text" 
        placeholder="Group name to join" 
        value={groupNameToJoin}
        onChange={e => setGroupNameToJoin(e.target.value)}
      />
      <input 
        type="password" 
        placeholder="Group password to join" 
        value={groupPasswordToJoin}
        onChange={e => setGroupPasswordToJoin(e.target.value)}
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