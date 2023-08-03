import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { GET_GROUPS } from '../utils/queries';
import { CREATE_GROUP, JOIN_GROUP, DELETE_GROUP } from '../utils/mutations';
import AuthService from '../utils/auth';


const GroupsPage = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch the userId from AuthService when the component mounts
    setUserId(AuthService.getUserId());
  }, []);

  const { loading, data } = useQuery(GET_GROUPS);
  const [createGroupMutation] = useMutation(CREATE_GROUP);
  const [joinGroupMutation] = useMutation(JOIN_GROUP);
  const [deleteGroupMutation] = useMutation(DELETE_GROUP);

  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupPassword, setNewGroupPassword] = useState('');
  const [groupNameToJoin, setGroupNameToJoin] = useState('');
  const [groupPasswordToJoin, setGroupPasswordToJoin] = useState('');

  useEffect(() => {
    console.log('User ID from AuthService:', userId);
  }, [userId]);

  const groups = data ? data.groups : [];

  const deleteGroup = async (groupId) => {  // Add this function
    try {
      await deleteGroupMutation({
        variables: { id: groupId },
        refetchQueries: [{ query: GET_GROUPS }],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const createGroup = async () => {
    try {
      const { data: createGroupData } = await createGroupMutation({
        variables: {
          name: newGroupName,
          password: newGroupPassword,
        },
        refetchQueries: [{ query: GET_GROUPS }],
        update: (cache, { data }) => {
          const newGroup = data.createGroup;
          const existingGroups = cache.readQuery({ query: GET_GROUPS });
          cache.writeQuery({
            query: GET_GROUPS,
            data: {
              groups: [...existingGroups.groups, newGroup],
            },
          });
        },
      });

      setNewGroupName('');
      setNewGroupPassword('');
      const groupId = createGroupData.createGroup._id;

      // Pass the userId to the joinGroup function after the createGroup mutation is successful
      joinGroup(groupId, groupPasswordToJoin);
    } catch (err) {
      console.error(err);
    }
  };

  const joinGroup = async (groupName, password) => {
    try {
      console.log('User ID from joinGroup function:', userId);
  
      await joinGroupMutation({
        variables: {
          groupName: groupName,
          password: password,
        },
      });
      setGroupNameToJoin('');
      setGroupPasswordToJoin('');
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
        onChange={(e) => setNewGroupName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Group password"
        value={newGroupPassword}
        onChange={(e) => setNewGroupPassword(e.target.value)}
      />
      <button onClick={createGroup}>Create Group</button>

      <h3>Join an existing group</h3>
      <input
        type="text"
        placeholder="Group name to join"
        value={groupNameToJoin}
        onChange={(e) => setGroupNameToJoin(e.target.value)}
      />
      <input
        type="password"
        placeholder="Group password to join"
        value={groupPasswordToJoin}
        onChange={(e) => setGroupPasswordToJoin(e.target.value)}
      />
      <button onClick={() => joinGroup(groupNameToJoin, groupPasswordToJoin)}>Join Group</button>

      <h3>Existing Groups</h3>
      <ul>
      {groups.map((group) => (
        <li key={group._id}>
          {group.name} 
          <button onClick={() => deleteGroup(group._id)}>Delete Group</button>
        </li>
      ))}
    </ul>
    </div>
  );
};

export default GroupsPage;