import React from "react";
import "../../styles/home/HomeBigButton.css";

const HomeBigButton = () => {
  const cards = [
    {
      id: 1,
      backgroundImage: "/images/메인페이지1.jpg",
      title: "레시피",
      location: "수만가지 레시피를 확인해보세요.",
      duration: "3d",
    },
    {
      id: 2,
      backgroundImage: "/images/메인페이지2.jpg",
      title: "오늘 뭐 먹지?",
      location: "오늘 먹을 음식을 추천받아보세요.",
      duration: "4d",
    },
    {
      id: 3,
      backgroundImage: "/images/메인페이지3.jpg",
      title: "AI 음식 추천",
      location: "내 맞춤 음식 추천을 받아보세요.",
      duration: "5d",
    },
    {
      id: 4,
      backgroundImage: "/images/메인페이지4.jpg",
      title: "SNS",
      location: "내가 만든 음식을 공유해봐요.",
      duration: "2d",
    },
  ];

  return (
    <div className="container px-4 py-5" id="custom-cards">
      <h2 className="pb-2 border-bottom">Custom cards</h2>
      <div className="row row-cols-1 row-cols-md-2 align-items-stretch g-4 py-5">
        {cards.map((card) => (
          <div className="col" key={card.id}>
            <div
              className="card"
              style={{ backgroundImage: `url(${card.backgroundImage})` }}
            >
              <div className="content">
                
                <ul className="d-flex list-unstyled mt-auto">
                  {/* <li className="me-auto">
                    <img
                      src="https://github.com/twbs.png"
                      alt="Bootstrap"
                      width="32"
                      height="32"
                      className="rounded-circle border border-white"
                    />
                  </li> */}
                  <h3>{card.title}</h3>
                  <li className="d-flex align-items-center me-3">
                    <svg className="bi me-2" width="1em" height="1em">
                      <use xlinkHref="#geo-fill" />
                    </svg>
                    <small>{card.location}</small>
                  </li>
                  <li className="d-flex align-items-center">
                    <svg className="bi me-2" width="1em" height="1em">
                      <use xlinkHref="#calendar3" />
                    </svg>
                    {/* <small>{card.duration}</small> */}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeBigButton;
