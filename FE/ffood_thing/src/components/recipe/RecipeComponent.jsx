import React, { useRef, useState, useEffect } from "react"
import PropTypes from "prop-types"
import HTMLFlipBook from "react-pageflip"
import "../styles/RecipeComponent.css" // styles 폴더의 RecipeComponent.css 파일 불러오기

// 페이지 커버
const PageCover = React.forwardRef((props, ref) => {
  return (
    <div className="page page-cover" ref={ref} data-density="hard">
      <div className="page-content">
        <h2>{props.children}</h2>
      </div>
    </div>
  )
})

PageCover.displayName = "PageCover"
PageCover.propTypes = {
  children: PropTypes.node.isRequired,
}

// 왼쪽 페이지
const LeftPage = React.forwardRef((props, ref) => {
  return (
    <div className="page page-left" ref={ref}>
      <div className="page-content">
        <div className="page-text">{props.children}</div>
      </div>
    </div>
  )
})

LeftPage.displayName = "LeftPage"
LeftPage.propTypes = {
  children: PropTypes.node.isRequired,
}

// 오른쪽 페이지
const RightPage = React.forwardRef((props, ref) => {
  return (
    <div className="page page-right" ref={ref}>
      <div className="page-content">
        <div className="page-image">{/* 이미지가 들어갈 공간에 하얀 박스 */}</div>
      </div>
    </div>
  )
})

RightPage.displayName = "RightPage"
RightPage.propTypes = {
  image: PropTypes.string,
}

// 페이지 데이터
const pagesData = [
  { text: "페이지 1의 텍스트 내용", image: "https://picsum.photos/200/300" },
  { text: "페이지 2의 텍스트 내용", image: "https://picsum.photos/200/300" },
  { text: "페이지 3의 텍스트 내용", image: "https://picsum.photos/200/300" },
  // 더 많은 테스트 데이터를 추가
]

// 책 컴포넌트
const RecipeComponent = () => {
  const flipBook = useRef()
  const [page, setPage] = useState(0)
  const [randomizedPages, setRandomizedPages] = useState([])
  const totalPages = pagesData.length * 2 + 2 // 총 페이지 수 계산 (앞/뒤 페이지 포함)

  useEffect(() => {
    const shuffledPages = pagesData.flatMap((data, index) =>
      Math.random() > 0.5
        ? [<LeftPage key={`left-${index}`}>{data.text}</LeftPage>, <RightPage key={`right-${index}`} image={data.image} />]
        : [<RightPage key={`right-${index}`} image={data.image} />, <LeftPage key={`left-${index}`}>{data.text}</LeftPage>]
    )
    setRandomizedPages(shuffledPages)
  }, []) // 빈 배열로 설정

  const onPage = (e) => {
    if (e && e.data !== undefined) {
      setPage(e.data)
    }
  }

  const closeModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      document.querySelector(".modal-overlay").style.display = "none"
    }
  }

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content">
        <button className="close-button">&times;</button>
        <div className="book-container">
          <HTMLFlipBook
            width="100%" // 책의 너비를 100%로 설정
            height="100%" // 책의 높이를 100%로 설정
            size="stretch"
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={false}
            onFlip={onPage}
            className="demo-book"
            ref={flipBook}
            flippingTime={700} // 페이지 넘김 시간 조절
            style={{ width: "100%", height: "100%" }} // 책의 크기를 부모 요소에 맞게 조정
          >
            <PageCover>BOOK TITLE</PageCover>
            {randomizedPages}
            <PageCover>THE END</PageCover>
          </HTMLFlipBook>
        </div>
        <div className="page-info">
          {page + 1} / {totalPages}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return <RecipeComponent />
}
