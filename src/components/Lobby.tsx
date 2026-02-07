import { useEffect, useState } from "react"
import { RequestType, ResponseType, type CreateRoomRequest, type JoinRoomRequest, type SetNameRequest, type SocketRequest, type SocketResponse } from "../types/ws"
import type { Room as RoomType } from '../types/server'


type LobbyProps = {
    wsMessage: SocketResponse | undefined,
    sendRequest: (request: SocketRequest) => void
    setRoom: React.Dispatch<React.SetStateAction<RoomType | null>>,
    nickname: string,
    setNickname: React.Dispatch<React.SetStateAction<string>>
}


export default function Lobby({ wsMessage, sendRequest, setRoom, nickname, setNickname }: LobbyProps) {
    const [roomCodeInput, setRoomCodeInput] = useState('')

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toUpperCase()
        if (/^[A-Z]*$/.test(value)) {
            setRoomCodeInput(value)
        }
    }

    useEffect(() => {
        if (wsMessage?.type === ResponseType.SET_NAME) {
            setNickname(wsMessage.name)
        }
        else if (wsMessage?.type === ResponseType.CREATE_ROOM) {
            setRoom(wsMessage.room)
        }
        else if (wsMessage?.type === ResponseType.JOIN_ROOM) {
            if (!wsMessage.room) {
                alert('Room not found')
            } else {
                setRoom(wsMessage.room)
            }
        }
    }, [wsMessage])

    const createRoom = () => {
        if (!nickname) {
            alert('Please set a nickname before creating a room')
            return
        }
        const createRoom: CreateRoomRequest = {
            type: RequestType.CREATE_ROOM
        }
        sendRequest(createRoom)
    }

    const joinRoom = () => {
        if (!nickname) {
            alert('Please set a nickname before joining a room')
            return
        }
        if (roomCodeInput.length !== 5) {
            alert('Room code must be 5 letters')
            return
        }
        const joinRoom: JoinRoomRequest = {
            type: RequestType.JOIN_ROOM,
            roomId: roomCodeInput
        }
        sendRequest(joinRoom)
    }

    const handleSetNickname = (name: string) => {
        const request: SetNameRequest = {
            type: RequestType.SET_NAME,
            name: name
        }
        sendRequest(request)
    }

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <p>Nickname: {nickname}</p>
                    {!nickname && (
                        <button
                            onClick={() => handleSetNickname(prompt('Enter your nickname:') || '')}
                            style={{ height: '20px' }}
                        >
                            Set Nickname
                        </button>
                    )}
                </div>
                <button
                    onClick={createRoom}
                    style={{
                        height: '2rem',
                        marginBottom: '10px'
                    }}>
                    Create Room
                </button>
                <div style={{
                    height: '2rem',
                    display: 'flex'
                }}>
                    <input type="text" maxLength={5} value={roomCodeInput} onChange={handleInputChange} />
                    <button
                        onClick={joinRoom}
                    >
                        JOIN
                    </button>
                </div>
            </div>
        </>
    )
}