import "bootstrap/dist/css/bootstrap.min.css";
import { socket } from "./socket.js";
import React, { useState, useEffect } from "react";
import { serverErrorContract, eventContract } from "./ServerContracts.js";
import "./HomePage.css";
import GameView from "./GameView.js";

const ClientState = {
  Free: "free",
  AwaitingResponse: "awaitingResponse",
};

const UsernameBounds = {
  Upper: 11,
  Lower: 4,
};

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [roomID, setRoomID] = useState("");
  const [game, setGame] = useState(null);

  const [serverConnected, setServerConnected] = useState(socket.connected);
  const [roomConnected, setRoomConnected] = useState(false);
  const [clientState, setClientState] = useState(ClientState.Free);
  const [error, setError] = useState("");

  function JoinRoom(roomID) {
    if (!UsernameValid() || roomID.length !== 6) return;
    socket.emit(eventContract.ConnectToRoom, {
      username: username,
      roomID: roomID,
    });
    setClientState(ClientState.AwaitingResponse);
  }

  useEffect(() => {
    function onConnect() {
      setServerConnected(true);
    }

    function onDisconnect() {
      setServerConnected(false);
    }

    function onGameUpdate(data) {
      setGame(data);
    }
    function onConnectToRoom() {
      setRoomConnected(true);
      setClientState(ClientState.Free);
    }
    function onNewRoomID(data) {
      //This means we have recieved a room to join.
      //Update State
      setRoomID(data);
      //Join that room id
      JoinRoom(data);
    }

    function onServerError(error) {
      setError(error.message);
      if (error.code === serverErrorContract.UnableToCreateRoom) {
      } else if (error.code === serverErrorContract.RoomIsFull) {
      } else if (error.code === serverErrorContract.InvalidRoom) {
      } else if (error.code === serverErrorContract.NameExists) {
      }
      setRoomConnected("");
      setClientState(ClientState.Free);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(eventContract.GameUpdate, onGameUpdate);
    socket.on(eventContract.ConnectToRoom, onConnectToRoom);
    socket.on(eventContract.New_RoomID, onNewRoomID);
    socket.on(eventContract.ServerError, onServerError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(eventContract.GameUpdate, onGameUpdate);
      socket.off(eventContract.ConnectToRoom, onConnectToRoom);
      socket.off(eventContract.New_RoomID, onNewRoomID);
      socket.off(eventContract.ServerError, onServerError);
    };
  }, [
    game,
    username,
    error,
    serverConnected,
    roomConnected,
    roomID,
    clientState,
    JoinRoom,
  ]);

  function HandleJoinClick() {
    if (clientState !== ClientState.Free) return;
    JoinRoom(roomID);
    setClientState(ClientState.AwaitingResponse);
    setError("");
  }

  function HandleNewRoomClick() {
    if (clientState !== ClientState.Free) return;
    socket.emit(eventContract.OpenNewRoom);
    setClientState(ClientState.AwaitingResponse);
    setError("");
  }

  function UsernameValid() {
    return (
      UsernameBounds.Lower <= username.length &&
      username.length <= UsernameBounds.Upper
    );
  }
  function HandleUsernameChange(e) {
    var value = e.target.value;
    value = value.toUpperCase();
    setUsername(value);
  }
  function HandleRoomIDChange(e) {
    var value = e.target.value;
    value = value.toUpperCase();
    setRoomID(value);
  }

  var errorBlock;
  if (error) {
    errorBlock = <p>Error: {error}</p>;
  } else errorBlock = <></>;

  if (!serverConnected) return <div>Connected to Server...{errorBlock}</div>;
  if (!roomConnected) {
    const enterNameBlock = (
      <div>
        <p>Enter Name</p>
        <input
          className="capital-input"
          type="text"
          id="usernameEntry"
          name="usernameEntry"
          required
          minlength={UsernameBounds.Lower}
          maxlength={UsernameBounds.Upper}
          size="10"
          onChange={HandleUsernameChange}
        />
        <br />
        <br />
      </div>
    );
    const enterRoomKeyBlock = (
      <div>
        <p>Enter Room Key</p>
        <input
          className="capital-input"
          type="text"
          id="roomIDEntry"
          name="roomIDEntry"
          required
          minlength="6"
          maxlength="6"
          size="10"
          onChange={HandleRoomIDChange}
        />
      </div>
    );
    if (UsernameValid() && clientState === ClientState.Free) {
      return (
        <div>
          {enterNameBlock}
          {enterRoomKeyBlock}
          <button onClick={HandleJoinClick}>Join Room</button>
          <br />
          <br />
          <button onClick={HandleNewRoomClick}>Create New Room</button>
          {errorBlock}
        </div>
      );
    } else {
      return (
        <div>
          {enterNameBlock}
          {enterRoomKeyBlock}
          <button onClick={HandleJoinClick} disabled>
            Join Room
          </button>
          <br />
          <br />
          <button onClick={HandleNewRoomClick} disabled>
            Create New Room
          </button>
          {errorBlock}
        </div>
      );
    }
  }

  if (error) return errorBlock;

  return (
    <GameView socket={socket} username={username} roomID={roomID} game={game} />
  );
}
