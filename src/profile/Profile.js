import React, { useEffect } from 'react'
import "./profile.css";
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { Modal } from 'antd';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import LineChart from './Chart';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { useSelector } from 'react-redux';
function Profile() {
    let pPicture = localStorage.getItem('profilePicture')
    useEffect(() => {
    }, [pPicture])

    const [profileImage, setProfileImage] = useState(pPicture)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const setProfilePic = (Picture) => {
        localStorage.setItem('profilePicture', Picture)
        pPicture = localStorage.getItem('profilePicture')
        setProfileImage(pPicture)

    }

    const imageSources = [
        require("./imges/12.jpg"),
        require("./imges/13.jpg"),
        require("./imges/12.jpg"),
        require("./imges/13.jpg"),
    ];

    let mathematicsArray = JSON.parse(localStorage.getItem("mathematics")) || [];
    let lengthOfArray = [];
    for (let i = 1; i < mathematicsArray.length + 1; i++) {
        lengthOfArray.push(i);
    }
    const mathAverage = mathematicsArray.reduce((a, b) => a + b, 0) / mathematicsArray.length;

    const [mathematics, setMathematics] = useState({
        labels: lengthOfArray,
        datasets: [
            {
                label: "Track Your Score",
                data: mathematicsArray,
                backgroundColor: [
                    "white",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0",
                ],
                borderWidth: 1,
                borderColor: 'white',

            },
        ],
    });


    let quickReflexesArray = JSON.parse(localStorage.getItem("quickreflexes")) || [];
    let lengthOfQuickReflexesArray = [];
    for (let i = 1; i < quickReflexesArray.length + 1; i++) {
        lengthOfQuickReflexesArray.push(i);
    }
    const quickReflexesAverage = quickReflexesArray.reduce((a, b) => a + b, 0) / quickReflexesArray.length;

    const [quickreflexes, setQuickreflexes] = useState({
        labels: lengthOfQuickReflexesArray,
        datasets: [
            {
                label: "Track Your Score",
                data: quickReflexesArray,
                backgroundColor: [
                    "white",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0",
                ],
                borderWidth: 1,
                borderColor: 'white',

            },
        ],
    });


    const user = useSelector((state) => state.user);
    const [savedScores, setSavedScores] = useState({});

    const fetchScores = async () => {
        const scoreRequests = [1, 2, 3].map(async (gameId) => {
            try {
                const response = await axios.get(`http://localhost:5000/api/game/${user._id}/MemoryMatch/${gameId}`);
                return response.data;
            } catch (err) {
                console.error(err);
                return null;
            }
        });
        const scores = await Promise.all(scoreRequests);
        setSavedScores(
            scores.reduce(
                (acc, scoreData, index) => {
                    if (scoreData) {
                        acc[`savedScore${index + 1}`] = scoreData.timer;

                    }
                    return acc;
                },
                {}
            )
        );
    };

    // setTimeout(() => {
    //     setfirst(first +1)
    //   }, "2000");


    let level1TimeInSeconds;
    let level2TimeInSeconds;
    let level3TimeInSeconds;
    const [first, setfirst] = useState(1)

    useEffect(() => {
        fetchScores().then(() => {
            const level1Time = savedScores.savedScore1;
            const level2Time = savedScores.savedScore2;
            const level3Time = savedScores.savedScore3;

            const timeStr = '00 : 00 : 00';
            let level1TimeInSeconds, level2TimeInSeconds, level3TimeInSeconds;
            if (level1Time) {
                const [min, sec, ms] = level1Time.split(' : ').map(Number);
                level1TimeInSeconds = min * 60 + sec + ms / 1000;
                if (level2Time) {
                    const [min2, sec2, ms2] = level2Time.split(' : ').map(Number);
                    level2TimeInSeconds = min2 * 60 + sec2 + ms2 / 1000;
                }
                if (level3Time) {
                    const [min3, sec3, ms3] = level3Time.split(' : ').map(Number);
                    level3TimeInSeconds = min3 * 60 + sec3 + ms3 / 1000;
                }
            } else {
                const [min, sec, ms] = timeStr.split(' : ').map(Number);
                level1TimeInSeconds = min * 60 + sec + ms / 1000;
                setfirst((prevScore) => prevScore + 1);
                level2TimeInSeconds = level1TimeInSeconds;
                level3TimeInSeconds = level1TimeInSeconds;
            }
            setChartData(createChartData(level1TimeInSeconds, level2TimeInSeconds, level3TimeInSeconds));
        });
    }, [first]);

    const chartOptions = {
        scales: {
            x: {
                ticks: {
                    color: 'white' // add the color property
                  },
            },
            y: {
                beginAtZero: true, // start the Y axis at 0
                color: 'white', // add the color property
                title: {
                    display: true,
                    text: 'time',

                },
            },

        },
    };

    function createChartData(level1TimeInSeconds, level2TimeInSeconds, level3TimeInSeconds) {
        const data = [
            { level: 1, time: level1TimeInSeconds },
            { level: 2, time: level2TimeInSeconds },
            { level: 3, time: level3TimeInSeconds }
        ];

        const chartData = {
            labels: data.map((d) => `Level ${d.level}`),
            datasets: [
                {
                    label: "Time taken",
                    data: data.map((d) => d.time),
                    borderColor: "white",
                    backgroundColor: "white",
                    pointRadius: 5, // set the point radius to 5 pixels
                    pointHoverRadius: 8, // set the hover point radius to 8 pixels
                    borderWidth: 0
                }
            ]
        };

        return chartData;
    }

    const [chartData, setChartData] = useState(() => createChartData(level1TimeInSeconds));


    return (

        <main id='main'>
            <div class='section'>
                <Avatar size={240} icon={<UserOutlined />} src={profileImage} />
                <Button id='button' type="primary" onClick={() => { showModal() }}>
                    Change Picture
                </Button>
            </div>
            <Modal title="Choose Your Profile Picture" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {imageSources.map((src) => (
                    <a onClick={() => { setProfilePic(src); setIsModalOpen(false) }}>
                        <img src={src} id='pictures' />
                    </a>
                ))}
            </Modal>


            <div class='containergrid container'>
                <div class='gamecells'>
                    <h2 id='h2'>Mathematics  </h2>
                    <LineChart chartData={mathematics}  />
                    <p> {mathAverage ? `You average is ${mathAverage.toFixed(2)} ` : null}</p>

                </div>
                <div class='gamecells'>
                    <h2 id='h2'>Memory Match</h2>
                    <Line data={chartData} options={chartOptions} />
                </div>
                <div class='gamecells'>
                    <h2 id='h2'>Quick Reflexes</h2>
                    <LineChart chartData={quickreflexes}  />
                    <p> {quickReflexesAverage ? `You average is ${quickReflexesAverage.toFixed(2)} ` : null}</p>
                </div>
            </div>

            <div>
                your score looks nice
            </div>
        </main>
    )
}

export default Profile
