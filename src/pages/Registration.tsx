import { useState } from 'react';
import { useNavigate } from 'react-router';
import useBoard from '../store/board';

const RegistrationPage = () => {
  const [room, setRoom] = useState("")
  const navigate = useNavigate()


  const { joinBoard } = useBoard()



  return (
    <div>
      <input type="text" placeholder='Board Id' onChange={(e) => setRoom(e.target.value)} />
      <button onClick={() => joinBoard(room, navigate)}>Join</button>
    </div>
  )
};

export default RegistrationPage;