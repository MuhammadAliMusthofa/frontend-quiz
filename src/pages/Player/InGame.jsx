import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Statistik from "./Statistik";

const InGame = () => {
  const { gameCode } = useParams();
  const [status, setStatus] = useState("waiting");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const [showAnswerSummary, setShowAnswerSummary] = useState(false); // State untuk menampilkan total jawaban
  const [answerSummary, setAnswerSummary] = useState(null); // State untuk menyimpan total jawaban
  const [selesai, setselesai] = useState(false);
  const [waktuMundur , setwaktuMundur] = useState(1000);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // State untuk melacak jawaban yang dipilih
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://103.235.73.11:4001/api/quiz_list/${gameCode}`
        );
        if (response.ok) {
          const data = await response.json();
          setStatus(data.data[0].status);
          setQuestions(data.data);
        } else {
          console.error("Failed to fetch game status:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching game status:", error);
      }
    };

    fetchData();
  }, [gameCode]);
  console.log(countdown);

  function DelayWaktu(i) {
    return new Promise((resolve) => setTimeout(resolve, i));
  }


  useEffect(() => {
    const interval = setInterval(() => {
      setwaktuMundur(1000)
      if (status === "ingame") {
        setselesai(false)
        if (!showAnswerSummary) {
          // Jika tidak menampilkan total answer, jalankan interval untuk pertanyaan
          setCountdown((prevCountdown) => {
            // console.log(`prevCountdown`,prevCountdown)
            if (prevCountdown === 1) {
              if (currentQuestionIndex === questions.length - 1   ) {
                // Jika ini adalah pertanyaan terakhir, arahkan ke halaman finish
                // clearInterval(interval); // Hentikan interval
                navigate(`/finish/${gameCode}`); // Navigasi ke halaman finish
                // return ; // Atur countdown ke 0 agar tidak lanjut ke pertanyaan berikutnya
              } else {
                setCurrentQuestionIndex(
                  (prevIndex) => (prevIndex + 1) % questions.length
                ); // Go to the next question
                setwaktuMundur(5000)
                setselesai(true)
                // return 10; // Reset countdown to 10 seconds for the next question
              }
              
            } else {
              return prevCountdown - 1; // Decrease countdown every second
            }
          });
        }
      }
    }, waktuMundur); // Update countdown every second
    // Membersihkan interval saat komponen dilepas atau ketika menampilkan total answer
    console.log(`waktuMundur`,waktuMundur)
    return () => clearInterval(interval);
  }, [status, questions.length, showAnswerSummary,waktuMundur]);

 

  const timer = 10;
  const handleAnswerSelection = async (e,answer) => {
    const answerOption = e.target.id;
    console.log(e.target.id)
    // console.log(answer)
    try {
      // Mengambil player_id dari localStorage
      const playerId = sessionStorage.getItem('playerId');
      // const optionNumber = answer.charAt(answer.length - 1);
      setSelectedAnswer(answer); // Menetapkan jawaban yang dipilih
      const response = await fetch(`http://103.235.73.11:4001/api/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_id: playerId,
          question_id: questions[currentQuestionIndex]?.question_id,
          answer_text: answerOption,
          countdown: timer - countdown, // Ganti dengan nilai countdown yang sesuai
          game_code: gameCode,
        }),
      });
      if (response.ok) {
        console.log("Answer submitted successfully");
      } else {
        console.error("Failed to submit answer:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  return (
    <div className="container">
      {selesai && (<Statistik 
        gameCode={gameCode} 
        currentQuestionIndex={currentQuestionIndex === questions.length -1 ? currentQuestionIndex  : currentQuestionIndex -1  } 
        questions={questions} 
        setCountdown={setCountdown} // Melewatkan prop setCountdown ke komponen Statistik
       />)} 

      <div className="card shadow col-md-6 mx-auto mt-5 p-4">
        {status === "waiting" ? (
          <h1 className="text-center mb-4">
            Menunggu Game Dimulai Oleh Host....
          </h1>
        ) : status === "ingame" && selesai == false ? (
          <div className="text-center">
            <h1 className="mb-4">Kuis {currentQuestionIndex +1}</h1>
            <div>
              <h1 className="display-1">{countdown}</h1>
              
              <ul className="list-group">
              <li 
                className={`list-group-item ${selectedAnswer === questions[currentQuestionIndex]?.option1 ? "active" : ""}`}
               id="option1"
                onClick={(e,w) => handleAnswerSelection(e,questions[currentQuestionIndex]?.option1)}
                disabled={selectedAnswer !== null && selectedAnswer !== questions[currentQuestionIndex]?.option1}
              >
                {questions[currentQuestionIndex]?.option1}
              </li>
              <li 
                className={`list-group-item ${selectedAnswer === questions[currentQuestionIndex]?.option2 ? "active" : ""}`}
                onClick={(e,w) => handleAnswerSelection(e,questions[currentQuestionIndex]?.option2)}

                disabled={selectedAnswer !== null && selectedAnswer !== questions[currentQuestionIndex]?.option2}
                id="option2"
              >
                {questions[currentQuestionIndex]?.option2}
              </li>
              <li 
                className={`list-group-item ${selectedAnswer === questions[currentQuestionIndex]?.option3 ? "active" : ""}`}
                onClick={(e,w) => handleAnswerSelection(e,questions[currentQuestionIndex]?.option3)}
                disabled={selectedAnswer !== null && selectedAnswer !== questions[currentQuestionIndex]?.option3}
                id="option3"
              >
                {questions[currentQuestionIndex]?.option3}
              </li>
              <li 
                className={`list-group-item ${selectedAnswer === questions[currentQuestionIndex]?.option4 ? "active" : ""}`}
                onClick={(e,w) => handleAnswerSelection(e,questions[currentQuestionIndex]?.option4)}

                disabled={selectedAnswer !== null && selectedAnswer !== questions[currentQuestionIndex]?.option4}
                id="option4"
              >
                {questions[currentQuestionIndex]?.option4}
              </li>
            </ul>
            </div>
          </div>
        ) : (
          <h1 className="text-center mb-4">Total Player Menjawab</h1>
        )}
      </div>

     
    </div>
  );
};

export default InGame;

