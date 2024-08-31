import React from "react";
import styled from "styled-components";

const FriendListContainer = styled.div`
  background-color: #16202d;
  padding: 1rem;
  margin-top: 1rem;
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: #2a475e;
  margin-bottom: 0.5rem;
`;

const FriendAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const FriendName = styled.span`
  color: #c6d4df;
`;

const OnlineStatus = styled.span<{ isOnline: boolean }>`
  color: ${(props) => (props.isOnline ? "#66c0f4" : "#8f98a0")};
  margin-left: auto;
`;

interface Friend {
  id: string;
  username: string;
  avatarUrl: string;
  isOnline: boolean;
}

interface FriendListProps {
  friends: Friend[];
}

const FriendList: React.FC<FriendListProps> = ({ friends }) => {
  return (
    <FriendListContainer>
      <h3>フレンドリスト</h3>
      {friends.map((friend) => (
        <FriendItem key={friend.id}>
          <FriendAvatar src={friend.avatarUrl} alt={friend.username} />
          <FriendName>{friend.username}</FriendName>
          <OnlineStatus isOnline={friend.isOnline}>
            {friend.isOnline ? "オンライン" : "オフライン"}
          </OnlineStatus>
        </FriendItem>
      ))}
    </FriendListContainer>
  );
};

export default FriendList;
