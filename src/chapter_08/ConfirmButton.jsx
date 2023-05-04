import React,{useState} from "react";

function ConfirmedButton(props){
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed((prevIsConfirmed) => !prevIsConfirmed);
  };

    return(
      <button
        onClick = {handleConfirm}
        disabled = {isConfirmed}
      >
        {isConfirmed ? "확인 됨" : "확인하기"}
      </button>
    )
}

export default ConfirmedButton;